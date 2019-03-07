"use strict";
var List = /** @class */ (function () {
    function List(webservice, databaseName, dataContainerId, tableDataTemplate, tableDataTemplateId, markedClass, dataBodyClass, dataRowClass, dataPrimaryKey, dataId) {
        if (dataContainerId === void 0) { dataContainerId = "#dataContainerId"; }
        if (tableDataTemplate === void 0) { tableDataTemplate = "templates/tableDataTemplate.html"; }
        if (tableDataTemplateId === void 0) { tableDataTemplateId = "#tableDataTemplateId"; }
        if (markedClass === void 0) { markedClass = "table-primary"; }
        if (dataBodyClass === void 0) { dataBodyClass = ".databody"; }
        if (dataRowClass === void 0) { dataRowClass = ".datarow"; }
        if (dataPrimaryKey === void 0) { dataPrimaryKey = "data-pk"; }
        if (dataId === void 0) { dataId = "data-id"; }
        //webservice adress 
        this.webservice = webservice;
        //database name
        this.databaseName = databaseName;
        //id HTML element data container <div id=dataContainerId>
        this.dataContainerId = dataContainerId;
        //HTML template name  with path
        this.tableDataTemplate = tableDataTemplate;
        //id HTML element with template
        this.tableDataTemplateId = tableDataTemplateId;
        //markedClass is class to marked element with clicked record
        this.markedClass = markedClass;
        //dataBodyClass is HTML element class where data are showing
        this.dataBodyClass = dataBodyClass;
        //dataRowClass is element class with single data row
        this.dataRowClass = dataRowClass;
        //HTML element data parameter name where are primary key names
        this.dataPrimaryKey = dataPrimaryKey;
        //HTML element data parameter name where are primary key values
        this.dataId = dataId;
        //bind this to event method 
        //jeżeli tego nie zrobimy, metoda obsługująca zdarzenie nic nie wie o klasie, w której się znajduje
        this.getDataTable = this.getDataTable.bind(this);
        this.getRecordDetail = this.getRecordDetail.bind(this);
    }
    Object.defineProperty(List.prototype, "setWebservice", {
        set: function (webservice) {
            this.webservice = webservice;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "setDatabaseName", {
        set: function (databaseName) {
            this.databaseName = databaseName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "setDataContainerId", {
        set: function (dataContainerId) {
            this.dataContainerId = dataContainerId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "setTableDataTemplate", {
        set: function (tableDataTemplate) {
            this.tableDataTemplate = tableDataTemplate;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "setTableDataTemplateId", {
        set: function (tableDataTemplateId) {
            this.tableDataTemplateId = tableDataTemplateId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "setMarkedClass", {
        set: function (markedClass) {
            this.markedClass = markedClass;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "setDataBodyClass", {
        set: function (dataBodyClass) {
            this.dataBodyClass = dataBodyClass;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "seDataRowClass", {
        set: function (dataRowClass) {
            this.dataRowClass = dataRowClass;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "setDataPrimaryKey", {
        set: function (dataPrimaryKey) {
            this.dataPrimaryKey = dataPrimaryKey;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "setDataId", {
        set: function (dataId) {
            this.dataId = dataId;
        },
        enumerable: true,
        configurable: true
    });
    List.prototype.getRecordDetail = function (event) {
        var datarow;
        if (event.target instanceof Element) {
            var targetElement = event.target || event.srcElement;
            if (targetElement.className != this.dataRowClass)
                datarow = targetElement.closest(this.dataRowClass);
            else
                datarow = targetElement;
            if (datarow !== null) {
                var targetElement_1 = datarow;
                $('.datarow').removeClass(this.markedClass);
                targetElement_1.classList.add(this.markedClass);
                var idValueStr = targetElement_1.getAttribute(this.dataId);
                if (idValueStr) {
                    var idValueArray = idValueStr.split(',');
                    var tbodyElement = targetElement_1.closest(this.dataBodyClass);
                    if (tbodyElement) {
                        var pkNameStr = tbodyElement.getAttribute(this.dataPrimaryKey);
                        if (pkNameStr) {
                            var pkNameArray = pkNameStr.split(',');
                            var questionString = '';
                            for (var i = 0; i < pkNameArray.length; i++) {
                                if (i == 0) {
                                    questionString += '(' + pkNameArray[i] + '=' + idValueArray[i] + ')';
                                }
                                else {
                                    questionString += ' AND (' + pkNameArray[i] + '=' + idValueArray[i] + ')';
                                }
                            }
                            alert(questionString);
                        }
                        else
                            console.log("Error: Missing data-pk parameter");
                    }
                    else
                        console.log("Error: Missing databody class");
                }
                else
                    console.log("Error: Missing data-id parameter");
            }
            else
                console.log("Error: Missing datarow class");
        }
        else
            console.log("Error: Event isn't instance of Element");
    };
    List.prototype.getDataTable = function (event) {
        var targetElement = event.target || event.srcElement;
        var funkcja = this.getRecordDetail;
        var webservice = this.webservice;
        var tableDataTemplate = this.tableDataTemplate;
        var tableDataTemplateId = this.tableDataTemplateId;
        var dataContainerId = this.dataContainerId;
        var dataRowClass = this.dataRowClass;
        if (targetElement instanceof HTMLElement) {
            var tableName = targetElement.innerText;
            $.getJSON(webservice, {
                command: "getTableData",
                tableSchema: this.databaseName,
                tableName: tableName,
                format: "JSON",
                dataType: 'JSONP'
            })
                .done(function (data) {
                //console.log(JSON.stringify(data));   
                $(dataContainerId).load(tableDataTemplate, function (responseTxt, statusTxt, xhr) {
                    if (statusTxt == "success") {
                        //console.log("External content loaded successfully!: "+responseTxt);                    
                        var output = Mustache.to_html(responseTxt, data);
                        $(dataContainerId).html(output);
                        $(dataContainerId).css("display", "block");
                        //set datatables parameters
                        $(tableDataTemplateId).DataTable({
                            scrollY: '50vh',
                            scrollCollapse: true,
                            paging: false
                        });
                        //console.log(output);                                            
                        $(dataRowClass).on('click', funkcja);
                    }
                    if (statusTxt == "error")
                        console.log("Error: " + xhr.status + ": " + xhr.statusText);
                });
            })
                .fail(function (jqxhr, textStatus, error) {
                var err = textStatus + ", " + error;
                console.log("Request Failed: " + err);
            })
                .always(function () {
                console.log("complete");
            });
        }
        else
            console.log("Selected element isn't HTMLElement");
    };
    return List;
}());
//const lista = new List("table-primary", "http://localhost:8080");
//# sourceMappingURL=list.js.map