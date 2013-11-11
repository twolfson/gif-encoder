var fs = require('fs');
var GifEncoder = require('../lib/GIFEncoder.js');

describe('GifEncoder', function () {
  before(function () {
    this.gif = new GifEncoder();
  });

  describe('encoding a checkboard', function () {
    before(function () {
      var pixels = require('./test-files/checkboard-pixels.json');
      this.gif.writeHeader();
      this.gif.addFrame(pixels);
      this.gif.finish();
    });

    it('generates the expected bytes', function () {
      // TODO: Output bytes to file
      // TODO: Output canvas to a file, perceptual diff GIF to canvas output =3
      // var expectedBytes = fs.readFileSync(__dirname + '/expected-files/checkerboard.gif');
      var page = this.gif.out.pages[0];
      var actualBytes = new Buffer([].slice.call(page));

      // DEV: Write out actual file to expected file
      if (true) {
        try { fs.mkdirSync(__dirname + '/actual-files'); } catch (e) {}
        fs.writeFileSync(__dirname + '/actual-files/checkboard.gif', actualBytes);
      }
    });
  });
});
