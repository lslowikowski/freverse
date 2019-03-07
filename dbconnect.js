exports.fieldSize = function(con, tableSchema, tableName, columnName) {
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
			sql = `SELECT * FROM ` + tableName ;
			
			
			return new Promise((resolve, reject) => { 
				con.connect(function(err) {			
					//if (err) throw err;
					console.log("Connected!");
					con.query(sql, function (err, result) {
						if (err) throw reject(err);
						var outputStr = '{"header":[';	
						var firstRow = true;
						for (var key in result){
							var firstColumn = true;
							if(firstRow){
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
								outputStr += '],<br>\n'

								outputStr += '"rows": [';
								firstRow = false;
							}
							else{
								outputStr += ', ';
							}
							var row = result[key];
							firstColumn = true;
							for (var property in row) {
								if(firstColumn){
									firstColumn = false;
									outputStr +=  '{"row": ["' + row[property]+'"';
								}
								else{
									outputStr +=  ', "' + row[property]+'"';
								}
							}
							outputStr += ']}<br>\n'
						}
						outputStr += ']}'
						//resolve(result[0]['COLUMN_NAME']+':'+result[0]['DATA_TYPE']+':'+result[0]['CHARACTER_MAXIMUM_LENGTH']+':'+result[0]['NUMERIC_PRECISION']);
						//outputStr = JSON.stringify(result);
						resolve(outputStr);
					});
				});				
			});						
			
} 
//http://localhost:8080/?tableSchema=SAKILA&tableName=FILM&columnName=stawka_wypozycz