(function($){
    $.fn.flexible_stars = function (init) {
        var target = $(this)
        var settings = {
            "gold"   : "sprite-gold-star",
            "silver" : "sprite-silver-star",
            "half"   : "sprite-half-star",
            "url"    : "/stars/handler/",
            "init"   : "0"
        }

        $.extend(settings, init)

        // generating widget content
        var fraction = Math.round((settings.init - Math.floor(settings.init))*100)/100

        console.log(fraction)
        if (settings.init * 1 === 0) {
            console.log("if: 1")
            for (var i = 0; i < 5; i++) target.append('<i class=' + settings.silver + '/>')
        }
        else if (fraction >= 0.25 && fraction <= 0.74) {
            console.log("if: 2")
            for (var i = 0; i < Math.floor(settings.init); i++)
                target.append('<i class=' + settings.gold + '/>')
            target.append('<i class=' + settings.half + '/>')
            for (var i = Math.ceil(settings.init); i < 5; i++)
                target.append('<i class=' + settings.silver + '/>')
        }
        else if (fraction < 0.25 && fraction >= 0){
            console.log("if: 3")
            for (var i = 0; i < Math.floor(settings.init); i++)
                target.append('<i class=' + settings.gold + '/>')
            for (var i = Math.floor(settings.init); i < 5; i++)
                target.append('<i class=' + settings.silver + '/>')
        }
        else if (fraction < 1 && fraction > 0.74){
            console.log("if: 4")
            for (var i = 0; i < Math.ceil(settings.init); i++)
                target.append('<i class=' + settings.gold + '/>')
            for (var i = Math.ceil(settings.init); i < 5; i++)
                target.append('<i class=' + settings.silver + '/>')
        }

        // mouse hover widget effects

        return target
    }

    $(function(){
        $('.flexible-stars').each(function(){
            var target       = $(this)
            var init         = {}
            var for_template = [
                "gold",
                "silver",
                "half",
                "url",
                "init"
            ]

            for (var i = 0; i < for_template.length; i++) {
                var tag = 'data-' + for_template[i]
                if (typeof(target.attr(tag)) != "undefined" && target.attr(tag) != "undefined") {
                    init[for_template[i]] = target.attr(tag)
                }
            }

            target.flexible_stars(init)
        })
    })
})(jQuery)