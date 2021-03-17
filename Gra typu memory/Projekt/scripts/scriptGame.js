$(document).ready(function (){
    var results = null;
    var close = true; //dotyczy zamykania okna o id = "#result-dialog"

    if(localStorage.getItem("cards") == null) location.href = "index.html"; //jeśli nie ustawiono ilości par
    else
    {
        var cards = parseInt(localStorage.getItem("cards"), 10); //zamiana z postaci tekstowej na liczbową
        if(isNaN(cards)) location.href = "index.html"; //walidacja typu
        else
        {
            if(cards >= 2 && cards <= 32) //walidacja wartości
            {
                $.getJSON("card_data.json", function (cardData){ //załadowanie danych dotyczących obrazów
                    if(cardData[1].length >= cards) //liczba par nie może być większa niż grafik
                    {
                        var canNext = true; //czy można wybrać następną kartę
                        var moves = 0; //liczba ruchów
                        var firstCard;
                        var secondCard;
                        var mode = "first"; //która karta zostanie wybrana

                        var score = 1000 * cards; //część stała wyniku (dotycząca ilości par)

                        function gameOver()
                        {
                            results = localStorage.getItem("results");
                            if(results == null) results = new Array();
                            else results =  JSON.parse(results);

                            score += (1000/moves); //dodanie części zmiennej wyniku (dot. ilości ruchów)
                            score = Math.round(score);

                            $("#score-text").text(score);

                            $("#result-dialog").dialog("open");
                        }

                        $("#pair-text").text(cards);

                        //tablica wszystkich kart
                        var array = new Array();

                        for(var i = 0; i < cards; i++)
                        {
                            array.push({img: cardData[1][i], id: i});
                            array.push({img: cardData[1][i], id: i});
                        }

                        //losowa kolejność, algorytm Durstenfelda
                        for(var i = array.length - 1; i > 0; i--)
                        {
                            var random = Math.floor(Math.random() * (i + 1));
                            var tmp = array[i];
                            array[i] = array[random];
                            array[random] = tmp;
                        }

                        //dodawanie kart na plansze
                        for (var i = 0; i < array.length; i++)
                        {
                            var id = array[i].id;
                            var img = array[i].img;
                            var card = document.createElement("div");
                            var back = document.createElement("div");
                            var front = document.createElement("div");

                            $(card).addClass("card");
                            $(back).addClass("back");
                            $(front).addClass("front");

                            var imgBack = $("<img src='" + cardData[0] + "'>")
                            var imgFront = $("<img src='" + img + "' alt='" + id +"'>")
                            $(back).append(imgBack);
                            $(front).append(imgFront);

                            $(front).hide();

                            $(card).append($(back));
                            $(card).append($(front));

                            $("#playing-field").append($(card));

                            //flip1 - odwracanie elementu (staje się niewidoczny), flip2 - powrót (staje się widoczny)
                            $(front).addClass("flip1");

                            //kliknięcie na zakrytą kartę
                            $(back).click(function () {
                                if(canNext)
                                {
                                    if(mode == "first")
                                    {
                                        //zapisywanie danych pierwszej karty i blokada
                                        firstCard = $(this).parent();
                                        mode = "second";
                                        canNext = false;
                                    }
                                    else
                                    {
                                        //zapisywanie danych drugiej karty i blokada
                                        secondCard = $(this).parent();
                                        mode = "first";
                                        canNext = false;
                                    }
                                    $(this).removeClass("flip2"); //usunięcie aktualnie zbędnej klasy
                                    $(this).addClass("flip1"); //odwrócenie tyłu
                                    setTimeout(function () {
                                        var tmp; //jeśli jest po pierwszej turze to tmp - karta pierwsza, jeśli po drugiej to tmp - karta druga
                                        if (mode == "second") tmp = firstCard;
                                        else tmp = secondCard;
                                        $(tmp).children(".back").hide(); //ukrycie niewidocznego tyłu
                                        $(tmp).children(".front").show(); //pokazanie niewidocznego przodu
                                        $(tmp).children(".front").addClass("flip2"); //przód staje się widoczny
                                        $(tmp).children(".front").removeClass("flip1"); //usunięcie aktualnie zbędnej klasy
                                        if(mode == "first") //są odsłonięte dwie karty (tj. następna będzie "pierwsza")
                                        {
                                            //aktualizacja liczby ruchów
                                            moves++;
                                            $("#moves-text").text(moves);

                                            //porównanie id kart
                                            var firstValue = $(firstCard).children(".front").children("img").attr("alt");
                                            var secondValue = $(secondCard).children(".front").children("img").attr("alt");

                                            if(firstValue == secondValue) //jeśli poprawnie wskazano parę
                                            {
                                                //znikanie kart
                                                $(firstCard).animate({opacity: "0"}, 1000);
                                                $(secondCard).animate({opacity: "0"}, 1000);

                                                //aktualizacja liczby pozostałych par
                                                cards--;
                                                $("#pair-text").text(cards);

                                                if(cards == 0) gameOver();
                                                canNext = true; //odblokowanie następnego ruchu
                                            }
                                            else
                                            {
                                                //powrót do stanu początkowego (zakrycie kart)
                                                setTimeout(function () {
                                                    $(firstCard).children(".front").removeClass("flip2");
                                                    $(secondCard).children(".front").removeClass("flip2");

                                                    $(firstCard).children(".front").addClass("flip1");
                                                    $(secondCard).children(".front").addClass("flip1");
                                                    setTimeout(function () {
                                                        $(firstCard).children(".front").hide();
                                                        $(secondCard).children(".front").hide();

                                                        $(firstCard).children(".back").show();
                                                        $(secondCard).children(".back").show();

                                                        $(firstCard).children(".back").addClass("flip2");
                                                        $(secondCard).children(".back").addClass("flip2");

                                                        setTimeout(function () {
                                                            $(firstCard).children(".back").removeClass("flip1");
                                                            $(secondCard).children(".back").removeClass("flip1");
                                                            $(firstCard).children(".back").removeClass("flip2");
                                                            $(secondCard).children(".back").removeClass("flip2");

                                                            canNext = true; //odblokowanie następnego ruchu
                                                        }, 500);
                                                    }, 500);
                                                }, 1000);
                                            }
                                        } else canNext = true;
                                    }, 500);
                                }
                            });
                        }
                    }
                }).fail(function () { //nie udało się pobrać danych dot. grafik
                    location.href = "index.html";
                });
            }
            else location.href = "index.html";
        }
    }

    $("#confirm").dialog({
        title: "Czy chcesz zakończyć?",
        resizable: false,
        autoOpen: false,
        modal: true,
        show: {effect: "slide", direction: "up", duration: 500},
        buttons: [
            {
                text: "TAK",
                icon: "ui-icon-check",
                click: function () {
                    $("#confirm").dialog("close");
                    $("#container").hide("slide", {direction: "up"}, 1000, function (){
                        location.href = "index.html";
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

    $("#info-dialog").dialog({
        title: "Informacje",
        resizable: false,
        autoOpen: false,
        modal: true,
        width: 600,
        show: {effect: "slide", direction: "up", duration: 500}
    });

    $("#result-dialog").dialog({
        title: "Koniec gry",
        resizable: false,
        autoOpen: false,
        closeOnEscape: false,
        modal: true,
        show: {effect: "slide", direction: "up", duration: 500},
        close: function ()
        {
            if(close)
                $("#container").hide("slide", {direction: "up"}, 1000, function (){
                    location.href = "index.html";
                });
        },
        buttons: [
            {
                text: "Zapisz",
                icon: "ui-icon-check",
                click: function ()
                {
                    if($("#nick").val() != "")
                    {
                        var score = parseInt($("#score-text").text());
                        var nick = $("#nick").val();

                        results.push({nick: nick, score: score});

                        //sortowanie
                        results.sort(function (a, b) {
                            return a.score - b.score;
                        });
                        results.reverse();

                        //zapisanie wyników
                        results = JSON.stringify(results);
                        localStorage.setItem("results", results);

                        //blokada funkcji wywoływanej po zamknięciu okna modalnego
                        close = false;
                        $("#result-dialog").dialog("close");

                        $("#container").hide("slide", {direction: "up"}, 1000, function (){
                            location.href = "result.html";
                        });
                    }
                }
            }]});

    $("#button-exit").click(function (){
        $("#confirm").dialog("open");
    });

    $("#button-info").click(function (){
        $("#info-dialog").dialog("open");
    });

    $("#container").show("fade", 1000);
});
