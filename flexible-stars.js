(function($){
    $.fn.flexible_stars = function (js_init) {

        function init(target) {
            // default init
            var settings = {
                "gold"    : "sprite-gold-star",
                "silver"  : "sprite-silver-star",
                "half"    : "sprite-half-star",
                "dorate"  : "ajax",            // or CSS selector for input, like this one: "#rate"
                "url"     : "/stars/handler/", // used if dorate == "ajax"
                "init"    : "0",
                "locked"  : "no"               // or "yes" :-3
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

            return settings
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
            // floating point round hack :-3
            var fraction = Math.round((settings.init - Math.floor(settings.init)) * 100) / 100

            if (settings.init * 1 === 0) { // also from string to digit: js so js... :-3
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

        function do_ajax(target) {
            var settings = target.data('flexible_stars')
            var data     = {rate: settings.init}

            // add to request hidden inputs, such as Django {% csrf_token %}
            target.find('input').each(function(){
                data[$(this).attr('name')] = $(this).attr('value')
            })

            $.ajax({
                url      : settings.url,
                type     : "POST",
                dataType : "JSON",
                data     : data,
                async    : false,
                success  : function(response) {
                    settings.init = response
                }
            })
        }

        function set_input(target) {
            var settings = target.data('flexible_stars')
            $(settings.dorate).val(settings.init)
        }

        function clear_events(target) {
            target.find('i')
                .unbind('click')
                .unbind('mouseenter')
                .unbind('mouseleave')
        }

        function click_handler(eventObject) {
            var target = $(this).parent()
            var settings = target.data('flexible_stars')

            settings.init = $(this).attr('data-rate')

            if (settings.dorate == "ajax") {
                do_ajax(target)
                settings.locked = "yes"
                clear_events(target)
            }
            else {
                set_input(target)
            }

            drow_stars(target)
        }

        return this.each(function() {
            var target   = $(this)
            var settings = init(target)

            // generate content
            for (var i = 1; i <= 5; i++) target.append('<i data-rate="' + i + '"/>')

            drow_stars(target)
            if (settings.locked === "no") {
                target.find('i').hover(mouse_enter_handler, mouse_leave_handler)
                target.find('i').click(click_handler)
            }
        })

    }

    $(function(){
        $('.flexible-stars').flexible_stars()
    })

})(jQuery);