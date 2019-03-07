var http = require('http');
var url = require('url');
var dbconnect = require('./dbconnect.js'); 
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sakila"
});
//w parametrze req - znajduje się zapytanie (request) do webserwisu
//w parametrze res - zwracamy odpowiedź z webserwisu
http.createServer(function (req, res) {
  // 200 oznacza że zapytanie się powiodło
  //  {'Content-Type': 'text/html'} - to typ zwracanych danych
  res.writeHead(200, {'Content-Type': 'text/html'});
  //parsujemy url zapytania (requestu) - szczegóły: https://millermedeiros.github.io/mdoc/examples/node_api/doc/url.html
  var q = url.parse(req.url, true).query;  
  //res.write(first_module.myDateTime());
  //res.end(dbconnect.fieldSize(con, q.tableSchema, q.tableName, q.columnName));

  //z modułu dbconnect wywołujemy funkcję fieldSize przekazując jej następujace parametry:
  // - con - uchwyt do połączenia z bazą danych
  // - tableSchema - odczytany z parametrów schemat bazy danych
  // - tableName - odczytaną z parametrów nazwę tabeli
  // - columnName - odczytaną z parametrów nazwę kolumny
  //funkcja zwraca pełną informację o polu
  
  dbconnect.fieldSize(con, q.tableSchema, q.tableName, q.columnName).then((data) => { 
    res.end(data);
  }).catch((err) => { 
    res.end(err); 
  });  
//webserwice nasłuchuje na porcie 8080  
}).listen(8080);

//uruchomienie: node mainweb.js
//http://localhost:8080/?tableSchema=SAKILA&tableName=FILM&columnName=TYTUL