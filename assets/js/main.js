$(document).ready(function() {
    var $plateText = $("#plate-text");

    function lookup(plate, callback) {
        plate = plate.toUpperCase().replace(" ", "");
        // TOOD: look up the plate
        startLoading();
        tradeMeLookup(plate, function(success, data) {

            console.log(data);
            var wofMoment = moment(data.WOFExpires.Value, "MMMM YY");
            var registrationMoment = moment(data.RegistrationExpires.Value, "MMMM YY");

            var wofDiff = wofMoment.diff(moment(), 'months')
            var registrationDiff = registrationMoment.diff(moment(), 'months')

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
                    value: 2017 - data.Year.Value + ' <span class="unit">yrs</span>',
                }, {
                    title: "Odometer",
                    value: parseInt(data.Kilometres.Value).toLocaleString() + ' <span class="unit">km</span>',
                    warning: (data.Kilometres.Value / 18000) > (2017 - data.Year.Value) ? "Potentially unreliable!" : false
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
                    value: data.EngineSize.Value + ' <span class="unit">cc</span>',
                }]
            }, {
                title: "History",
                details: [{
                    title: "Imported",
                    value: data.ImportHistory.Value == "0" ? "Yes" : "No",
                }, {
                    title: "Previous Owners",
                    value: data.NumberOfOwners.Value,
                    warning: data.NumberOfOwners.Value > 3 ? "High ownership turnover!" : false
                        // detail: data.ModelDetail.Value
                }]
            }, {
                title: "Registration",
                details: [{
                    title: "WoF Expiry",
                    value: wofMoment.format("MMM 'YY"),
                    detail: moment().to(wofMoment),
                    warning: wofDiff <= 0 ? "Warrant has expired!" : (wofDiff <= 2 ? "Warrant will expire soon!" : false)
                }, {
                    title: "Rego Expiry",
                    value: registrationMoment.format("MMM 'YY"),
                    detail: moment().to(registrationMoment),
                    warning: registrationDiff <= 0 ? "Registration has expired!" : (registrationDiff <= 2 ? "Registration will expire soon!" : false)
                }]
            }];
            setTimeout(function() {
                changeContent(plate, cards);
            }, 50);
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

    function changeContent(license, cards) {
        var $logo = $(".carl-logo");
        var delay = 0;
        if (!$logo.hasClass("out")) {
            $logo.addClass("out").removeClass("in card-new")
            delay += 0.1;
        }

        $(".content").find(".card:not(.out)").each(function(index, card) {
            var $card = $(card);
            $card.css("animation-delay", delay + "s").removeClass("in card-new").addClass("out");
            delay += 0.1;
        });

        $newCards = $('<div class="cards cards-new"></div>');
        $("div.content").append($newCards);

        $newCards.append(`<div class="title-bar card-new in">
                <a href="/" class="back">Back</a>
                <div class="bar-title">${license}
                    <div class="bar-detail">
                        Registration
                    </div>
                </div>
            </div>`)

        $(".back").click(function() {
            $plateText.val("");
            $welcomeSwitchWrap.removeClass("switched")
            $(".cards-new > div").removeClass("in card-new").addClass("out").each(function(index, el) {
                $(el).css("animation-delay", (index * 0.1) + "s");
            });

            setTimeout(function() {
                $(".cards-new").remove()
            }, $(".cards-new > div").length * 100 + 1000)
            setTimeout(function() {
                $(".carl-logo").addClass("in card-new").removeClass("out");
                setTimeout(function() {
                    $(".card.welcome").addClass("in card-new").removeClass("out");
                }, 100)
            }, $(".cards-new > div").length * 100)

            return false;
        })

        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            var $card = $(`<div class="card card-new in"><div class="title">${card.title}</div></div>`).css("animation-delay", (delay + 0.3) + "s");
            for (var n = 0; n < card.details.length; n++) {
                var item = card.details[n];
                var warning = "";
                if (item.warning)
                    warning = `<div class="warning">${item.warning}</div>`;
                var detail = "";
                if (item.detail)
                    detail = `<div class="detail-large">${item.detail}</div>`;
                var detailSmall = "";
                if (item.detailSmall)
                    detailSmall = `<div class="detail-small">${item.detailSmall}</div>`;
                $card.append(`
                    <div class="item">
                        <div class="left">
                            <div class="subtitle">
                                ${item.title}
                            </div>

                            ${warning}
                        </div>
                        <div class="right">
                            <div class="value">
                                ${item.value}
                            </div>
                            ${detail}
                            ${detailSmall}
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
        $(".card.loading").addClass("in").removeClass("out");
        $(".card.alert-card, .card.welcome").addClass("out").removeClass("in card-new");
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