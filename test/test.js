const pgmjs = require('../pgmjs')
const path = require('path')

pgmjs.readPgm(path.join(__dirname, 'test_p5.pgm')).then((pgmData) => {
  return pgmjs.writePngFromPgm(pgmData, path.join(__dirname, 'test_p5.png'))
})

pgmjs.readPgm(path.join(__dirname, 'test_p2.pgm')).then((pgmData) => {
  return pgmjs.writePngFromPgm(pgmData, path.join(__dirname, 'test_p2.png'))
})
