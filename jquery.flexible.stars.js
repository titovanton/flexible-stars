(function($){
    $.fn.flexibleStars = function (jsInit) {

        function init($global) {
            // default init
            var settings = {
                gold      : 'sprite-gold-star',
                silver    : 'sprite-silver-star',
                half      : 'sprite-half-star',
                doRate    : 'ajax',            // or CSS selector for input, like this one: '#rate'
                url       : '/stars/handler/', // used if doRate == 'ajax'
                init      : '0',
                isLocked  : 'no',              // or 'yes' :-3
                ajaxLock  : 'yes',             // used if doRate == 'ajax' and lock stars after ajax success
                inputLock : 'no'               // used if doRate is CSS selector and lock stars after input has inited
            }

            // HTML attr init
            var forTemplate = []
            for(var k in settings) forTemplate.push(k)

            for (var i = 0; i < forTemplate.length; i++) {
                var tag = 'data-' + forTemplate[i]
                if (typeof($global.attr(tag)) != 'undefined') {
                    settings[forTemplate[i]] = $global.attr(tag)
                }
            }

            // init from js
            $.extend(settings, jsInit)

            // stor data for future needs
            $global.data('flexibleStars', settings)

            return settings
        }

        function clearStar($star) {
            var settings = $star.parent().data('flexibleStars')

            $star
                .removeClass(settings.gold)
                .removeClass(settings.silver)
                .removeClass(settings.half)

            return $star
        }

        function drawStars($starsWrap) {
            var settings = $starsWrap.data('flexibleStars'),
                // floating point round hack :-3
                fraction = Math.round((settings.init - Math.floor(settings.init)) * 100) / 100

            if (settings.init * 1 === 0) {
                $starsWrap.find('i').each(function(){
                    clearStar($(this))

                    $(this).addClass(settings.silver)
                })
            }
            else if (fraction >= 0.25 && fraction <= 0.74) {
                var i = 0

                $starsWrap.find('i').each(function(){
                    clearStar($(this))

                    if (i < Math.floor(settings.init)) $(this).addClass(settings.gold)
                    else if (i == Math.floor(settings.init)) $(this).addClass(settings.half)
                    else $(this).addClass(settings.silver)
                    i++
                })
            }
            else if (fraction < 0.25 && fraction >= 0){
                var i = 0

                $starsWrap.find('i').each(function(){
                    clearStar($(this))

                    if (i < Math.floor(settings.init)) $(this).addClass(settings.gold)
                    else $(this).addClass(settings.silver)
                    i++
                })
            }
            else if (fraction < 1 && fraction > 0.74){
                var i = 0

                $starsWrap.find('i').each(function(){
                    clearStar($(this))

                    if (i < Math.ceil(settings.init)) $(this).addClass(settings.gold)
                    else $(this).addClass(settings.silver)
                    i++
                })
            }
        }

        function mouseEnterHandler(eventObject) {
            var _this      = this,
                $starsWrap = $(this).parent(),
                settings   = $starsWrap.data('flexibleStars'),
                setClass   = settings.gold

            $starsWrap.find('i').each(function(){
                clearStar($(this)).addClass(setClass)

                if (this == _this) {
                    setClass = settings.silver
                }
            })
        }

        function mouseLeaveHandler(eventObject) {
            drawStars($(this).parent())
        }

        function doAjax($starsWrap, rate) {
            var settings = $starsWrap.data('flexibleStars'),
                data     = {rate: rate}

            // add to request hidden inputs, such as Django {% csrf_token %}
            $starsWrap.find('input').each(function(){
                data[$(this).attr('name')] = $(this).attr('value')
            })

            $.ajax({
                url      : settings.url,
                type     : 'POST',
                dataType : 'JSON',
                data     : data,
                async    : false,
                success  : function(response) {
                    var init = response.init
                    if (typeof(parseInt(init)) == 'number' && init > 0 && init <= 5) {
                        $starsWrap.trigger('ajaxSuccess.flexibleStars', response)
                    }
                    else {
                        $starsWrap.trigger('ajaxResponseError.flexibleStars', response)
                    }
                },
                error: function() {
                    $starsWrap.trigger('ajaxServerError.flexibleStars', rate)
                }
            })
        }

        function setInput($starsWrap, rate) {
            var settings = $starsWrap.data('flexibleStars')

            if ($(settings.doRate).size()) {
                $(settings.doRate).val(rate)
                $starsWrap.trigger('inputSuccess.flexibleStars', rate)
            }
            else {
                $starsWrap.trigger('inputError.flexibleStars')
            }
        }

        function clearEvents($starsWrap) {
            $starsWrap
                .unbind('.flexibleStars')
                .find('i')
                    .unbind('.flexibleStars')
        }

        function clickHandler(eventObject) {
            var $starsWrap = $(this).parent(),
                settings   = $starsWrap.data('flexibleStars'),
                rate       = $(this).attr('data-rate')

            if (settings.doRate == 'ajax') doAjax($starsWrap, rate)
            else setInput($starsWrap, rate)
        }

        function ajaxSuccessHandler (eventObject, response) {
            var $starsWrap = $(this)
                settings   = $starsWrap.data('flexibleStars')

            settings.init = response.init
            drawStars($starsWrap)

            if (settings.ajaxLock === 'yes') {
                settings.isLocked = 'yes'
                clearEvents($starsWrap)
            }
        }

        function inputSuccessHandler (eventObject, rate) {
            var $starsWrap = $(this)
                settings   = $starsWrap.data('flexibleStars')

            settings.init = rate
            drawStars($starsWrap)

            if (settings.inputLock === 'yes') {
                settings.isLocked = 'yes'
                clearEvents($starsWrap)
            }
        }

        return this.each(function() {
            var $starsWrap = $(this),
                settings   = init($starsWrap)

            // generate content
            for (var i = 1; i <= 5; i++) $starsWrap.append('<i data-rate="' + i + '"/>')

            drawStars($starsWrap)
            if (settings.isLocked === 'no') {
                if (settings.doRate === 'ajax') {
                    $starsWrap.bind('ajaxSuccess.flexibleStars', ajaxSuccessHandler)
                }
                else {
                    $starsWrap.bind('inputSuccess.flexibleStars', inputSuccessHandler)
                }
                
                $starsWrap
                    .find('i')
                        .bind('mouseenter.flexibleStars', mouseEnterHandler)
                        .bind('mouseleave.flexibleStars', mouseLeaveHandler)
                        .bind('click.flexibleStars', clickHandler)
            }
        })

    }

    $(function(){
        $('.flexible-stars').flexibleStars()
    })

})(jQuery);
