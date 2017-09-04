$(document).ready(function() {
    var xhr;
    var _orgAjax = jQuery.ajaxSettings.xhr;
    jQuery.ajaxSettings.xhr = function() {
        xhr = _orgAjax();
        return xhr;
    };
    $('input[type="file"]').change(function() {
        startLoading();
        var data = new FormData();
        data.append("file", $('#file')[0].files[0]);
        $.ajax({
            url: '/',
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function(data, success) {
                changePage(xhr.responseURL)
                var $page = $(".load-wrap").html(data);
                var $content = $page.find("div.content");
                $page.remove();

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

            },
            fail: function() {
                alert("fail")
                $("form").submit();
            }
        });
    })



    window.addEventListener("popstate", function(e) {
        window.location.reload()
    });

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
        $(".card.alert-card").addClass("out");
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



function changePage(pageUrl, isPop) {
    if (isPop || pageUrl != window.location.pathname) {
        if (!isPop)
            window.history.pushState({
                path: pageUrl
            }, '', pageUrl);
    }
}