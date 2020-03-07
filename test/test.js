const pgmjs = require('../pgmjs')
const path = require('path')

const colorMasks = [
  null,
  [[1,1,1]],
  [[1,0,0]],
  [[0,1,0]],
  [[0,0,1]],
  [[1,0,1]],
  [[1,1,0]],
  [[0,1,1]],
  [[1,0,0], [0,1,0]],
  [[0,0,1], [0,1,0], [1,0,0]],
  [[0,0,1], [1,0,1], [1,0,0], [1,1,0]], // nice one!
  [[1,1,0], [1,0.5,0], [1,0,0], [1,0,1], [1,1,1]],
  [[0,0,1], [0,0,1], [1,0,0], [1,0.5,0], [0,1,1], [1,0,1]],
  [[0.5,0,0.5], [0.7,0,0.7], [1,0,1], [1,0.5,0], [1,0,0]],
]

pgmjs.readPgm(path.join(__dirname, 'test_p5.pgm')).then((pgmData) => {
  console.log(pgmData)
  colorMasks.forEach((colorMask, idx) => {
    pgmjs.writePngFromPgm(pgmData, path.join(__dirname, 'test_p5_' + idx + '.png'), colorMask)
  })
})

pgmjs.readPgm(path.join(__dirname, 'test_p2.pgm')).then((pgmData) => {
  console.log(pgmData)
  colorMasks.forEach((colorMask, idx) => {
    pgmjs.writePngFromPgm(pgmData, path.join(__dirname, 'test_p2_' + idx + '.png'), colorMask)
  })
})
