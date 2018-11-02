# gif-encoder changelog
0.7.2 - Removed accidental length requirement documentation. Fixes #18

0.7.1 - Fixed supported Node.js versions and Travis CI

0.7.0 - Added support for palette and indexed pixels via @nurpax in #15

0.6.1 - Replaced Gratipay with support me page

0.6.0 - Repaired transparency support via @scinos in #7

0.5.0 - Dropped Node.js@0.8.0 support and updated Travis CI versions

0.4.3 - Removed global variable leak via @mattbierner in #6

0.4.2 - Added foundry for releases

0.4.1 - Introducing performance comparison between byte by byte buffers vs frame based buffers.

0.4.0 - Broke down `getImagePixels` into `removeAlphaChannel` and `setImagePixels`

0.3.0 - Moved to readable-stream for streams1/streams2 functionality

0.2.0 - Moved to larger chunked data events

0.1.0 - Moved to stream-like API (copied from gifsockets-server#f385006)

0.0.3 - Added basic info to README

0.0.2 - Added test for original GIFEncoder functionality

0.0.1 - Initial fork from gif.js#faee238
