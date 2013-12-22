// Internal-use classes
const CASCADE_DIV_CLASS = 'cascade-div';
const SLIDED_DIV_CLASS = 'cascade-div-slided';
const SELECTED_DIV_CLASS = 'cascade-div-selected';

// True when a div is sliding, used for preventing multiple slides (which will mess up the whole thing)
// TODO: Can this be fixed?
var g_isSliding = false;

jQuery.prototype.cascadingDivs = function(options) {
    // Optional parameters
    var options = options || {};
    const DIV_SELECTOR = options.divSelector || 'div';
    const SLIDE_TIME = options.slideTime || 0.5;
    
    // Initial variables
    var divsContainer = jQuery(this);
    var divs = divsContainer.children(DIV_SELECTOR);    
    var maxHeight = 0;
    var maxWidth = 0;    
    divs.each(function(index, div){
        div = jQuery(div);
        if (div.height() > maxHeight) {
            maxHeight = div.height();
        }
        if (div.width() > maxWidth) {
            maxWidth = div.width();
        }
    });
    var collapsedWidth = (divsContainer.width() - maxWidth) / (divs.length - 1);     
    
    // Arrange each div to overlap the next
    divsContainer.css('position','relative');
    divs.css('position','absolute');
    var highestZIndex = divs.length - 1;    
    divs.each(function(index, div){
        div = jQuery(div);                   
        div.css('left', (collapsedWidth*index) + 'px');
        div.css('z-index', highestZIndex - index);
    });      
    
    // Stretch divs & container's height to be the same as the tallest div    
    divsContainer.height(maxHeight);   
    divs.height(maxHeight);
    
    // Hide slided-out-of-container div parts if any
    divsContainer.css('overflow','hidden');       
    
    // Mark internal-use CSS
    divs.addClass(CASCADE_DIV_CLASS);    
    divs.first().addClass(SELECTED_DIV_CLASS);

    // When click on a div
    divs.click(function(e) {
        var clickedDiv = jQuery(this);
    
        // Ignore if selected or another div is still sliding
        if (clickedDiv.hasClass(SELECTED_DIV_CLASS) || g_isSliding) {
            return;
        }
        
        // Slide left/right divs, depending on which side of this div the currently selected one is on
        var slideAmount = clickedDiv.width() - collapsedWidth;
        var prevDiv = clickedDiv.prev();
        var nextDiv = clickedDiv.next();         
        if (prevDiv.hasClass(CASCADE_DIV_CLASS) && !prevDiv.hasClass(SLIDED_DIV_CLASS)) {
            slideDiv(prevDiv, slideAmount);                    
        } else if (nextDiv.hasClass(CASCADE_DIV_CLASS) && clickedDiv.hasClass(SLIDED_DIV_CLASS)) {
            unslideDiv(clickedDiv, slideAmount);
        }
        
        // Mark this div as selected
        jQuery('.'+SELECTED_DIV_CLASS).removeClass(SELECTED_DIV_CLASS);
        clickedDiv.addClass(SELECTED_DIV_CLASS);
    });   
    
    // Set sliding time
    divs.css('transition','left '+SLIDE_TIME+'s');
    divs.css('-webkit-transition','left '+SLIDE_TIME+'s');
    
    // End-sliding callback
    divs.bind( 'transitionend', onTransitionEnd );
    divs.bind( 'webkitTransitionEnd', onTransitionEnd );
    divs.bind( 'oTransitionEnd', onTransitionEnd );
}

function onTransitionEnd(e) {
    // Allow selecting another div
    g_isSliding = false;
}

function slideDiv(div, amount) {
    // Slide the previous div first if exists & haven't reached thecurrently selected yet
    if (div.prev().hasClass(CASCADE_DIV_CLASS) && !div.hasClass(SELECTED_DIV_CLASS)) {    
        slideDiv(div.prev(), amount);
    }
    
    // Slide this div
    repositionDiv(div, -amount);    
    
    // Mark as slided
    div.addClass(SLIDED_DIV_CLASS);
}

function unslideDiv(div, amount) {
    // Unslide the next div first if exists & haven't reached thecurrently selected yet
    if (div.next().hasClass(CASCADE_DIV_CLASS) && !div.next().hasClass(SELECTED_DIV_CLASS)) {    
        unslideDiv(div.next(), amount);
    }
    
    // Unslide this div
    repositionDiv(div, amount);  
    
    // Mark as unslided
    div.removeClass(SLIDED_DIV_CLASS);
}

function repositionDiv(div, amount) {
    // Move this div
    var currentPos = div.css('left');
    currentPos = currentPos.replace('px','');
    if (currentPos == '') {
        currentPos = 0;
    } else {
        currentPos = Number(currentPos);
    }    
    div.css('left', (currentPos+amount)+'px');
    
    // Prevent selecting another div while this one is sliding
    g_isSliding = true;
}