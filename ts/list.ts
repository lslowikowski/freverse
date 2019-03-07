class List{
    markedClass: string;
    webserwice: string;
    constructor(markedClass:string, webservice:string){
        this.markedClass = markedClass;
        this.webserwice = webservice; 
        console.log("Witamy");
    }

    public getRecordDetail(event:Event){                
        var datarow: HTMLElement;
        if (event.target instanceof Element){            
            let targetElement = event.target || event.srcElement;
            if (targetElement.className != 'datarow') 
                datarow = targetElement.closest('.datarow') as HTMLElement;
            else datarow = targetElement as HTMLElement;            
            if(datarow!==null){
                let targetElement = datarow;
                $('.datarow').removeClass(this.markedClass);
                targetElement.classList.add(this.markedClass);
                var idValueStr = targetElement.getAttribute("data-id");
                if(idValueStr){
                    var idValueArray = idValueStr.split(',');                        
                    var tbodyElement = targetElement.closest('.databody');
                    if(tbodyElement){
                        var pkNameStr = tbodyElement.getAttribute("data-pk");
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
        if (targetElement instanceof HTMLElement){
            let tableName = targetElement.innerText;
            $.getJSON(
                this.webserwice,
                {
                    command: "getTableData",
                    tableSchema: "SAKILA",
                    tableName: tableName,
                    format: "JSON",
                    dataType: 'JSONP'
                })
                .done(function (data) {
                    //console.log(JSON.stringify(data));   
                    $("#tableData").load("templates/tableDataTemplate.html", function (responseTxt, statusTxt, xhr) {
                        if (statusTxt == "success") {
                            //console.log("External content loaded successfully!: "+responseTxt);                    
                            var output = Mustache.to_html(responseTxt, data);
                            $("#tableData").html(output);
                            $("#tableData").css("display", "block");
                            //set datatables parameters
                            $('#tableDataTemplateId').DataTable({
                                scrollY: '50vh',
                                scrollCollapse: true,
                                paging: false

                            });
                            //console.log(output);                
                            $('.datarow').on('click', funkcja);
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