'use strict';

class Browser {        
    constructor(markedClass){                                
        var getRecordDetail = function (event){
            var webservice = "http://localhost:8080";
            var targetElement = event.target || event.srcElement;
            if(targetElement.tagName!='TR'){
                targetElement = targetElement.closest('tr');
            }
            $('.datarow').removeClass(markedClass);
            targetElement.classList.add(markedClass);
            var idValueStr = targetElement.dataset.id;
            var idValueArray = idValueStr.split(',');
            var tbodyElement = targetElement.closest('tbody');
            var pkNameStr = tbodyElement.dataset.pk;
            var pkNameArray = pkNameStr.split(',');
            var questionString='';
            for (var i = 0; i < pkNameArray.length; i++){
                if(i==0){
                    questionString += '(' + pkNameArray[i] + '=' + idValueArray[i] + ')';
                }
                else{
                    questionString += ' AND (' + pkNameArray[i] + '=' + idValueArray[i] + ')';
                }
            }
            alert(questionString);
        }
    

        this.getDataTable = function(event) {
            var webservice = "http://localhost:8080";
            var targetElement = event.target || event.srcElement;
            var tableName = targetElement.innerText;        
            console.log("tableName: " + tableName);
            
            $.getJSON(
                webservice,
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
                            $('.datarow').on('click', getRecordDetail);
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
                }
                );
        }
    }
}