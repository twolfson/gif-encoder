// https://github.com/twolfson/gif-encoder/issues/5
var Canvas = require('canvas');
var GIFEncoder = require('./');
var fs = require('fs');
var WIDTH = 100;
var HEIGHT = 100;
var STEP = 10;
var canvas = new Canvas(WIDTH, HEIGHT),
    ctx = canvas.getContext('2d');

var encoder = new GIFEncoder(WIDTH, HEIGHT);
encoder.pipe(fs.createWriteStream(__dirname + '/test.gif'));
encoder.setRepeat(0);
encoder.setDelay(50);
// encoder.setTransparent(0xFF00FF);
encoder.writeHeader();
for(var i = 0; i < STEP; i++) {
    ctx.fillStyle = '#FF00FF';
    ctx.fillRect(0,0, WIDTH, HEIGHT);
    ctx.fillStyle = '#000000';
    ctx.fillRect(i * WIDTH / STEP, 4 * HEIGHT / STEP, WIDTH / STEP, HEIGHT / STEP);
    encoder.addFrame(ctx.getImageData(0, 0, WIDTH, HEIGHT).data);
}
encoder.finish();
