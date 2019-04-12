"use strict";
var List = /** @class */ (function () {
    /**
     *
     * @param webservice - webserwice address with port ex. "http://localhost:8080"
     * @param databaseName - database name ex. "sakila"
     * @param dataContainerId - html id param where data from webservice will be presented, ex. "dataContainerId" <div id="dataContainerId" class="tableContainer" style="display:none">
     * @param tableDataTemplate - template file with path for data presentation ex. "templates/tableDataTemplate.html"
     * @param tableDataTemplateId - id of <table> tag in template file where data will be present ex. "tableDataTemplateId" <table id="tableDataTemplateId" class="table table-hover display" style="width:100%">
     * @param markedClass - HTML class name to marked element with clicked record ex. "table-primary" <tr data-id="1" class="datarow odd table-primary" role="row"> * @param dataBodyClass -  HTML element class where data are showing ex. ".databody" <tbody class="databody" data-pk="aktor_id"> * @param dataRowClass - HTML element class where row data are showing ex. ".datarow" <tr data-id="2" class="datarow even" role="row">
     * @param dataPrimaryKey - HTML element data parameter name where are primary key names ex."data-pk" <tbody class="databody" data-pk="aktor_id">
     * @param dataId - data param of HTML element with record primary key id ex. "data-id" <tr data-id="521" class="datarow odd table-primary" role="row">
     */
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
        this._webservice = webservice;
        //database name
        this._databaseName = databaseName;
        //id HTML element data container <div id=dataContainerId>
        this._dataContainerId = dataContainerId;
        //HTML template name  with path
        this._tableDataTemplate = tableDataTemplate;
        //id HTML element with template
        this._tableDataTemplateId = tableDataTemplateId;
        //markedClass is class to marked element with clicked record
        this._markedClass = markedClass;
        //dataBodyClass is HTML element class where data are showing
        this._dataBodyClass = dataBodyClass;
        //dataRowClass is element class with single data row
        this._dataRowClass = dataRowClass;
        //HTML element data parameter name where are primary key names
        this._dataPrimaryKey = dataPrimaryKey;
        //HTML element data parameter name where are primary key values
        this._dataId = dataId;
        //bind this to event method 
        //jeżeli tego nie zrobimy, metoda obsługująca zdarzenie nic nie wie o klasie, w której się znajduje
        this.getDataTable = this.getDataTable.bind(this);
        this.getRecordDetail = this.getRecordDetail.bind(this);
    }
    Object.defineProperty(List.prototype, "webservice", {
        get: function () {
            return this._webservice;
        },
        set: function (value) {
            this._webservice = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "databaseName", {
        get: function () {
            return this._databaseName;
        },
        set: function (databaseName) {
            this._databaseName = databaseName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "dataContainerId", {
        get: function () {
            return this._dataContainerId;
        },
        set: function (dataContainerId) {
            this._dataContainerId = dataContainerId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "tableDataTemplate", {
        get: function () {
            return this._tableDataTemplate;
        },
        set: function (tableDataTemplate) {
            this._tableDataTemplate = tableDataTemplate;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "tableDataTemplateId", {
        get: function () {
            return this._tableDataTemplateId;
        },
        set: function (tableDataTemplateId) {
            this._tableDataTemplateId = tableDataTemplateId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "markedClass", {
        get: function () {
            return this._markedClass;
        },
        set: function (markedClass) {
            this._markedClass = markedClass;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "dataBodyClass", {
        get: function () {
            return this._dataBodyClass;
        },
        set: function (dataBodyClass) {
            this._dataBodyClass = dataBodyClass;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "dataRowClass", {
        get: function () {
            return this._dataRowClass;
        },
        set: function (dataRowClass) {
            this._dataRowClass = dataRowClass;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "dataPrimaryKey", {
        set: function (dataPrimaryKey) {
            this._dataPrimaryKey = dataPrimaryKey;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "dataId", {
        get: function () {
            return this._dataId;
        },
        set: function (dataId) {
            this._dataId = dataId;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Method call on click record
     * set in HTML row element class markedClass
     * reading from clicked element unique ids: data-id
     * reading from databody element name of primary key names: data-pk
     * @param event
     */
    List.prototype.getRecordDetail = function (event) {
        var datarow;
        if (event.target instanceof Element) {
            var targetElement = event.target || event.srcElement;
            if (targetElement.className != this._dataRowClass)
                datarow = targetElement.closest(this._dataRowClass);
            else
                datarow = targetElement;
            if (datarow !== null) {
                var targetElement_1 = datarow;
                $('.datarow').removeClass(this._markedClass);
                targetElement_1.classList.add(this._markedClass);
                var idValueStr = targetElement_1.getAttribute(this._dataId);
                if (idValueStr) {
                    var idValueArray = idValueStr.split(',');
                    var tbodyElement = targetElement_1.closest(this._dataBodyClass);
                    if (tbodyElement) {
                        var pkNameStr = tbodyElement.getAttribute(this._dataPrimaryKey);
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
        var onRecordClick = this.getRecordDetail;
        var webservice = this._webservice;
        var tableDataTemplate = this._tableDataTemplate;
        var tableDataTemplateId = this._tableDataTemplateId;
        var dataContainerId = this._dataContainerId;
        var dataRowClass = this._dataRowClass;
        if (targetElement instanceof HTMLElement) {
            var tableName = targetElement.innerText;
            $.getJSON(webservice, {
                command: "getTableData",
                tableSchema: this._databaseName,
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
                        // noinspection Annotator
                        $(dataRowClass).on('click', onRecordClick);
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