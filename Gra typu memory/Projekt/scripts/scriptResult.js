$(document).ready(function () {
    var results = localStorage.getItem("results")

    if(results != null)
    {
        results = JSON.parse(results);
        var file = "";


        for(var i = 0; i < results.length; i++)
        {
            var textNick = results[i].nick;
            var textScore = results[i].score;

            file +="Nick: " + textNick + "\n";
            file +="Wynik: " + textScore + "\n\n\n";


            var row = document.createElement("tr");
            var nick = document.createElement("td");
            var score = document.createElement("td");

            $(nick).text(textNick);
            $(score).text(textScore);

            $(row).append(nick);
            $(row).append(score);

            $("table").append(row);
        }

        $("#button-export").click(function (){
            var tmp = document.createElement("a");

            var fileContent = "data:text/plain;charset=utf-8," + encodeURI(file);
            tmp.setAttribute("download", "lista_wyników");
            tmp.setAttribute("href", fileContent);

            tmp.click();
        });
    }
    $("#button-return").click(function () {
        $("#container").hide("slide", {direction: "up"}, 1000, function (){
            location.href = "index.html";
        });
    });

    $("#container").show("slide", {direction: "up"}, 1000);
});