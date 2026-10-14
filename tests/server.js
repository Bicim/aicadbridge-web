/* tests/server.js - dogrulama icin minik statik sunucu (8124) */
'use strict';
var http = require('http');
var fs = require('fs');
var path = require('path');

var ROOT = path.join(__dirname, '..');
var PORT = process.env.PORT || 8124;

var MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

var server = http.createServer(function (req, res) {
  var urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  var file = path.normalize(path.join(ROOT, urlPath));
  if (!file.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
  fs.readFile(file, function (err, data) {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('not found'); return; }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    res.end(data);
  });
});

if (require.main === module) {
  server.listen(PORT, function () { console.log('serving at http://localhost:' + PORT); });
} else {
  module.exports = server;
}
