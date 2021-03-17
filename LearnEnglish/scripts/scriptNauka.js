$(document).ready(function () {
        var lang = localStorage.getItem("lang");
        var mode = localStorage.getItem("mode");

        var score = 0;

        var word;
        var failed = []; //tablica zawierająca błędne odpowiedzi

        $("#confirm").dialog({
            title: "Czy chcesz zakończyć?",
            resizable: false,
            autoOpen: false,
            modal: true,
            show: {effect: "fold", duration: 700},
            buttons: [
                {
                    text: "TAK",
                    icon: "ui-icon-check",
                    click: function () {
                        $("#confirm").dialog("close");
                        $("#container").hide("slide", {direction: "up"}, 1000, function (){
                            if (mode == "test") showResult();
                            else location.href = "index.html";
                        });
                    }
                },
                {
                    text: "NIE",
                    icon: "ui-icon-close",
                    click: function () {
                        $("#confirm").dialog("close");
                    }
                }
            ]
        });

        $("#exitButton").click(function () {
            $("#confirm").dialog("open");
        });

        function showResult() {
            localStorage.setItem("score", score);
            if (failed.length > 0) localStorage.setItem("failed", JSON.stringify(failed)); //zapisywanie błędnych odpowiedzi
            else localStorage.removeItem("failed"); //usuwanie błędnych odpowiedzi z poprzedniego testu

            $("#container").hide("slide", {direction: "up"}, 1000, function (){
                location.href = "wynik.html";
            });
        }

        $.getJSON("words.json", function (words) {
            if (mode == "learn") {
                $("#buttonStart button").click(function () {
                    learnNext(words);
                });
                learnNext(words);
            }

            if (mode == "test") {
                $("#translateButton").hide();
                $("#titleText").text("Test");
                $("#headerText").text("Test");
                $("input[type=text]").show();
                if (lang == "PL") $("#wordTitle").text("Wyraz:");
                if (lang == "ENG") $("#wordTitle").text("Word:");
                $("#buttonStart button").click(function () {
                    testNext(words);
                });
                testNext(words);
            }

            $("#container").show("slide", {direction: "up"}, 1000);
        });

        function showENG() {
            $("#wordTitle").text("Word:");
            $("#wordText").text(word.eng);

            $("#translateButton").text("Pokaż po polsku");
            $("#translateButton").unbind("click");
            $("#translateButton").click(function () {
                showPL();
            });
        }

        function showPL() {
            $("#wordTitle").text("Wyraz:");
            $("#wordText").text(word.pl);
            $("#translateButton").text("Pokaż po angielsku");
            $("#translateButton").unbind("click");
            $("#translateButton").click(function () {
                showENG();
            });
        }

        function learnNext(words) {
            if (words.length > 0) {
                var index = Math.floor(Math.random() * words.length);

                word = JSON.parse(JSON.stringify(words[index]));

                if (lang == "PL") showPL(word);
                if (lang == "ENG") showENG(word);

                words.splice(index, 1); //usuwanie elementu z tablicy
            }
            else $("#container").hide("slide", {direction: "up"}, 1000, function (){
                location.href = "index.html";
            });
        }

        function testNext(words) {
            if (word != null) {
                if (lang == "PL") {
                    if (word.eng == $("input[type=text]").val()) score++;
                    else failed.push(word.pl);
                }
                if (lang == "ENG") {
                    if (word.pl == $("input[type=text]").val()) score++;
                    else failed.push(word.eng);
                }
                $("input[type=text]").val("");
            }

            if (words.length > 0) {
                var index = Math.floor(Math.random() * words.length);

                word = JSON.parse(JSON.stringify(words[index]));

                if (lang == "PL") $("#wordText").text(word.pl);
                if (lang == "ENG") $("#wordText").text(word.eng);

                words.splice(index, 1);
            } else showResult();
        }
})