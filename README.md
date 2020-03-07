# pgmjs

A pure Javascript library to work with PGM files.  Supports both plain and raw PGM.

I wrote this to convert PGM images from the Game Boy Camera to PNG. Confusingly, these images are sometimes in raw PGM and sometimes in plain PGM format. I decided to write a plain JS library because the only available options used underlying native modules which are cumbersome to work with.

Feature requests and pull requests are very welcome. At the moment I only implemented the functionality I myself needed.

Fun note: filters could be added in the PNG output step of `writePngFromPgm()`.

## API

### `readPgm(filePath)`

For a given file path, returns an object describing the PGM data.

#### Arguments

* `filePath`: Path of the file to read

#### Returns

A Promise containing an Object with:

* `signature`: `P5` or `P2` (or `invalid`)
* `width`: The image width
* `height`: The image height
* `maxval`: The maximum gray value
* `pixels`: An array with the individual pixel values as numbers from `0` to `maxval`, from top left to bottom right, rows first then columns

### `writePngFromPgm(pgmData, outPath)`

For a given PGM file, convers it to PNG and writes that as a file.

#### Arguments

* `pgmData`: An object as returned by `readPgm()`
* `outPath`: The path to write the PNG file to

#### Returns

A Promise.

## Tests

There is only a very simple test in `test/test.js` which runs the PNG conversion on both a raw PGM and plain PGM picture.

## Credits

By [Vlad-Stefan Harbuz](https://vladh.net).

PNG conversion using [pngjs by Luke Page](https://github.com/lukeapage/pngjs).

Football image in `test/test_p5.pgm` by [Sven Dahlstrand](https://github.com/svendahlstrand).
