var assert = require('assert');
var fs = require('fs');

var async = require('async');
var ndarrayFill = require('ndarray-fill');
var zeros = require('zeros');

var GifEncoder = require('../lib/GIFEncoder.js');
var checkerboardPixels = require('./test-files/checkerboard-pixels.json');

function createGif(height, width, options) {
  before(function () {
    this.gif = new GifEncoder(height, width, options);
  });
}

describe('GifEncoder encoding a checkerboard', function () {
  createGif(10, 10);
  before(function () {
    this.gif.writeHeader();
    this.gif.addFrame(checkerboardPixels);
    this.gif.finish();
  });
  before(function (done) {
    this.gif.once('readable', done);
  });

  it('generates the expected bytes', function () {
    // TODO: Output canvas to a file, perceptual diff GIF to canvas output =3
    // Grab the expected and actual content
    var expectedBytes = fs.readFileSync(__dirname + '/expected-files/checkerboard.gif');
    var actualBytes = this.gif.read();

    // DEV: Write out actual file to expected file
    if (process.env.DEBUG_TEST) {
      try { fs.mkdirSync(__dirname + '/actual-files'); } catch (e) {}
      fs.writeFileSync(__dirname + '/actual-files/checkerboard.gif', actualBytes);
    }

    // Assert the expected matches the actual content
    assert.deepEqual(expectedBytes, actualBytes);
  });
});

describe('GifEncoder encoding a multi-framed checkerboard', function () {
  createGif(10, 10);
  before(function () {
    this.gif.writeHeader();
    this.gif.setDelay(500);
    this.gif.setRepeat(0);
    this.gif.addFrame(checkerboardPixels);
    this.gif.addFrame(require('./test-files/inverse-checkerboard-pixels.json'));
    this.gif.finish();
  });
  before(function (done) {
    this.gif.once('readable', done);
  });

  it('generates the expected bytes', function () {
    var expectedBytes = fs.readFileSync(__dirname + '/expected-files/alternating-checkerboard.gif');
    var actualBytes = this.gif.read();
    if (process.env.DEBUG_TEST) {
      try { fs.mkdirSync(__dirname + '/actual-files'); } catch (e) {}
      fs.writeFileSync(__dirname + '/actual-files/alternating-checkerboard.gif', actualBytes);
    }
    assert.deepEqual(expectedBytes, actualBytes);
  });
});

describe('GifEncoder encoding an overly large, underly read checkerboard', function () {
  createGif(10, 10);
  before(function (done) {
    var that = this;
    this.gif.writeHeader();
    this.gif.on('error', function saveError (err) {
      that.error = err;
    });

    // Write out a new frame until we encounter an error
    // DEV: This is async so mocha can time us out
    async.until(function errorHasOccurred () {
      return that.error;
    }, function addNewFrame(cb) {
      process.nextTick(function () {
        that.gif.addFrame(checkerboardPixels);
        cb();
      });
    }, done);
  });

  it('emits an error', function () {
    assert.notEqual(this.error, undefined);
  });
});

describe('GifEncoder encoding a multi-framed image with a transparent background', function () {
  createGif(15, 15);
  before(function () {
    this.gif.writeHeader();
    this.gif.setDelay(500);
    this.gif.setTransparent(0xFF00FF);
    this.gif.setRepeat(0);
    var i = 0;
    for (; i < 3; i++) {
      // DEV: We are drawing a diagonally moving dot
      // +------+    +------+    +------+
      // |xx    |    |      |    |      |
      // |xx    |    |      |    |      |
      // |      | -> |  xx  | -> |      |
      // |      | -> |  xx  | -> |      |
      // |      |    |      |    |    xx|
      // |      |    |      |    |    xx|
      // +------+    +------+    +------+

      // Generate our frame
      var frameNdarray = zeros([15, 15, 4]);
      ndarrayFill(frameNdarray, function fillFrame (x, y, rgbaIndex) {
        // If this is the alpha channel, always return it as full
        if (rgbaIndex === 3) {
          return 0xFF;
        }

        // Otherwise, if we are on our black dot, then draw it
        if (i * 5 <= x && x < (i + 1) * 5 &&
            i * 5 <= y && y < (i + 1) * 5) {
          // Generate black dot (00 00 00)
          return 0x00;
        // Otherwise, draw our transparent color
        } else {
          return rgbaIndex === 1 ? 0x00 : 0xFF;
        }
      });

      // Draw our frame
      this.gif.addFrame(frameNdarray.data);
    }
    this.gif.finish();
  });
  before(function (done) {
    this.gif.once('readable', done);
  });

  it('generates the expected bytes', function () {
    var expectedBytes = fs.readFileSync(__dirname + '/expected-files/moving-dot.gif');
    var actualBytes = this.gif.read();
    if (process.env.DEBUG_TEST) {
      try { fs.mkdirSync(__dirname + '/actual-files'); } catch (e) {}
      fs.writeFileSync(__dirname + '/actual-files/moving-dot.gif', actualBytes);
    }
    assert.deepEqual(expectedBytes, actualBytes);
  });
});

describe('GifEncoder encoding a checkerboard from indexed pixels', function () {
  createGif(10, 10);
  before(function () {
    this.gif.writeHeader();
    this.gif.addFrame([
      1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
      1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
      1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
      1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
      1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
      0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
      0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
      0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
      0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
    ], {
      palette: [0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF],
      indexedPixels: true
    });
    this.gif.finish();
  });
  before(function (done) {
    this.gif.once('readable', done);
  });

  it('generates the expected bytes', function () {
    // TODO: Output canvas to a file, perceptual diff GIF to canvas output =3
    // Grab the expected and actual content
    var expectedBytes = fs.readFileSync(__dirname + '/expected-files/checkerboard-indexed.gif');
    var actualBytes = this.gif.read();

    // DEV: Write out actual file to expected file
    if (process.env.DEBUG_TEST) {
      try { fs.mkdirSync(__dirname + '/actual-files'); } catch (e) {}
      fs.writeFileSync(__dirname + '/actual-files/checkerboard-indexed.gif', actualBytes);
    }

    // Assert the expected matches the actual content
    assert.deepEqual(expectedBytes, actualBytes);
  });
});
