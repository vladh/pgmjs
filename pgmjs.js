const fs = require('fs')
const util = require('util')
const PNG = require('pngjs').PNG

const SIGNATURES = {P5: 'P5', P2: 'P2', INVALID: 'invalid'}

function isCharWhitespace(char) {
  return (char >= 0x09 && char <= 0x0D) || char == 0x20
}

function getPixelSize(maxval) {
  if (maxval < 256) {
    return 1
  } else {
    return 2
  }
}

function parseSignature(signature) {
  if (signature == 'P5') {
    return SIGNATURES.P5
  } else if (signature == 'P2') {
    return SIGNATURES.P2
  } else {
    return SIGNATURES.INVALID
  }
}

function isMaxvalValid(maxval) {
  return maxval > 0 && maxval < 65536
}

async function readUntilWhitespace(file, fileSize, offset) {
  let currentByte = Buffer.alloc(1)
  let currentData = Buffer.alloc(0)
  for (let idx = offset; idx < fileSize; idx++) {
    await util.promisify(fs.read)(file, currentByte, 0, 1, idx)
    if (isCharWhitespace(currentByte[0]) || idx == fileSize - 1) {
      return [Buffer.from(currentData, 'hex').toString(), idx + 1]
    } else {
      currentData = Buffer.concat([currentData, currentByte])
    }
  }
}

async function readPixels(file, fileSize, offset, pixelSize, signature) {
  let pixels = []

  if (signature == SIGNATURES.P5) {
    let currentByte = Buffer.alloc(pixelSize)
    for (let idx = offset; idx < fileSize; idx++) {
      await util.promisify(fs.read)(file, currentByte, 0, pixelSize, idx)
      pixels.push(Buffer.from(currentByte, 'hex').readUIntBE(0, pixelSize))
    }
  } else if (signature == SIGNATURES.P2) {
    let idx = offset
    while (idx < fileSize) {
      const [pixel, pixelEnd] = await readUntilWhitespace(file, fileSize, idx)
      idx = pixelEnd
      pixels.push(+pixel)
    }
  }

  return pixels
}

async function readPgm(filePath) {
  let file = null
  try {
    file = await util.promisify(fs.open)(filePath, 'r')
  } catch (err) {
    console.error(err)
  }
  const fileInfo = await util.promisify(fs.stat)(filePath)
  const fileSize = fileInfo.size

  const [rawSignature, signatureEnd] = await readUntilWhitespace(file, fileSize, 0)
  const signature = parseSignature(rawSignature)
  if (signature == SIGNATURES.INVALID) {
    throw new Error('Invalid PGM file signature.')
  }
  const [width, widthEnd] = await readUntilWhitespace(file, fileSize, signatureEnd)
  const [height, heightEnd] = await readUntilWhitespace(file, fileSize, widthEnd)
  const [maxval, maxvalEnd] = await readUntilWhitespace(file, fileSize, heightEnd)
  if (!isMaxvalValid(maxval)) {
    throw new Error('Invalid PGM file Maxval.')
  }
  const pixelSize = getPixelSize(maxval)
  const pixels = await readPixels(file, fileSize, maxvalEnd, pixelSize, signature)

  return {signature, width, height, maxval, pixels}
}

async function writePngFromPgm(pgmData, outPath, colorMasks) {
  if (!colorMasks) {
    colorMasks = [[1, 1, 1]]
  }

  let newfile = new PNG({width: pgmData.width, height: pgmData.height})

  for (let y = 0; y < newfile.height; y++) {
    for (let x = 0; x < newfile.width; x++) {
      const idx = (newfile.width * y + x)
      const pngIdx = idx << 2
      const pixel = pgmData.pixels[idx] / pgmData.maxval * 255

      colorMaskIndex = Math.floor(Math.min(pixel, 254) / 255 * colorMasks.length)
      colorMask = colorMasks[colorMaskIndex]

      let rgbPixels = [
        pixel * colorMask[0],
        pixel * colorMask[1],
        pixel * colorMask[2],
      ]
      rgbPixels = rgbPixels.map((p) => Math.min(p, 255))
      newfile.data[pngIdx] = rgbPixels[0]
      newfile.data[pngIdx + 1] = rgbPixels[1]
      newfile.data[pngIdx + 2] = rgbPixels[2]
      newfile.data[pngIdx + 3] = 0xff
    }
  }

  return new Promise((resolve, reject) => {
    newfile
      .pack()
      .pipe(fs.createWriteStream(outPath))
      .on('finish', () => { resolve() })
      .on('error', () => { reject() })
  })
}

module.exports = {
  readPgm,
  writePngFromPgm,
}
