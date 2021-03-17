$(document).ready(function (){
    $("#pair-text").text($("#pair-number").val());
    $("#cards-text").text($("#pair-number").val() * 2);

    $("#container").show("slide", {direction: "up"}, 1000, function () {
        $("#pair-number").on('input', function (){
            $("#pair-text").text($(this).val());
            $("#cards-text").text($(this).val() * 2);
        });

        $("#info-dialog").dialog({
            title: "Informacje",
            resizable: false,
            autoOpen: false,
            modal: true,
            width: 600,
            show: {effect: "slide", direction: "up", duration: 500}
        });

        $("#button-info").click(function (){
            $("#info-dialog").dialog("open");
        });

        $("#button-play").click(function (){
            var cards = $("#pair-number").val();
            localStorage.setItem("cards", cards);

            $("#container").hide("slide", {direction: "up"}, 1000, function (){
                location.href = "game.html";
            });
        });

        $("#button-result").click(function (){
            $("#container").hide("slide", {direction: "up"}, 1000, function (){
                location.href = "result.html";
            });
        });
    });
});
