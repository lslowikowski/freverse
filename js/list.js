"use strict";
var List = /** @class */ (function () {
    function List(markedClass, webservice) {
        this.markedClass = markedClass;
        this.webserwice = webservice;
        console.log("Witamy");
    }
    List.prototype.getRecordDetail = function (event) {
        var datarow;
        if (event.target instanceof Element) {
            var targetElement = event.target || event.srcElement;
            if (targetElement.className != 'datarow')
                datarow = targetElement.closest('.datarow');
            else
                datarow = targetElement;
            if (datarow !== null) {
                var targetElement_1 = datarow;
                $('.datarow').removeClass(this.markedClass);
                targetElement_1.classList.add(this.markedClass);
                var idValueStr = targetElement_1.getAttribute("data-id");
                if (idValueStr) {
                    var idValueArray = idValueStr.split(',');
                    var tbodyElement = targetElement_1.closest('.databody');
                    if (tbodyElement) {
                        var pkNameStr = tbodyElement.getAttribute("data-pk");
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
        if (targetElement instanceof HTMLElement) {
            var tableName = targetElement.innerText;
            $.getJSON(this.webserwice, {
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
        else
            console.log("Selected element isn't HTMLElement");
    };
    return List;
}());
var lista = new List("klasa", "http://localhost:8080");
//# sourceMappingURL=list.js.map