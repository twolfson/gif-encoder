var GifEncoder = require('../lib/GIFEncoder.js');

describe('GifEncoder', function () {
  before(function () {
    this.gif = new GifEncoder();
  });

  describe('encoding a checkboard', function () {
    before(function () {
      var pixels = require('./test-files/checkboard-pixels.json');
      this.gif.addFrame(pixels);
    });

    it('generates the expected bytes', function () {
      // TODO: Output bytes to file
      // var expectedBytes = require('./expected-files/checkboard.gif');
      console.log(this.gif.out);
    });
  });
});
