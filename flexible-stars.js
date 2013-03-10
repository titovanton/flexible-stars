(function($){
    $.fn.flexible_stars = function (js_init) {

        function init(target) {
            // default init
            var settings = {
                "gold"   : "sprite-gold-star",
                "silver" : "sprite-silver-star",
                "half"   : "sprite-half-star",
                "url"    : "/stars/handler/",
                "init"   : "0"
            }

            // HTML attr init
            var for_template = []
            for(var k in settings) for_template.push(k)

            for (var i = 0; i < for_template.length; i++) {
                var tag = 'data-' + for_template[i]
                if (typeof(target.attr(tag)) != "undefined") {
                    settings[for_template[i]] = target.attr(tag)
                }
            }

            // init from js
            $.extend(settings, js_init)

            // stor data for future needs
            target.data('flexible_stars', settings)
        }

        function clear_star(star) {
            var settings = star.parent().data('flexible_stars')

            star
                .removeClass(settings.gold)
                .removeClass(settings.silver)
                .removeClass(settings.half)

            return star
        }

        function drow_stars(target) {
            var settings = target.data('flexible_stars')
            var fraction = Math.round((settings.init - Math.floor(settings.init))*100)/100

            if (settings.init * 1 === 0) {
                target.find('i').each(function(){
                    clear_star($(this))

                    $(this).addClass(settings.silver)
                })
            }
            else if (fraction >= 0.25 && fraction <= 0.74) {
                var i = 0

                target.find('i').each(function(){
                    clear_star($(this))

                    if (i < Math.floor(settings.init))       $(this).addClass(settings.gold)
                    else if (i == Math.floor(settings.init)) $(this).addClass(settings.half)
                    else                                     $(this).addClass(settings.silver)
                    i++
                })
            }
            else if (fraction < 0.25 && fraction >= 0){
                var i = 0

                target.find('i').each(function(){
                    clear_star($(this))

                    if (i < Math.floor(settings.init)) $(this).addClass(settings.gold)
                    else                               $(this).addClass(settings.silver)
                    i++
                })
            }
            else if (fraction < 1 && fraction > 0.74){
                var i = 0

                target.find('i').each(function(){
                    clear_star($(this))

                    if (i < Math.ceil(settings.init)) $(this).addClass(settings.gold)
                    else                              $(this).addClass(settings.silver)
                    i++
                })
            }
        }

        function mouse_enter_handler(eventObject) {
            var $this    = this
            var parent   = $(this).parent()
            var settings = parent.data('flexible_stars')

            if (typeof(settings.set) == "undefined") {
                var set_class = settings.gold

                parent.find('i').each(function(){
                    clear_star($(this))
                        .addClass(set_class)

                    if (this == $this) {
                        set_class = settings.silver
                    }
                })
            }
        }

        function mouse_leave_handler(eventObject) {
            drow_stars($(this).parent())
        }

        return this.each(function() {
            var target = $(this)
            init(target)

            // generate content
            for (var i = 0; i < 5; i++) target.append('<i/>')

            drow_stars(target)

            target.find('i').hover(mouse_enter_handler, mouse_leave_handler)
        })

    }

    $(function(){
        $('.flexible-stars').flexible_stars()
    })

})(jQuery);