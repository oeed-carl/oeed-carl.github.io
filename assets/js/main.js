$(document).ready(function() {
    var $plateText = $("#plate-text");

    function lookup(plate) {
        // TOOD: look up the plate
        startLoading();
    }

    function plateTextLookup() {
        var plate = $plateText.val();
        if (plate.length > 0)
            lookup(plate)
    }

    var $welcomeSwitchWrap = $(".welcome-switch-wrap");
    $plateText.on("keyup", function(event) {
        if (event.keyCode == 13)
            plateTextLookup()
    }).on("input", function() {
        $welcomeSwitchWrap.removeClass("locked")

        if ($plateText.val().length > 0)
            $welcomeSwitchWrap.addClass("switched")
        else
            $welcomeSwitchWrap.removeClass("switched")

    });

    function changeContent() {
        var $logo = $(".carl-logo");
        var delay = 0;
        if (!$logo.hasClass("out")) {
            $logo.addClass("out")
            delay += 0.1;
        }

        $(".content").find(".card:not(.out)").each(function(index, card) {
            var $card = $(card);
            $card.css("animation-delay", delay + "s").removeClass("in").addClass("out");
            delay += 0.1;
        });

        $newCards = $('<div class="cards cards-new"></div>');
        $("div.content").append($newCards);
        $content.children().each(function(index, child) {
            var $child = $(child);
            $newCards.append($child);
            $child.addClass("card-new").css("animation-delay", (delay + 0.3) + "s").addClass("in").removeClass("out");
            delay += 0.1;

        });
    }

    var messages = [
        "Beep boop...",
        "Reticulating splines...",
        "Finding the ultimate question...",
        "Recharging flux capacitor...",
        "Confoobling energymotrons...",
        "Crawling the Googles...",
        "Searching for llamas...",
        "Reducing acidity level...",
        "Removing lemon-based drinks...",
    ];

    var lastMessage;

    function getMessage() {
        var message;
        var i = 0;
        while (!message || message == lastMessage) {
            message = messages[Math.floor(Math.random() * messages.length)]
        }
        lastMessage = message;
        return message;
    }

    function startLoading() {
        $(".card.loading").addClass("in");
        $(".card.alert-card, .card.welcome").addClass("out");
        $loadingMessage = $(".loading-message");
        $loadingMessage.addClass('in');
        setInterval(function() {
            $loadingMessage.removeClass("in").addClass('out');
            setTimeout(function() {
                $loadingMessage.text(getMessage());
                $loadingMessage.removeClass("out").addClass('in');
            }, 400)
        }, 1500);
    }

    s = startLoading;
});