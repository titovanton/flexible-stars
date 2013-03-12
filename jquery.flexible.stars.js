(function($){
    $.fn.flexibleStars = function (js_init) {

        function init($global) {
            // default init
            var settings = {
                gold       : 'sprite-gold-star',
                silver     : 'sprite-silver-star',
                half       : 'sprite-half-star',
                do_rate    : 'ajax',            // or CSS selector for input, like this one: '#rate'
                url        : '/stars/handler/', // used if do_rate == 'ajax'
                init       : '0',
                is_locked  : 'no',              // or 'yes' :-3
                ajax_lock  : 'yes',             // used if do_rate == 'ajax' and lock stars after ajax success
                input_lock : 'no'               // used if do_rate is CSS selector and lock stars after input has inited
            }

            // HTML attr init
            var for_template = []
            for(var k in settings) for_template.push(k)

            for (var i = 0; i < for_template.length; i++) {
                var tag = 'data-' + for_template[i]
                if (typeof($global.attr(tag)) != 'undefined') {
                    settings[for_template[i]] = $global.attr(tag)
                }
            }

            // init from js
            $.extend(settings, js_init)

            // stor data for future needs
            $global.data('flexibleStars', settings)

            return settings
        }

        function clear_star($star) {
            var settings = $star.parent().data('flexibleStars')

            $star
                .removeClass(settings.gold)
                .removeClass(settings.silver)
                .removeClass(settings.half)

            return $star
        }

        function draw_stars($stars_wrap) {
            var settings = $stars_wrap.data('flexibleStars'),
                // floating point round hack :-3
                fraction = Math.round((settings.init - Math.floor(settings.init)) * 100) / 100

            if (settings.init * 1 === 0) {
                $stars_wrap.find('i').each(function(){
                    clear_star($(this))

                    $(this).addClass(settings.silver)
                })
            }
            else if (fraction >= 0.25 && fraction <= 0.74) {
                var i = 0

                $stars_wrap.find('i').each(function(){
                    clear_star($(this))

                    if (i < Math.floor(settings.init)) $(this).addClass(settings.gold)
                    else if (i == Math.floor(settings.init)) $(this).addClass(settings.half)
                    else $(this).addClass(settings.silver)
                    i++
                })
            }
            else if (fraction < 0.25 && fraction >= 0){
                var i = 0

                $stars_wrap.find('i').each(function(){
                    clear_star($(this))

                    if (i < Math.floor(settings.init)) $(this).addClass(settings.gold)
                    else $(this).addClass(settings.silver)
                    i++
                })
            }
            else if (fraction < 1 && fraction > 0.74){
                var i = 0

                $stars_wrap.find('i').each(function(){
                    clear_star($(this))

                    if (i < Math.ceil(settings.init)) $(this).addClass(settings.gold)
                    else $(this).addClass(settings.silver)
                    i++
                })
            }
        }

        function mouse_enter_handler(eventObject) {
            var _this       = this,
                $stars_wrap = $(this).parent(),
                settings    = $stars_wrap.data('flexibleStars'),
                set_class   = settings.gold

            $stars_wrap.find('i').each(function(){
                clear_star($(this)).addClass(set_class)

                if (this == _this) {
                    set_class = settings.silver
                }
            })
        }

        function mouse_leave_handler(eventObject) {
            draw_stars($(this).parent())
        }

        function do_ajax($stars_wrap, rate) {
            var settings = $stars_wrap.data('flexibleStars'),
                data     = {rate: rate}

            // add to request hidden inputs, such as Django {% csrf_token %}
            $stars_wrap.find('input').each(function(){
                data[$(this).attr('name')] = $(this).attr('value')
            })

            $.ajax({
                url      : settings.url,
                type     : 'POST',
                dataType : 'JSON',
                data     : data,
                async    : false,
                success  : function(response) {
                    var rate = response.rate
                    if (typeof(parseInt(rate)) == 'number' && rate > 0 && rate <= 5) {
                        $stars_wrap.trigger('ajaxSuccess.flexibleStars', response)
                    }
                    else {
                        $stars_wrap.trigger('ajaxResponseError.flexibleStars', response)
                    }
                },
                error: function() {
                    $stars_wrap.trigger('ajaxServerError.flexibleStars', rate)
                }
            })
        }

        function set_input($stars_wrap, rate) {
            var settings = $stars_wrap.data('flexibleStars')

            if ($(settings.do_rate).size()) {
                $(settings.do_rate).val(rate)
                $stars_wrap.trigger('inputSuccess.flexibleStars', rate)
            }
            else {
                $stars_wrap.trigger('inputError.flexibleStars')
            }
        }

        function clear_events($stars_wrap) {
            $stars_wrap
                .unbind('.flexibleStars')
                .find('i')
                    .unbind('.flexibleStars')
        }

        function click_handler(eventObject) {
            var $stars_wrap = $(this).parent(),
                settings    = $stars_wrap.data('flexibleStars'),
                rate        = $(this).attr('data-rate')

            if (settings.do_rate == 'ajax') do_ajax($stars_wrap, rate)
            else set_input($stars_wrap, rate)
        }

        function ajax_success_handler (eventObject, response) {
            var $stars_wrap = $(this)
                settings = $stars_wrap.data('flexibleStars')

            settings.init = response.rate
            draw_stars($stars_wrap)

            if (settings.ajax_lock === 'yes') {
                settings.is_locked = 'yes'
                clear_events($stars_wrap)
            }
        }

        function input_success_handler (eventObject, rate) {
            var $stars_wrap = $(this)
                settings    = $stars_wrap.data('flexibleStars')

            settings.init = rate
            draw_stars($stars_wrap)

            if (settings.input_lock === 'yes') {
                settings.is_locked = 'yes'
                clear_events($stars_wrap)
            }
        }

        return this.each(function() {
            var $stars_wrap = $(this),
                settings    = init($stars_wrap)

            // generate content
            for (var i = 1; i <= 5; i++) $stars_wrap.append('<i data-rate="' + i + '"/>')

            draw_stars($stars_wrap)
            if (settings.is_locked === 'no') {
                $stars_wrap
                    .bind('ajaxSuccess.flexibleStars', ajax_success_handler)
                    .bind('inputSuccess.flexibleStars', input_success_handler)
                    .find('i')
                        .bind('mouseenter.flexibleStars', mouse_enter_handler)
                        .bind('mouseleave.flexibleStars', mouse_leave_handler)
                        .bind('click.flexibleStars', click_handler)
            }
        })

    }

    $(function(){
        $('.flexible-stars').flexibleStars()
    })

})(jQuery);
