Demos:

* Simple text paragraphs demo: https://s3-ap-southeast-1.amazonaws.com/portfolio-giang-nguyen/cascadingDivs/text-sample/index.html 
* Real-life banner with gif & buttons scenario: https://s3-ap-southeast-1.amazonaws.com/portfolio-giang-nguyen/cascadingDivs/banner-sample/index.html 

Sample usage:

- Include your favorite version of jQuery
- Include cascadingDivs.js
- Wrap your contents in <div> blocks (or any kind of html element, if you like to live dangerously)
- Call the plugin

```javascript
<script>
$(function() {
    $('#cascade-div-container').cascadingDivs();
});
</script>

<div id="cascade-div-container">
    <div>
        ...
    </div>
    <div>
        ...
    </div>
</div>
```

You can customize your child block selector & sliding time:

```javascript
<script>
$(function() {
    $('#cascade-div-container').cascadingDivs({
        divSelector: '.cascading-block',
        slideTime: 2 // seconds
    });
});
</script>

<div id="cascade-div-container">
    <img class="cascading-block" ... />    
    <p class="cascading-block">
        ...
    </p>
</div>
```

See full source code of working demos in text-sample/index.html & banner-sample/index.html 