
function getDataTable(event) {
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
            $("#templates").load("template2.html", function (responseTxt, statusTxt, xhr) {
                if (statusTxt == "success") {
                    //console.log("External content loaded successfully!: "+responseTxt);                    
                    var output = Mustache.to_html(responseTxt, data);
                    $("#templates").html(output);
                    $("#templates").css("display", "block");
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
}