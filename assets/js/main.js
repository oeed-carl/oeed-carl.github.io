$(document).ready(function() {
    var $plateText = $("#plate-text");

    function lookup(plate, callback) {
        // TOOD: look up the plate
        startLoading();
        tradeMeLookup(plate, function(success, data) {

            console.log(data);
            var cards = [{
                title: "Overview",
                details: [{
                    title: "Make",
                    value: data.Make.Value
                }, {
                    title: "Model",
                    value: data.Model.Value,
                    detail: data.ModelDetail.Value
                }, {
                    title: "Year",
                    value: data.Year.Value,
                }, {
                    title: "Style",
                    value: data.BodyStyle.Value,
                    detail: data.ExteriorColour.Value
                }]
            }, {
                title: "Performance",
                details: [{
                    title: "Age",
                    value: 2017 - data.Year.Value + '<span class="unit">yrs</span>',
                }, {
                    title: "Odometer",
                    value: data.Kilometres.Value + '<span class="unit">km</span>',
                    // detail: data.ModelDetail.Value
                }, {
                    title: "Transmission",
                    value: data.Transmission.DisplayValue
                }, {
                    title: "4WD",
                    value: data["4WD"].Value == "True" ? "Yes" : "No"
                }, {
                    title: "Fuel",
                    value: data.FuelType.Value
                }, {
                    title: "Engine Size",
                    value: data.EngineSize.DisplayValue + '<span class="unit">cc</span>',
                }]
            }, {
                title: "History",
                details: [{
                    title: "Imported",
                    value: data.ImportHistory.Value == "0" ? "Yes" : "No",
                }, {
                    title: "Previous Owners",
                    value: data.NumberOfOwners.Value,
                    // detail: data.ModelDetail.Value
                }]
            }, {
                title: "Registration",
                details: [{
                    title: "WoF Expiry",
                    value: data.WOFExpires.Value,
                }, {
                    title: "Registration Rexpiry",
                    value: data.RegistrationExpires.Value,
                    // detail: data.ModelDetail.Value
                }, {
                    title: "VIN",
                    value: data.VIN.Value
                }]
            }];

            changeContent(cards);
        })
    }

    var oauthToken = "3523847F987A53FC83695433684FDB96";
    var oauthSecret = "E4F190705CD2C56C88F4F0B3233D061C";

    function tradeMeLookup(plate, callback) {
        $.ajax({
            url: "https://api.tmsandbox.co.nz/v1/Selling/GetVehicleAttributes.json?search_string=" + plate,
            headers: {
                "Authorization": `OAuth oauth_consumer_key="DAB7E3F502FFA59FABAA7E18A4317E05", oauth_token="C333076B562DBA5BC927525504A7E592", oauth_signature_method="PLAINTEXT", oauth_signature="95F426FA6357941279DFC270138C2924&09BDCFEEC180BBF078CB12866DDD2391"`
            },
            type: 'GET',
            success: function(data) {
                var dict = {}
                for (var i = 0; i < data.Attributes.length; i++) {
                    var value = data.Attributes[i];
                    dict[value.Name] = value;
                }
                callback(true, dict)
            },
            error: function(data, errorThrown) {
                callback(false)
            }
        });
    }

    function plateTextLookup() {
        var plate = $plateText.val();
        if (plate.length > 0)
            lookup(plate)
    }

    var $welcomeSwitchWrap = $(".welcome-switch-wrap");
    $plateText.on("keyup", function(event) {
        if (event.keyCode == 13) {
            plateTextLookup()
            return true;
        }
    }).on("input", function() {
        $welcomeSwitchWrap.removeClass("locked")

        if ($plateText.val().length > 0)
            $welcomeSwitchWrap.addClass("switched")
        else
            $welcomeSwitchWrap.removeClass("switched")
    });

    $("button.go").click(plateTextLookup)

    function changeContent(cards) {
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


        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            var $card = $(`<div class="card card-new in"><div class="title">Performance</div></div>`).css("animation-delay", (delay + 0.3) + "s");
            for (var n = 0; n < card.details.length; n++) {
                var item = card.details[n];
                $card.append(`
                    <div class="item">
                        <div class="left">
                            <div class="subtitle">
                                ${item.title}
                            </div>
                        </div>
                        <div class="right">
                            <div class="value">
                                ${item.value}
                            </div>
                        </div>
                    </div>
                `)
            }
            $newCards.append($card);
            delay += 0.1;
        }

        // console.log(cards);

        // $content.children().each(function(index, child) {
        //     var $child = $(child);
        //     $newCards.append($child);
        //     $child.addClass("card-new").css("animation-delay", (delay + 0.3) + "s").addClass("in").removeClass("out");

        // });
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