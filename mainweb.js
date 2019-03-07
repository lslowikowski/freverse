var http = require('http');
var url = require('url');
var dbconnect = require('./dbconnect.js'); 
var mysql = require('mysql');

//obiekt con zawierające podstawowe informacje dotyczące połączenia
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sakila"
});

//tworzymy serwer
http.createServer(function (req, res) {
  //serwer zwraca dane nagłówkowe  
  res.writeHead(200, {
    "Access-Control-Allow-Origin": "*", "Content-Type": "application/json; charset=UTF-8"
  });
  //parsujemy przekazane parametry wywołania webservice
  //w obiekcie q znajdą się poszczegóelne parametry wywołania webservice
  var q = url.parse(req.url, true).query;    
  //res.end(dbconnect.fieldSize(con, q.tableSchema, q.tableName, q.columnName));
  dbconnect.fieldSize(con, q.tableSchema, q.tableName, q.columnName).then((data) => { 
    res.end(data);
  }).catch((err) => { 
    res.end(err); 
  });
}).listen(8080);

//http://localhost:8080/?tableSchema=SAKILA&tableName=FILM&columnName=TYTUL