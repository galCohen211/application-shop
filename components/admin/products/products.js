$(document).ready(function () {
    $("#placeholder_header").load("http://localhost:4000/admin/header/header.html", function(response, status, xhr) {
        if (status == "error") {
            console.log("Error loading header: " + xhr.status + " " + xhr.statusText);
        }
    });
});