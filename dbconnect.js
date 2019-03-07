// in console you should run:
// npm install mysql

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sakila"
});

/*
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
*/
function printElemet(element, index, array) {
    console.log("[" + index + "] jest " + element);
}

function pad(width, string, padding) { 
  return (width <= string.length) ? string : pad(width, padding + string, padding)
}

var sql = ` SELECT INFORMATION_SCHEMA.COLUMNS.*, 
				   INFORMATION_SCHEMA.KEY_COLUMN_USAGE.REFERENCED_TABLE_NAME, 
				   INFORMATION_SCHEMA.KEY_COLUMN_USAGE.REFERENCED_COLUMN_NAME
			FROM INFORMATION_SCHEMA.COLUMNS
			LEFT JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
				   ON (INFORMATION_SCHEMA.COLUMNS.TABLE_SCHEMA = INFORMATION_SCHEMA.KEY_COLUMN_USAGE.TABLE_SCHEMA
				   AND INFORMATION_SCHEMA.COLUMNS.TABLE_NAME = INFORMATION_SCHEMA.KEY_COLUMN_USAGE.TABLE_NAME
				   AND INFORMATION_SCHEMA.COLUMNS.COLUMN_NAME = INFORMATION_SCHEMA.KEY_COLUMN_USAGE.COLUMN_NAME)
			WHERE INFORMATION_SCHEMA.COLUMNS.TABLE_SCHEMA='SAKILA' 
			  and INFORMATION_SCHEMA.COLUMNS.TABLE_NAME ='FILM' 
			ORDER BY INFORMATION_SCHEMA.COLUMNS.ORDINAL_POSITION`;   

//var sql = "SELECT * FROM film";
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query(sql, function (err, result) {
    if (err) throw err;	
	
	var keyNames = Object.keys(result[1]);
			
	for (var i = 0; i < result.length; i++){
		var row = result[i];
		if(i==0){
			var keyNames = Object.keys(row);
		}
		console.log(result[i]['COLUMN_NAME']+':'+result[i]['DATA_TYPE']+':'+result[i]['CHARACTER_MAXIMUM_LENGTH']+':'+result[i]['NUMERIC_PRECISION']);
		
		/*
		//console.log(keyNames);
		for (var j = 0; j < keyNames.length; j++){
			var keyName = keyNames[j];
			console.log(keyName + ":" + result[i][keyName]);
		}
		*/
	}
	
  });
}); 

con.on('close', function(err) {
  if (err) {
    // Oops! Unexpected closing of connection, lets reconnect back.
    con = mysql.createConnection(connection.config);
  } else {
    console.log('Connection closed normally.');
  }
});