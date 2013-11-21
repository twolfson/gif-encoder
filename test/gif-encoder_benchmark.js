var imageUtils = require('./utils/image');
var GifEncoder = require('../');

describe('A GifEncoder', function () {
  describe('encoding a bunch of frames to `data` events', function () {
    before(function createGifEncoder () {
      this.gif = new GifEncoder(200, 200);
      this.gif.writeHeader();

      // Pipe output to nowhere
      // TODO: Do the same for .read()
      this.gif.on('data', function () {});
    });
    imageUtils.load('medium-size.png');
    before(function encodeABunchOfFrames () {
      var startTime = Date.now();
      var i = 500;
      var gif = this.gif;
      var pixels = this.pixels;
      while (i--) {
        gif.addFrame(pixels);
      }
      var endTime = Date.now();
      this.totalTime = endTime - startTime;
    });

    it('can do so efficiently', function () {
      // TODO: Move to frames/second via benchmarkjs?
      // 13585 for chunked events
      // Medium size x 500 frames 14245 ms for byte by byte
      // However, there is a process.nextTick overflow with all the events
      console.log('Medium size x 500 frames', this.totalTime + ' ms');
    });
  });
});