var http = require('http');
var url = require('url');
var first_module = require('./first_module.js');


http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  var q = url.parse(req.url, true).query;
  var txt = q.year + " " + q.month;
  res.write(first_module.myDateTime());
  res.end(txt);
}).listen(8080);

//http://localhost:8080/?year=2017&month=July