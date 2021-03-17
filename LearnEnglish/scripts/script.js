$(document).ready(function () {
    $("#info").dialog({
        title: "O programie",
        resizable: false,
        autoOpen: false,
        modal: true,
        width: "auto",
        show: {effect: "fade", duration: 700}
    });

    $("#infoButton").click(function () {
        $("#info").dialog("open");
    });
})