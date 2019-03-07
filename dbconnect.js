/**
 * fieldSize returns basics info about column settings.
 * Parameters: 
 * - con - connection with database
 * - tableSchema - table schema where column is
 * - tableName - name of table where column is
 *  - columnName - name of column
 */

exports.fieldSize = function(con, tableSchema, tableName, columnName) {
	var sql = `SELECT GetMaxFieldLen('` + tableSchema + `', '` + tableName + `', '` + columnName + `') as 'FieldSize',
				   INFORMATION_SCHEMA.COLUMNS.*, 
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
			ORDER BY KEY_COLUMN_USAGE.POSITION_IN_UNIQUE_CONSTRAINT DESC
			LIMIT 1 OFFSET 0`;   
	//console.log(sql);
			//funkcja zwraca Promise (obietnicę), 
			//- w przypadku powodzenia będzie zwrócone resolve (rozwiązanie)
			//- w przypadku niepowodzenia zwrócone zostanie reject (odrzucenie)
			return new Promise((resolve, reject) => { 
				//połączenie z bazą danych
				con.connect(function(err) {													
					//zapytanie do bazy danych
					con.query(sql, function (err, result) {
						//w przypadku błędu zwracamy kod błędu wywołując metodę reject
						if (err) throw reject(err);
						//w przypadku powodzenia przetwarzamy zwrócone dane
						var outputStr = '';
						for (var key in result){
							var row = result[key];
							for (var property in row) {
								outputStr += property + ': ' + row[property]+';<br>\n ';
							  }
							//outputStr += JSON.stringify(row);
						}						
						//outputStr = JSON.stringify(result);
						//w przypadku powodzenia zwracane jest rosolve (rozwiązanie)
						resolve(outputStr);
					});
				});				
			});									
} 
//http://localhost:8080/?tableSchema=SAKILA&tableName=FILM&columnName=stawka_wypozycz