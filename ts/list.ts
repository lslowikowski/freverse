class List{
    private webservice: string;
    private databaseName: string;
    private dataContainerId: string;
    private tableDataTemplate: string;
    private tableDataTemplateId : string;
    private markedClass: string;
    private dataBodyClass: string;
    private dataRowClass: string;
    private dataPrimaryKey: string;
    private dataId: string;
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

    
    public set setWebservice(webservice: string){
        this.webservice = webservice;
    }
    
    public set setDatabaseName(databaseName: string){
        this.databaseName = databaseName;
    }

    public set setDataContainerId(dataContainerId: string){
        this.dataContainerId = dataContainerId;
    }

    public set setTableDataTemplate(tableDataTemplate: string){
        this.tableDataTemplate = tableDataTemplate;
    }

    public set setTableDataTemplateId(tableDataTemplateId: string){
        this.tableDataTemplateId = tableDataTemplateId;
    }

    public set setMarkedClass(markedClass : string){
        this.markedClass = markedClass;
    }

    public set setDataBodyClass(dataBodyClass: string){
        this.dataBodyClass = dataBodyClass;
    }

    public set seDataRowClass(dataRowClass: string){
        this.dataRowClass = dataRowClass;
    }

    public set setDataPrimaryKey(dataPrimaryKey: string){
        this.dataPrimaryKey = dataPrimaryKey;
    }

    public set setDataId(dataId: string){
        this.dataId = dataId;
    }


    public getRecordDetail(event:Event){                
        var datarow: HTMLElement;
        if (event.target instanceof Element){            
            let targetElement = event.target || event.srcElement;
            if (targetElement.className != this.dataRowClass) 
                datarow = targetElement.closest(this.dataRowClass) as HTMLElement;
            else datarow = targetElement as HTMLElement;            
            if(datarow!==null){
                let targetElement = datarow;
                $('.datarow').removeClass(this.markedClass);
                targetElement.classList.add(this.markedClass);
                var idValueStr = targetElement.getAttribute(this.dataId);
                if(idValueStr){
                    var idValueArray = idValueStr.split(',');                        
                    var tbodyElement = targetElement.closest(this.dataBodyClass);
                    if(tbodyElement){
                        var pkNameStr = tbodyElement.getAttribute(this.dataPrimaryKey);
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
        let funkcja = this.getRecordDetail;     
        let webservice = this.webservice;
        let tableDataTemplate = this.tableDataTemplate;
        let tableDataTemplateId = this.tableDataTemplateId;
        let dataContainerId = this.dataContainerId;
        let dataRowClass = this.dataRowClass;
        if (targetElement instanceof HTMLElement){
            let tableName = targetElement.innerText;
            $.getJSON(
                webservice,
                {
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
        else console.log("Selected element isn't HTMLElement");
        
    }

}
//const lista = new List("table-primary", "http://localhost:8080");