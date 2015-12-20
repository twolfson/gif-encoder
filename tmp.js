// https://github.com/twolfson/gif-encoder/issues/5
var Canvas = require('canvas');
var GIFEncoder = require('./');
var fs = require('fs');
var canvas = new Canvas(10, 10),
    ctx = canvas.getContext('2d');

var encoder = new GIFEncoder(10,10);
encoder.pipe(fs.createWriteStream(__dirname + '/test.gif'));
encoder.setRepeat(0);
encoder.setDelay(50);
// encoder.setTransparent(0xFF00FF);
encoder.writeHeader();
for(var i = 0; i < 10; i++) {
    ctx.fillStyle = '#FF00FF';
    ctx.fillRect(0,0,10,10);
    ctx.fillStyle = '#000000';
    ctx.fillRect(i*1,4,1,1);
    encoder.addFrame(ctx.getImageData(0, 0, 10, 10).data);
}
encoder.finish();
