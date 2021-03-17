$(document).ready(function () {
        var score = localStorage.getItem("score");
        var failed = JSON.parse(localStorage.getItem("failed"));

        $("#score").text(score);

        if (failed != null) {
            failed.forEach(function (item) {
                $("#list").append("<li>" + item + "</li>");
            });
            $("#failed").show();
        }

        $("#container").show("slide", {direction: "up"}, 1000, function (){
            $("#buttonStart button").click(function () {
                $("#container").hide("slide", {direction: "up"}, 1000, function () {
                    location.href = "index.html";
                });
            });
        });
})