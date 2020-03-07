# pgmjs

![](doc/demo1.png) ![](doc/demo2.png) ![](doc/demo3.png)

A pure Javascript library to work with PGM files. Supports both plain and raw PGM. Also supports
adding color filters to your images.

I wrote this to convert PGM images from the Game Boy Camera to PNG. Confusingly, these images are
sometimes in raw PGM and sometimes in plain PGM format. I decided to write a plain JS library
because the only available options used underlying native modules which are cumbersome to work
with.

Feature requests and pull requests are very welcome. At the moment I only implemented the
functionality I myself needed.

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
* `pixels`: An array with the individual pixel values as numbers from `0` to `maxval`, from top
* left to bottom right, rows first then columns

### `writePngFromPgm(pgmData, outPath, colorMasks)`

For a given PGM file, convers it to PNG and writes that as a file.

#### Arguments

* `pgmData`: An object as returned by `readPgm()`
* `outPath`: The path to write the PNG file to
* `colorMasks`: An array of color masks, so for example `[[0,0,1], [0.9,0,0.9]]`. See below.

#### Returns

A Promise.

## Color Masks

Color masks allow you to add filters (think Instagram color filters) to your exported images. A
color mask looks like this:

```
[1, 0, 1] // R, G, B
```

These values basically scale the red, green, and blue output values, so an image with the above
mask applied will have a purple tint.

Things become more interesting when you apply multiple color masks. For example:

```
[[0,0,1], [1,0,1], [1,0,0], [1,1,0]]
```

An image with this color mask applied will have a nice blue-purple-red-yellow color palette. This
works quite simply — the image's brightness values are segmented into 4 (the number of masks)
buckets, and each bucket is multiplied by its respective color mask.  So in this example, dark
segments will be tinted blue, medium dark segments purple, brighter segments red, and the brightest
segments yellow.  This gives the images a nice look. The above array of color masks is the format
that `writePngFromPgm()` takes its color masks in.

## Tests

There is only a very simple test in `test/test.js` which runs the PNG conversion on both a raw PGM
and plain PGM picture.

## Credits

By [Vlad-Stefan Harbuz](https://vladh.net).

PNG conversion using [pngjs by Luke Page](https://github.com/lukeapage/pngjs).

Football image in `test/test_p5.pgm` by [Sven Dahlstrand](https://github.com/svendahlstrand).
