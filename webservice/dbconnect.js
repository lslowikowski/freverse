exports.getTableNames = function (con, tableSchema) {
	var sql = `SELECT TABLE_NAME
				FROM INFORMATION_SCHEMA.TABLES
				WHERE table_schema='` + tableSchema + `'
				AND TABLE_TYPE = 'BASE TABLE'`;

	return new Promise((resolve, reject) => {
		con.connect(function (err) {
			//if (err) throw err;
			//console.log("Connected!");
			con.query(sql, function (err, result) {
				if (err) throw reject(err);
				var outputStr = '{"tablenames":[';
				var firstRow = true;
				for (var key in result) {
					if (firstRow) {
						//generate header
						var tableName = result[key];
						outputStr += '"' + tableName["TABLE_NAME"] + '"';
						firstRow = false;
					}
					else {
						var tableName = result[key];
						outputStr += ', "' + tableName["TABLE_NAME"] + '"';
					}
				}
				outputStr += ']}'
				resolve(outputStr);
			});
		});
	});

}
//http://localhost:8080/?command=getTableNames&tableSchema=SAKILA

function getPrimaryColumn(con, tableSchema, tableName) {	
	// SELECT COLUMN_NAME AS 'primary' FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='` + tableSchema + `' AND TABLE_NAME='` + tableName + `' and COLUMN_KEY='PRI'
	var sql = `SELECT GROUP_CONCAT(COLUMN_NAME)  FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='` + tableSchema + `' AND TABLE_NAME='` + tableName + `' and COLUMN_KEY='PRI'`;
	//var sql = `SELECT CONCAT('concat(', REPLACE(GROUP_CONCAT(COLUMN_NAME), ',', ', '','', '),')') FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='` + tableSchema + `' AND TABLE_NAME='` + tableName + `' and COLUMN_KEY='PRI'`;	
	return new Promise((resolve, reject) => {
		con.connect(function (err) {			
			con.query(sql, function (err, result) {
				if (err) throw reject(err);
				var outputStr = '';
				var firstRow = true;
				for (var key in result) {					
					var row = result[key];
					for (var property in row) {
						if (firstRow) {
							outputStr += row[property];
							firstRow = false;
						}
						else {
							outputStr += row[property];
						}						
					}																		
				}								
				resolve(outputStr);
			});
		});
	});
} 
//http://localhost:8080/?command=getPrimaryColumn&tableSchema=SAKILA&tableName=FILM

exports.getTableData = function(con, tableSchema, tableName) {
	/*
	var sql = `SELECT INFORMATION_SCHEMA.COLUMNS.*, 
				   INFORMATION_SCHEMA.KEY_COLUMN_USAGE.REFERENCED_TABLE_NAME, 
				   INFORMATION_SCHEMA.KEY_COLUMN_USAGE.REFERENCED_COLUMN_NAME
			FROM INFORMATION_SCHEMA.COLUMNS
			LEFT JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
				   ON (INFORMATION_SCHEMA.COLUMNS.TABLE_SCHEMA = INFORMATION_SCHEMA.KEY_COLUMN_USAGE.TABLE_SCHEMA
				   AND INFORMATION_SCHEMA.COLUMNS.TABLE_NAME = INFORMATION_SCHEMA.KEY_COLUMN_USAGE.TABLE_NAME
				   AND INFORMATION_SCHEMA.COLUMNS.COLUMN_NAME = INFORMATION_SCHEMA.KEY_COLUMN_USAGE.COLUMN_NAME)
			WHERE INFORMATION_SCHEMA.COLUMNS.TABLE_SCHEMA='` + tableSchema + `'
				and INFORMATION_SCHEMA.COLUMNS.TABLE_NAME = '` + tableName + `' 
				and INFORMATION_SCHEMA.COLUMNS.COLUMN_NAME = '` + columnName + `' 
			ORDER BY INFORMATION_SCHEMA.COLUMNS.ORDINAL_POSITION`;   
	*/		
	return new Promise((resolve, reject) => {
		var sql = '';
		// SELECT COLUMN_NAME AS 'primary' FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='sakila' AND TABLE_NAME='film' and COLUMN_KEY='PRI'
		getPrimaryColumn(con, tableSchema, tableName)
			.then((data) => { 
				var priKeyNames = data;
				var fieldNames = 'CONCAT(' + data.replace(',', ", ',', ") + ')';
				sql = `SELECT ` + fieldNames + ` AS 'PRIMARY_KEY', ` + tableName + `.* FROM ` + tableSchema + `.` + tableName; 				
				//resolve('"'+sql+'"');
				
				con.connect(function (err) {
					//if (err) throw err;
					//console.log("Connected!");
					con.query(sql, function (err, result) {
						if (err) throw reject(err);
						var outputStr = '{"pkNames":"' + priKeyNames + '", "header":[';
						var firstRow = true;
						for (var key in result) {
							var columnNumber = 0;
							if (firstRow) {
								//generate header
								var row = result[key];
								for (var property in row) {
									if (columnNumber == 0) {
										//w zerowej kolumnie znajduje się PRIMARY_KEY nie dopisujemy do listy kolumn
									} else
									if (columnNumber==1) {										
										outputStr += '"' + property + '"';
									}
									else {
										outputStr += ', "' + property + '"';
									}
									columnNumber ++;
								}
								outputStr += '],\n'

								outputStr += '"rows": [';
								firstRow = false;
							}
							else {
								outputStr += ', ';
							}
							var row = result[key];
							columnNumber = 0;
							for (var property in row) {
								if (columnNumber==0) {
									//w zerowej kolumnie znajduje się PRIMARY_KEY nie dopisujemy do listy kolumn									
									outputStr += '{"PRIMARY_KEY":"' + row[property]+'",'
								} else
								if (columnNumber==1) {									
									outputStr += '"row": ["' + row[property] + '"';
								}
								else {
									outputStr += ', "' + row[property] + '"';
								}
								columnNumber++;
							}
							outputStr += ']}\n'
						}
						outputStr += ']}'
						//resolve(result[0]['COLUMN_NAME']+':'+result[0]['DATA_TYPE']+':'+result[0]['CHARACTER_MAXIMUM_LENGTH']+':'+result[0]['NUMERIC_PRECISION']);
						//outputStr = JSON.stringify(result);
						resolve(outputStr);
						//resolve(sql);
					});
				});				
				
			})
			.catch((err) => {
				res.end(err);
			}); 		
	});				
} 
//http://localhost:8080/?command=getTableData&tableSchema=SAKILA&tableName=FILM

exports.getReferencedTable = function (con, tableSchema, tableName) {

	var sql = `SELECT REFERENCED_COLUMN_NAME, TABLE_SCHEMA, TABLE_NAME, COLUMN_NAME
			FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
			WHERE REFERENCED_TABLE_SCHEMA =  '` + tableSchema + `'
			AND REFERENCED_TABLE_NAME = '` + tableName + `'
			AND REFERENCED_COLUMN_NAME IS NOT null`	
	return new Promise((resolve, reject) => {
		con.connect(function (err) {
			//if (err) throw err;
			console.log("Connected!");
			con.query(sql, function (err, result) {
				if (err) throw reject(err);
				var outputStr = '{"header":[';
				var firstRow = true;
				for (var key in result) {
					var firstColumn = true;
					if (firstRow) {
						//generate header
						var row = result[key];
						for (var property in row) {
							if (firstColumn) {
								firstColumn = false;
								outputStr += '"' + property + '"';
							}
							else {
								outputStr += ', "' + property + '"';
							}
						}
						outputStr += '],\n'

						outputStr += '"rows": [';
						firstRow = false;
					}
					else {
						outputStr += ', ';
					}
					var row = result[key];
					firstColumn = true;
					for (var property in row) {
						if (firstColumn) {
							firstColumn = false;
							outputStr += '{"row": ["' + row[property] + '"';
						}
						else {
							outputStr += ', "' + row[property] + '"';
						}
					}
					outputStr += ']}\n'
				}
				outputStr += ']}'
				//resolve(result[0]['COLUMN_NAME']+':'+result[0]['DATA_TYPE']+':'+result[0]['CHARACTER_MAXIMUM_LENGTH']+':'+result[0]['NUMERIC_PRECISION']);
				//outputStr = JSON.stringify(result);
				resolve(outputStr);
			});
		});
	});

}
//http://localhost:8080/?command=getTableData&tableSchema=SAKILA&tableName=FILM
