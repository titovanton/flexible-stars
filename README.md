# Flexible stars
jQuery plugin makes easy to install 5 stars rate to your web page with custom CSS styles.
All settings gets from HTML `data-` attributes, or you can init plugin as usiall, by pass init
object: `$('.myStars').flexibleStars(init)`. Also, all `div.flexible-stars` becomes 5 flexibleStars automaticly.

[Live Expamle @ www.titovanton.com](http://www.titovanton.com/flexible-stars/example)

## Why?!
There are so many different 5 stars rate plagin, so what are the benefits of this one? First of all,
it has pretty nice HTML layout:
```
<div class="flexible-stars"></div>
```
becomes
```
<div class="flexible-stars">
    <!-- i - because it's icon! Like in Twitter Bootstrap :-3  -->
    <i class="sprite-silver-star" data-rate="1"></i>
    <i class="sprite-silver-star" data-rate="2"></i>
    <i class="sprite-silver-star" data-rate="3"></i>
    <i class="sprite-silver-star" data-rate="4"></i>
    <i class="sprite-silver-star" data-rate="5"></i>
</div>
```
As you can see, easy to use sprite technology and no redundant HTML.
You can set icon class name, init, lock widget and set Ajax handler from HTML:
```
<div class="flexible-stars"
    data-gold="sprite-teaser-gold-star"
    data-silver="sprite-teaser-silver-star"
    data-half="sprite-teaser-half-star"
    data-url="/flexible-stars/example/handler/"
    data-init="4"
    data-isLocked="yes"
></div>
```
And it works nice and pretty. See Usage for more...

## Install
Follow several steps below: 
- Clone repo:

`git clone https://github.com/titovanton-com/flexible-stars.git`
    
- Add required code to `html>head` tag:

```
<script type="text/javascript" src="//some.cdn/jquery.min.js"></script>
<script type="text/javascript" src="//path/to/flexible-stars/jquery.flexible.stars.js"></script>
<style type="text/css" media="all"> .flexible-stars > i {display: inline-block} </style>
```

## Usage
...
