$(document).ready(function (){
    $("#container").show("slide", {direction: "up"}, 1000, function () {
        var lang = "PL";
        var mode = "learn";

        $("#modePL").click(function () {
            lang = "PL";
            $("#lang").text("Z polskiego na angielski");
        });

        $("#modeENG").click(function () {
            lang = "ENG";
            $("#lang").text("Z angielskiego na polski");
        });

        $("#modeLearn").click(function () {
            mode = "learn";
            $("#mode").text("Nauka");
        });

        $("#modeTest").click(function () {
            mode = "test";
            $("#mode").text("Test");
        });


        $("#buttonStart button").click(function () {
            localStorage.setItem("lang", lang);
            localStorage.setItem("mode", mode);

            $("#container").hide("slide", {direction: "up"}, 1000, function (){
                location.href = "nauka.html";
            });
        });
    });
})