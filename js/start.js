'use strict';
$(document).ready(function () {    

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });

    var webservice = "http://localhost:8080";
    $.getJSON(
        webservice,
        {
            command: "getTableNames",
            tableSchema: "SAKILA",            
            format: "JSON",
            dataType: 'JSONP'
        })
        .done(function (data) {
            //console.log(JSON.stringify(data));   
            $("#tableListTemplates").load("templates/tableNamesTemplate.html", function (responseTxt, statusTxt, xhr) {
                if (statusTxt == "success") {
                    //console.log("External content loaded successfully!: "+responseTxt);   
                    //const mainBrowser = new Browser("table-primary");                 
                    const mainBrowser = new List("http://localhost:8080", 
                                                 "SAKILA", 
                                                 "#dataContainerId", 
                                                 "templates/tableDataTemplate.html", 
                                                 "#tableDataTemplateId",
                                                 "table-primary");
                    var output = Mustache.to_html(responseTxt, data);
                    $("#tableListTemplates").html(output);
                    $("#tableListTemplates").css("display", "block");
                    $("a.tableList").on('click', mainBrowser.getDataTable);
                    //console.log(output);                
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
});

