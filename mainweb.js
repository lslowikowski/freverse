var http = require('http');
var url = require('url');
//var first_module = require('./first_module.js');
var dbconnect = require('./dbconnect.js'); 
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sakila"
});

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  var q = url.parse(req.url, true).query;  
  //res.write(first_module.myDateTime());
  //res.end(dbconnect.fieldSize(con, q.tableSchema, q.tableName, q.columnName));
  dbconnect.fieldSize(con, q.tableSchema, q.tableName, q.columnName).then((data) => { 
    res.end(data);
  }).catch((err) => { 
    res.end(err); 
  });
}).listen(8080);

//http://localhost:8080/?tableSchema=SAKILA&tableName=FILM&columnName=TYTUL