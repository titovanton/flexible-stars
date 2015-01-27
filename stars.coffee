(($) ->
    $.fn.flexibleStars = (jsInit) ->

        init = ($global) ->
            # default init
            settings =
                gold: 'sprite-gold-star'
                silver: 'sprite-silver-star'
                half: 'sprite-half-star'
                doRate: 'ajax'                # or CSS selector for input, like this one: '#rate'
                url: '/stars/handler/'        # used if doRate == 'ajax'
                init: '0'
                isLocked: 'no'                # or 'yes' :-3
                ajaxLock: 'yes'               # used if doRate == 'ajax' and lock stars after ajax success
                inputLock: 'no'               # used if doRate is CSS selector and lock stars after input has inited

            # HTML attr init
            forTemplate = []
            for key of settings
                attr = "data-#{key}"
                if typeof($global.attr attr) != 'undefined'
                    settings[key] = $global.attr attr

            settings.init = settings.init.replace /,/g, '.'

            # init from js
            $.extend settings, jsInit

            # stor data for future needs
            $global.data 'flexibleStars', settings

            settings

        clearStar= ($star) ->
            settings = $star.parent().data 'flexibleStars'

            $star
                .removeClass settings.gold
                .removeClass settings.silver
                .removeClass settings.half

            # $star

        drawStars = ($starsWrap) ->
            settings = $starsWrap.data 'flexibleStars'
            # floating point round hack :-3
            fraction = Math.round((settings.init - Math.floor settings.init) * 100) / 100

            if settings.init * 1 is 0
                $starsWrap.find('i').each () ->
                    clearStar $ @
                    $(@).addClass settings.silver

            else if fraction >= 0.25 and fraction <= 0.74
                i = 0

                $starsWrap.find('i').each () ->
                    clearStar $ @
                    if i < Math.floor settings.init
                        $(@).addClass settings.gold
                    else if i == Math.floor settings.init
                        $(@).addClass settings.half
                    else
                        $(@).addClass settings.silver
                    i++

            else if fraction < 0.25 and fraction >= 0
                i = 0

                $starsWrap.find('i').each () ->
                    clearStar $ @
                    if i < Math.floor settings.init
                        $(@).addClass settings.gold
                    else
                        $(@).addClass settings.silver
                    i++

            else if fraction < 1 and fraction > 0.74
                i = 0

                $starsWrap.find('i').each () ->
                    clearStar $ @
                    if i < Math.ceil settings.init
                        $(@).addClass settings.gold
                    else
                        $(@).addClass settings.silver
                    i++

        mouseEnterHandler = (eventObject) ->
            that = @
            $starsWrap = $(@).parent()
            settings = $starsWrap.data 'flexibleStars'
            setClass = settings.gold

            $starsWrap.find('i').each () ->
                clearStar($ @).addClass setClass

                if @ == that
                    setClass = settings.silver

        mouseLeaveHandler = (eventObject) ->
            drawStars $(@).parent()

        doAjax = ($starsWrap, rate) ->
            settings = $starsWrap.data 'flexibleStars'
            data = rate: rate

            # add to request hidden inputs, such as Django {% csrf_token %}
            $starsWrap.find('input').each () ->
                data[$(@).attr 'name'] = $(@).attr 'value'

            $.ajax
                url : settings.url
                type : 'POST'
                dataType : 'JSON'
                data : data
                async : false

                success : (response) ->
                    init = response.init

                    if typeof parseInt init == 'number' and init > 0 and init <= 5
                        $starsWrap.trigger 'ajaxSuccess.flexibleStars', response
                    else
                        $starsWrap.trigger 'ajaxResponseError.flexibleStars', response

                error: () ->
                    $starsWrap.trigger 'ajaxServerError.flexibleStars', rate

        setInput = ($starsWrap, rate) ->
            settings = $starsWrap.data 'flexibleStars'

            if $(settings.doRate).size()
                $(settings.doRate).val rate
                $starsWrap.trigger 'inputSuccess.flexibleStars', rate
            else
                $starsWrap.trigger 'inputError.flexibleStars'

        clearEvents = ($starsWrap) ->
            $starsWrap
                .unbind '.flexibleStars'
                .find 'i'
                    .unbind '.flexibleStars'

        clickHandler = (eventObject) ->
            $starsWrap = $(@).parent()
            settings = $starsWrap.data 'flexibleStars'
            rate = $(@).attr 'data-rate'

            if settings.doRate == 'ajax'
                doAjax $starsWrap, rate
            else
                setInput $starsWrap, rate

        ajaxSuccessHandler = (eventObject, response) ->
            $starsWrap = $ @
            settings = $starsWrap.data 'flexibleStars'

            settings.init = response.init
            drawStars $starsWrap

            if settings.ajaxLock is 'yes'
                settings.isLocked = 'yes'
                clearEvents $starsWrap

        inputSuccessHandler = (eventObject, rate) ->
            $starsWrap = $ @
            settings = $starsWrap.data 'flexibleStars'

            settings.init = rate
            drawStars $starsWrap

            if settings.inputLock is 'yes'
                settings.isLocked = 'yes'
                clearEvents $starsWrap

        @.each () ->
            $starsWrap = $ @
            settings = init $starsWrap
            # generate content
            $starsWrap.append "<i data-rate=\"#{i}\"/>" for i in [1..5]

            drawStars $starsWrap

            if settings.isLocked is 'no'
                if settings.doRate is 'ajax'
                    $starsWrap.bind 'ajaxSuccess.flexibleStars', ajaxSuccessHandler
                else
                    $starsWrap.bind 'inputSuccess.flexibleStars', inputSuccessHandler

                $starsWrap
                    .find 'i'
                        .bind 'mouseenter.flexibleStars', mouseEnterHandler
                        .bind 'mouseleave.flexibleStars', mouseLeaveHandler
                        .bind 'click.flexibleStars', clickHandler

    $ () ->
        $('.flexible-stars').flexibleStars()

)(jQuery)
