class List{
    private _webservice: string;
    private _databaseName: string;
    private _dataContainerId: string;
    private _tableDataTemplate: string;
    private _tableDataTemplateId : string;
    private _markedClass: string;
    private _dataBodyClass: string;
    private _dataRowClass: string;
    private _dataPrimaryKey: string;
    private _dataId: string;
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
    constructor(webservice: string,
                databaseName: string,
                dataContainerId: string = "#dataContainerId",
                tableDataTemplate: string = "templates/tableDataTemplate.html",
                tableDataTemplateId: string = "#tableDataTemplateId",
                markedClass: string = "table-primary",  
                dataBodyClass: string = ".databody", 
                dataRowClass: string = ".datarow", 
                dataPrimaryKey: string = "data-pk", 
                dataId: string = "data-id"){
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


    get webservice(): string {
        return this._webservice;
    }

    set webservice(value: string) {
        this._webservice = value;
    }

    public get databaseName() : string {
        return this._databaseName;
    }
        
    public set databaseName(databaseName: string){
        this._databaseName = databaseName;
    }
    
    public get dataContainerId() : string {
        return this._dataContainerId;
    }
    
    public set dataContainerId(dataContainerId: string){
        this._dataContainerId = dataContainerId;
    }
    
    public get tableDataTemplate() : string {
        return this._tableDataTemplate;
    }
    
    public set tableDataTemplate(tableDataTemplate: string){
        this._tableDataTemplate = tableDataTemplate;
    }
    
    public get tableDataTemplateId() : string {
        return this._tableDataTemplateId;
    }
    
    public set tableDataTemplateId(tableDataTemplateId: string){
        this._tableDataTemplateId = tableDataTemplateId;
    }
    
    public get markedClass() : string {
        return this._markedClass;
    }
    
    public set markedClass(markedClass : string){
        this._markedClass = markedClass;
    }
    
    public get dataBodyClass() : string {
        return this._dataBodyClass;
    }
    
    public set dataBodyClass(dataBodyClass: string){
        this._dataBodyClass = dataBodyClass;
    }
    
    public get dataRowClass() : string {
        return this._dataRowClass;
    }
    
    public set dataRowClass(dataRowClass: string){
        this._dataRowClass = dataRowClass;
    }

    public set dataPrimaryKey(dataPrimaryKey: string){
        this._dataPrimaryKey = dataPrimaryKey;
    }
    
    public get dataId() : string {
        return this._dataId;
    }
    
    public set dataId(dataId: string){
        this._dataId = dataId;
    }
    /**
     * Method call on click record
     * set in HTML row element class markedClass
     * reading from clicked element unique ids: data-id 
     * reading from databody element name of primary key names: data-pk
     * @param event 
     */
    public getRecordDetail(event:Event){                
        var datarow: HTMLElement;
        if (event.target instanceof Element){            
            let targetElement = event.target || event.srcElement;
            if (targetElement.className != this._dataRowClass) 
                datarow = targetElement.closest(this._dataRowClass) as HTMLElement;
            else datarow = targetElement as HTMLElement;            
            if(datarow!==null){
                let targetElement = datarow;
                $('.datarow').removeClass(this._markedClass);
                targetElement.classList.add(this._markedClass);
                var idValueStr = targetElement.getAttribute(this._dataId);
                if(idValueStr){
                    var idValueArray = idValueStr.split(',');                        
                    var tbodyElement = targetElement.closest(this._dataBodyClass);
                    if(tbodyElement){
                        var pkNameStr = tbodyElement.getAttribute(this._dataPrimaryKey);
                        if(pkNameStr){
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
                        else console.log("Error: Missing data-pk parameter");
                    }
                    else console.log("Error: Missing databody class");
                }
                else console.log("Error: Missing data-id parameter");
            }
            else console.log("Error: Missing datarow class");            
        }
        else console.log("Error: Event isn't instance of Element");
    }

    public getDataTable(event:Event){         
        let targetElement = event.target || event.srcElement;   
        let onRecordClick = this.getRecordDetail;     
        let webservice = this._webservice;
        let tableDataTemplate = this._tableDataTemplate;
        let tableDataTemplateId = this._tableDataTemplateId;
        let dataContainerId = this._dataContainerId;
        let dataRowClass = this._dataRowClass;
        if (targetElement instanceof HTMLElement){
            let tableName = targetElement.innerText;
            $.getJSON(
                webservice,
                {
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
        else console.log("Selected element isn't HTMLElement");
        
    }

}
//const lista = new List("table-primary", "http://localhost:8080");