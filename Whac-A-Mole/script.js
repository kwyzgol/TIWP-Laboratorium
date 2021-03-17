$(document).ready(function (){
    var mouseState = 0;     //stan kursora (młotek)
    var difficulty = 1;
    var time = 0;

    var score;
    var timerField;
    var timerTime;
    var field;

    $(".target").hide();    //chowanie wszystkich obrazków na planszy

    $(document).on("mousemove", function (e)
    {
        $("#hammer").css("top", e.pageY + 2);
        $("#hammer").css("left", e.pageX + 2);
    });

    $(document).on("mousedown", function ()
    {
       if(mouseState == 0)
       {
           $("#hammer").css({transform: "rotate(-45deg)"});
           mouseState = 1;
       }
    });

    $(document).on("mouseup", function (){
        if(mouseState == 1)
        {
            $("#hammer").css({transform: "rotate(0deg)"});
            mouseState = 0;
        }
    })

    $("#easyButton").click(function (){
        difficulty = 1;
        $("#modeText").text("Łatwy");
    });

    $("#normalButton").click(function (){
        difficulty = 2;
        $("#modeText").text("Normalny");
    });

    $("#hardButton").click(function (){
        difficulty = 3;
        $("#modeText").text("Trudny");
    });

    $("#playButton").on("click", function (){
        startGame();
    });

    function startGame()
    {
        $(".target").hide();    //chowanie wszystkich obrazków na planszy
        $("#difficultySet").hide();
        $("#playButton").text("Zakończ grę");
        $("#playButton").unbind("click");
        $("#playButton").on("click", function (){
            gameOver();
        });

        $("#statusText").text("W trakcie");

        time = 0;
        $("#timeText").text(time);

        score = 0;
        $("#resultText").text(score);

        timerField = setInterval(fieldChoose, 1000/difficulty);
        timerTime = setInterval(function (){
            time++;
            $("#timeText").text(time);
            if(time == 60)
            {
                gameOver();
            }
        }, 1000)

        $("body").animate({
            backgroundColor: "white",
            color: "black"
        }, 1000);
    }

    function fieldChoose()
    {
        prevHide();     //chowanie poprzedniego obrazka
        var rowNumber = Math.floor(Math.random() * 5);
        var fieldNumber = Math.floor(Math.random() * 5);

        var row = $(".row").eq(rowNumber);
        field = $(row).find(".field").eq(fieldNumber);

        $(field).on("click", function (){
            scoreAdd();
        });

        $(field).find(".target").show("slide", {direction: "down"}, 125);
    }

    function scoreAdd()
    {
        score++;
        $("#resultText").text(score);
        clearInterval(timerField);
        timerField = setInterval(fieldChoose, 1000/difficulty);
        fieldChoose();
    }

    function prevHide()
    {
        if(field != null)
        {
            $(field).find(".target").hide("slide", {direction: "down"}, 125);
            $(field).unbind("click");
            field = null;
        }
    }

    function gameOver()
    {
        prevHide();

        clearInterval(timerField);
        clearInterval(timerTime);

        $("#difficultySet").show();

        $("#playButton").text("Zagraj");
        $("#playButton").unbind("click");
        $("#playButton").on("click", function (){
            startGame();
        });
        $(".target").show("slide", {direction: "down"}, 125);
        $("#statusText").text("Koniec gry");

        $("body").animate({
            backgroundColor: "black",
            color: "white"
        }, 1000);
    }
})
