(function($,sr){
    
      var debounce = function (func, threshold, execAsap) {
          var timeout;

          return function debounced () {
              var obj = this, args = arguments;
              function delayed () {
                  if (!execAsap)
                      func.apply(obj, args);
                  timeout = null;
              };

              if (timeout)
                  clearTimeout(timeout);
              else if (execAsap)
                  func.apply(obj, args);

              timeout = setTimeout(delayed, threshold || 100);
          };
      }
      // smartresize 
      jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');

var width = $(window).width(), height = $(window).height();

$(window).smartresize(function(){
  if($(window).width() != width) { // prevent resize when width changes only
  	location.reload();
  }
});

(function ($) {

	/**
	* Extend the jQuery with the method adcStatementList
	* Should be call on the container of the statement list
	* 
	*     // Single closed question
	*     $('#adc_1').adcStatementList({
	*         iterations : [
	*           { id : 'U1', caption : "Iteration 1" },
	*           { id : 'U3', caption : "Iteration 2" },
	*           { id : 'U5', caption : "Iteration 3" }
	*         ]
	*     });
	*
	*     // Multi-coded question
	*     $('#adc_1').adcStatementList({
	*         isMultiple : true,
	*         iterations : [
	*           { id : 'L1', caption : "Iteration 1" },
	*           { id : 'L3', caption : "Iteration 2" },
	*           { id : 'L5', caption : "Iteration 3" }
	*         ]
	*     });
	*
	* @param {Object} options Statements list parameters
	* @param {Array}  options.iterations Array which contains the definition of iterations
	* @param {String} options.iterations[].id Id or name of the input which contains the value of the current iteration
	* @param {String} options.iterations[].caption Caption of the current iteration
	* @param {Boolean} [options.isMultiple] Indicates if the question is multiple
	* @return {jQuery} Returns the current instance of the root container for the call chains
	*/
	$.fn.adcTarget = function adcTarget(options) {
		// Verify if the options are correct
		// Require key:iterations (array)
		if (!options || !options.iterations || !options.iterations.length) {
			throw new Error('adcTarget expect an option argument with an array of iterations');
		}
		
		(options.autoForward = Boolean(options.autoForward) || false);
		(options.useRange = Boolean(options.useRange));
		(options.imageAlign = options.imageAlign || 'left');
        (options.numberOfCircles = options.numberOfCircles || 5);
        (options.scaleMin = options.scaleMin || 0);
        (options.scaleMax = options.scaleMax || 5);
        (options.innerCircleWidth = options.innerCircleWidth || 150);
        (options.innerCircleImageWidth = options.innerCircleImageWidth || '100%');
        (options.innerCircleImageHeight = options.innerCircleImageHeight || '100%');
		(options.scaleOnTarget = options.scaleOnTarget || 0.5);
        (options.targetHorizontalPosition = options.targetHorizontalPosition || "right");
        (options.useAltCircle = options.useAltCircle || false);
				
		// Delegate .transition() calls to .animate() if the browser can't do CSS transitions.
		if (!$.support.transition) $.fn.transition = $.fn.animate;
				
		$(this).css({'max-width':options.maxWidth,'width':options.controlWidth});
		$(this).parents('.controlContainer').css({'width':'100%'});
		
		if ( options.controlAlign === "center" ) {
			$(this).parents('.controlContainer').css({'text-align':'center'});
			$(this).css({'margin':'0px auto'});
		} else if ( options.controlAlign === "right" ) {
			$(this).css({'margin':'0 0 0 auto'});
		}
		
		// IE8 and below fix
		if (!Array.prototype.indexOf) {
			
		  Array.prototype.indexOf = function(elt /*, from*/) {
			var len = this.length >>> 0;
		
			var from = Number(arguments[1]) || 0;
			from = (from < 0)
				 ? Math.ceil(from)
				 : Math.floor(from);
			if (from < 0)
			  from += len;
		
			for (; from < len; from++) {
			  if (from in this && this[from] === elt)
				return from;
			}
			return -1;
		  };
		}
		
		// Global variables
		var $container = $(this),
			currentIteration = 0,
            iterations = options.iterations,
			animationSpeed = options.animationSpeed,
			clickActive = null,
			autoImageSize = Boolean(options.autoImageSize),
			stackResponses = Boolean(options.stackResponses),
			valuesArray = [],
			selectNextResponse = Boolean(options.selectNextResponse),
			initZindex = 100,
			removingItem = false,
			autoStackWidth = options.autoStackWidth,
			dragging = false,
			total_images = $container.find("img").length,
			images_loaded = 0,
            mouseMove = false,
            resizeToFit = false,
			landscape = parseInt(document.documentElement.clientWidth) > parseInt(document.documentElement.clientHeight) ? true : false,
			scaleMin = options.scaleMin,
			scaleMax = options.scaleMax,
			fontSize = options.fontSize,
			maxValueAtCenter = Boolean(options.maxValueAtCenter),
            useAltCircle = Boolean(options.useAltCircle),
			circleBorderWidth = parseInt(options.circleBorderWidth) > 0 ? parseInt(options.circleBorderWidth) * 2 : 0,
			disableClick = false;
					
        var isMobile = false; //initiate as false
		// device detection
		if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;


        if ( isMobile ) {
            // if mobile set widths to 100%
            resizeToFit = true;
            stackResponses = true;
		}
		
		if ( landscape ) {
			$container.find('.startArea').width( $container.outerWidth()/2 + 'px' );
			$container.find('.targetContainer').width( $container.outerWidth()/2 + 'px' );
		}
		
		if ( landscape ) {
			$container.find('.startArea').width( $container.width() - $container.find('.targetContainer').width() + 'px').css({'position':'absolute'});
			$container.find('.targetContainer').css({'left':$container.width() - $container.find('.targetContainer').width() + 'px'}).css({'position':'absolute'});
		} else {
			$container.find('.startArea').width('100%').css({'float':'none','height':''});
			$container.find('.targetContainer').width('100%').height($container.find('.startArea').outerHeight()).css({'left':'0'/*,'position':'relative'*/});
		}
        
		if ( autoStackWidth !== '' ) {
			if ( $(this).parents('.controlContainer').width() <= parseInt(autoStackWidth) ) {
				stackResponses = true;
			}
		}
			
		$container.find('.responseItem img').hide();
		
		function randomNR(min,max)                 {
			var randomNumber = Math.floor(Math.random()*(max-min+1)+min);
            return randomNumber;
        }
        
		// Convert RGB to hex KEEP FOR TARGETS????
		function trim(arg) {
			return arg.replace(/^\s+|\s+$/g, "");
		}
		function isNumeric(arg) {
			return !isNaN(parseFloat(arg)) && isFinite(arg);
		}

		function isRgb(arg) {
			arg = trim(arg);
			return isNumeric(arg) && arg >= 0 && arg <= 255;
		}
		function rgbToHex(arg) {
			arg = parseInt(arg, 10).toString(16);
			return arg.length === 1 ? '0' + arg : arg; 
		}
		function processRgb(arg) {
			arg = arg.split(',');
	
			if ( (arg.length === 3 || arg.length === 4) && isRgb(arg[0]) && isRgb(arg[1]) && isRgb(arg[2]) ) {
				if (arg.length === 4 && !isNumeric(arg[3])) { return null; }
				return '#' + rgbToHex(arg[0]).toUpperCase() + rgbToHex(arg[1]).toUpperCase() + rgbToHex(arg[2]).toUpperCase();
			}
			else {
				return null;
			}
		}

		// Check for missing images and resize
		$container.find('.responseItem img').each(function forEachImage(index) {
			
			$(this).show();
			
			var size = {
				width: $(this).width(),
				height: $(this).height()
			};
			
			if (options.forceImageSize === "height" ) {
				if ( size.height > parseInt(options.maxImageHeight,10) ) {
					var ratio = ( parseInt(options.maxImageHeight,10) / size.height);
					size.height *= ratio,
					size.width  *= ratio;
				}
			} else if (options.forceImageSize === "width" ) {
				if ( size.width > parseInt(options.maxImageWidth,10) ) {
					var ratio = ( parseInt(options.maxImageWidth,10) / size.width);
					size.width  *= ratio,
					size.height *= ratio;
				}
				
			} else if (options.forceImageSize === "both" ) {
				if ( parseInt(options.maxImageHeight,10) > 0 && size.height > parseInt(options.maxImageHeight,10) ) {
					var ratio = ( parseInt(options.maxImageHeight,10) / size.height);
					size.height *= ratio,
					size.width  *= ratio;
				}
	
				if ( parseInt(options.maxImageWidth,10) > 0 && size.width > parseInt(options.maxImageWidth,10) ) {
					var ratio = ( parseInt(options.maxImageWidth,10) / size.width);
					size.width  *= ratio,
					size.height *= ratio;
				}

			} 
			
			$(this).css(size);
			
			if ( autoImageSize ) {
				
				var rHeight = $(this).parent('.responseItem').height() - $(this).parent('.responseItem').find('.reponse_text').outerHeight(),
					rWidth = $(this).parent('.responseItem').width(),
					iHeight = $(this).outerHeight(),
					iWidth = $(this).outerWidth(),
					diffX = iHeight - rHeight,
					diffY = iWidth - rWidth,
					size = {
						width: $(this).width(),
						height: $(this).height()
					};
					
				if ( diffX > 0 && diffX > diffY ) {
					
					var ratio = ( iWidth / rWidth );
					size.width  *= ratio,
					size.height *= ratio;
					
				} else if ( diffY > 0 && diffY > diffX ) {
					
					var ratio = ( iHeight / rHeight );
					size.height *= ratio,
					size.width  *= ratio;
					
				}
				
				$(this).css(size);
			}
		});
		
		$('.responseItem').each(function(index) { 
            $(this).data({
				'oTop':$(this).position().top,
				'oLeft':$(this).position().left,
				'oWidth':$(this).outerWidth() + 1,
				'oHeight':$(this).outerHeight() + 1
			}).css({
				'width':$(this).outerWidth() + 1,
				'height':$(this).outerHeight() + 1
			});
			
			if ( $(this).outerWidth(true) > $('.startArea').width() )
				$(this).width( $(this).width() - ($(this).outerWidth(true) - $('.startArea').outerWidth()) );
		});
		
		// add ns to last x items
		if ( options.numberNS > 0 ) $container.find('.responseItem').slice(-options.numberNS).addClass('ns');
        
        // set start area to height of responses
        $container.find('.startArea').height( $container.find('.startArea').height() );
        $container.find('.targetContainer').height( $container.find('.circle' + scaleMin ).height() );
	
		if ( resizeToFit || stackResponses ) {
												
			for ( var i=($('.responseItem').size()-1); i>=0; i-- ) {
				$('.responseItem').eq(i).css({"margin":"0",'overflow' : 'visible'});
				$('.responseItem').eq(i).css({
					'width' : $('.responseItem').eq(i).outerWidth(true),
					'height' : $('.responseItem').eq(i).outerHeight(true),
					'display' : 'block',
					
				});
				$('.responseItem').eq(i).css({"position":"absolute","margin":"0"});
				$('.responseItem').eq(i).css({
					'left' : (($container.find('.startArea').outerWidth()*0.5) - ($('.responseItem').eq(i).outerWidth(true)*0.5)) + 'px',
					'top' : (($container.find('.startArea').outerHeight()*0.5)) + 'px',
				});
								
				var offset = $('.responseItem').eq(i).offset();
				
				$('.responseItem').eq(i).offset(offset);
                $('.responseItem').eq(i).data({
                    'oTop':(($container.find('.startArea').outerHeight()*0.5) - ($('.responseItem').eq(i).outerHeight(true)*0.5)) + 'px',
                    'oLeft':(($container.find('.startArea').outerWidth()*0.5) - ($('.responseItem').eq(i).outerWidth(true)*0.5)) + 'px',
                    'oHeight':$('.responseItem').eq(i).outerHeight(),
                    'oWidth':$('.responseItem').eq(i).outerWidth()
                });
			}
			
			var maxHeight = 0;

			$(".responseItem").each(function(){
			   if ($(this).outerHeight(true) > maxHeight) { maxHeight = $(this).outerHeight(true); }
			});
									
			$('.startArea').height( maxHeight + 40 );
			
		}
        
        // Circles 
        $container.find('.circle' + scaleMin ).width('100%');
		$container.find('.circle' + scaleMin ).width( $container.find('.circle' + scaleMin ).width() - 40 + 'px' );
		
        if ( resizeToFit && !landscape ) {
			
            var bodyPadding = $('body').outerWidth(true) - $('body').outerWidth(false);
			
            if( ($(window).outerHeight() - $container.find('.startArea').outerHeight(true) - bodyPadding) > $container.find('.targetContainer').outerWidth())
            	$container.find('.circle' + scaleMin ).width( $container.find('.targetContainer').outerWidth() - 40 );
            else
                $container.find('.circle' + scaleMin ).width( $(window).outerHeight(false) - $container.find('.startArea').outerHeight(true) - bodyPadding - 40);

            $container.find('.circle' + scaleMin ).css('left',(($container.find('.targetContainer').outerWidth()/2) - $container.find('.circle' + scaleMin ).outerWidth()/2) +'px');
		
		} else if ( landscape ) {
						
			var bodyPaddingV = $('body').outerHeight(true) - $('body').outerHeight(false);
			var bodyPaddingH = $('body').outerWidth(true) - $('body').outerWidth(false);
			
            $container.find('.circle' + scaleMin ).width( $('.targetContainer').outerWidth(false) - 40 );
			
			if ( $container.find('.targetContainer').outerWidth(true) + $container.find('.startArea').outerWidth(true) > $(window).outerWidth(false) ) {
				$container.find('.circle' + scaleMin ).width( $container.outerWidth(false) - bodyPaddingH - 40 );
			}

			if ( $container.find('.targetContainer').outerHeight(true) > $(window).outerHeight(false) || $container.find('.startArea').outerHeight(true) > $(window).outerHeight(false) ) {
				stackResponses = true;
				$container.find('.startArea').height( $(window).outerHeight(false) );
				$container.find('.targetContainer').height( $(window).outerHeight(false) );
			}
			if ( $container.find('.circle' + scaleMin ).outerWidth() === $container.find('.targetContainer').outerWidth() ) {
				$container.find('.circle' + scaleMin ).width( $container.find('.circle' + scaleMin ).width() - 40 + 'px' );
			}
			
        } else {
		
			$container.find('.circle' + scaleMin ).css({'top':'20px','left':'20px'});
			
		}
		
        var outerCircleWidth = $container.find('.circle' + scaleMin ).width();
			outerCircleWidth = outerCircleWidth > $container.find('.targetContainer').outerWidth() ? $container.find('.targetContainer').outerWidth() : outerCircleWidth;
		
        var totalNumberOfCircles = options.scaleMax - options.scaleMin;
		
		var circleSizeDiff = Math.round((outerCircleWidth - options.innerCircleWidth) / totalNumberOfCircles);
		var currentCircleWidth = outerCircleWidth;
		var previousCircle = $container.find('.targetContainer');
        var alt = 0;
        		
		for ( var i=scaleMin; i<=scaleMax; i++ ) {
						
			$container.find('.circle' + i)
            	.css({
					'zoom': 1,
                    'position': 'absolute',
                    'width': (currentCircleWidth) + 'px',
                    'height': currentCircleWidth + 'px',
                    'top': i===0 ? '0px' : (circleSizeDiff/2) - (circleBorderWidth/2) + 'px',
                    'left':i===0 ? '0px' : (circleSizeDiff/2) - (circleBorderWidth/2) + 'px',
                    '-webkit-border-radius':(currentCircleWidth/2) + 'px',
                    '-moz-border-radius':	(currentCircleWidth/2) + 'px', 
                    '-khtml-border-radius':	(currentCircleWidth/2) + 'px', 
                    'border-radius':		(currentCircleWidth/2) + 'px' 
                })
                .data('index',i);
           	
            $container.find('.circle' + scaleMin ).css('left',(($container.find('.targetContainer').outerWidth()/2) - $container.find('.circle' + scaleMin ).outerWidth()/2) +'px');
			
            if ( useAltCircle && alt === 1 ) $container.find('.circle' + i).addClass("alt");
            
			previousCircle = $container.find('.circle' + i);
			currentCircleWidth -= circleSizeDiff;
            
            if ( alt === 0 ) alt = 1;
            else alt = 0;
		
		}
						
        // Add class to center circle
        $('.circle'+scaleMax).addClass('innerCircle');
        
        // Resize center circle pic
        if ( $('.circleImg').outerWidth() > $('.innerCircle').outerWidth() ) {
            var ratio = $('.circleImg').outerHeight() / $('.circleImg').outerWidth();
            $('.circleImg').width( $('.innerCircle').outerWidth() );
           	$('.circleImg').height( $('.circleImg').outerHeight() * ratio );
            
        }
        
        $('.circleImg').css({
            'position':'absolute',
            'top':(($('.innerCircle').outerHeight() - $('.circleImg').outerHeight())/2) + 'px',
            'left':(($('.innerCircle').outerWidth() - $('.circleImg').outerWidth())/2) + 'px'
        });
        
        // Centralize text
		$('.circleText').css({
            'position':'absolute',
            'top':(($('.innerCircle').outerHeight() - $('.circleText').outerHeight())/2) + 'px',
            'width':'100%'
        });
		
		//var numberSize = (circleSizeDiff/2) > parseInt( fontSize ) ? parseInt( fontSize ) : (circleSizeDiff/2),
		//	lineHeight = (circleSizeDiff/2);
        var numberSize = fontSize,
			lineHeight = (circleSizeDiff/2);
		
		$container.find('.circleNumber').css({'font-size':numberSize + 'px','line-height':lineHeight + 'px'});
        
        // set target container to biggest circle height
        $container.find('.targetContainer').height($container.find('.circle' + scaleMin ).height() + circleBorderWidth + 40);
        
        // if start area smaller in height than target then increase height
        if ( $container.find('.startArea').height() < $container.find('.targetContainer').height() && landscape ) { 
            $container.find('.startArea').height( $container.find('.targetContainer').outerHeight() );
		}
		
		if ( !landscape ) { 
					
			if ( options.targetVerticalPosition === 'top' ) {
				$container.find('.targetContainer').css({'top':'0px','position':'absolute'});
				$container.find('.startArea').css({'top':$container.find('.targetContainer').outerHeight()+'px','position':'absolute'});
			} else {
				$container.find('.targetContainer').css('top',$container.find('.startArea').outerHeight()+'px');
				$container.find('.startArea').css('top','0px');
			}
			
        }
		
        // if not mobile place side by side
        if ( landscape && options.targetHorizontalPosition === "right" && parseInt(document.documentElement.clientWidth) > 500 ) {
			$container.find('.targetContainer').css({'left':$container.width() - $container.find('.targetContainer').width() + 'px'});
		} else if ( landscape && options.targetHorizontalPosition === "left" && parseInt(document.documentElement.clientWidth) > 500) {
			$container.find('.targetContainer').css({'left':'0px','position':'absolute'});
			$container.find('.startArea').css({'left':$container.find('.targetContainer').width() + 'px','position':'absolute'});
		}
		
		if ( !resizeToFit && !stackResponses ) {
			$container.find('.circle' + scaleMin ).css({
				'top': ($container.find('.targetContainer').height() - $container.find('.circle' + scaleMin ).height()) / 2,
				'left': ($container.find('.targetContainer').width() - $container.find('.circle' + scaleMin ).width()) / 2
			});
		} else {
			$container.find('.circle' + scaleMin ).css({
				'top': ($container.find('.targetContainer').height() - $container.find('.circle' + scaleMin ).height()) / 2
			});
		}
		
        // Initialise droppable	
		$( ".circle" ).droppable({
			
			tolerance: "pointer",
			greedy: true,
			drop: function( event, ui ) {

                $container.find('.over').removeClass('over');
								
				var x;
				var y;
				
				// NEW TEST
				// Start point
				var startX = event.pageX - (( resizeToFit || stackResponses ) ? 0 : $( ui.draggable ).data('oLeft')) - ($( ui.draggable ).outerWidth(true)/2) - $('.startArea').offset().left;
				var startY = event.pageY - (( resizeToFit || stackResponses ) ? 0 : $( ui.draggable ).data('oTop')) - ($( ui.draggable ).outerHeight(true)/2) - $('.startArea').offset().top;
				
				// End point
				var endX = ($(event.target).offset().left - (( resizeToFit || stackResponses ) ? 0 : $( ui.draggable ).data('oLeft'))) - $( ui.draggable ).outerWidth(true)/2 + $(event.target).outerWidth(true)/2 - $('.startArea').offset().left;
				var endY = ($(event.target).offset().top - (( resizeToFit || stackResponses ) ? 0 : $( ui.draggable ).data('oTop'))) - $( ui.draggable ).outerHeight(true)/2 + $(event.target).outerHeight(true)/2 - $('.startArea').offset().top;
	
				// Distance
				var distanceO = Math.sqrt( Math.pow((endX - startX),2) + Math.pow((endY - startY),2) );
				var distanceT = distanceO - (($(event.target).outerWidth(true) - (circleSizeDiff/2)) /2);
				
				var t = distanceT / distanceO;
				
				// Target point
				var targetX = ((1 - t)*startX) + (t*endX);
				var targetY = ((1 - t)*startY) + (t*endY);
				
				x = targetX;
				y = targetY;
							
				$( ui.draggable ).transition({ scale: options.scaleOnTarget, 'top':y + 'px', 'left':x + 'px' }).draggable({ 
					cursorAt: { 
						top:isMobile?(($(ui.draggable).data('oHeight'))/2):(($(ui.draggable).data('oHeight'))/4), 
						left:isMobile?(($(ui.draggable).data('oWidth'))/2):(($(ui.draggable).data('oWidth'))/4)
					}, 
					zIndex: 2700 
				}).attr('data-ontarget',true);

				iterations[$(ui.draggable).data('index')].element.val( parseInt($(this).data('index')) );
                if (window.askia) {
                    askia.triggerAnswer();
                }
					
				$('.responseItem').each(function(index) { 
					$('#res'+$(this).data('index')).removeClass('responseActive');
					$('.circle').unbind('click');
				});	
				
				$('html').off("mousemove");
				if ( resizeToFit || stackResponses ) {
					$('.responseItem[data-ontarget=false]').hide();
					$('.responseItem[data-ontarget=false]:hidden:first').show();
				}
				
				$(clickActive).removeClass('responseActive');
				$('.circle, .startArea').unbind('click');
				clickActive = null;
				
				$('.targetLayer').hide();
			},
            hoverClass: "over"
			
		});
        
        $( ".startArea" ).droppable({
			tolerance: "pointer",
			drop: function( event, ui ) {
				if ( resizeToFit || stackResponses ) {
					$( ui.draggable ).draggable({revert:'invalid', cursorAt: { 
						top:($(ui.draggable).data('oHeight'))/2, 
						left:($(ui.draggable).data('oWidth'))/2 
					}}).animate({ top:$(ui.draggable).data('oTop'), left:$(ui.draggable).data('oLeft') }).transition({ scale: 1 }).attr('data-ontarget',false);
				} else {
					
					$( ui.draggable ).draggable({revert:'invalid', cursorAt: { 
						top:($(ui.draggable).data('oHeight'))/2, 
						left:($(ui.draggable).data('oWidth'))/2 
					}}).animate({ top:0, left:0 }).transition({ scale: 1 }).attr('data-ontarget',false);
				}
				
                iterations[$(ui.draggable).data('index')].element.val('');
                if (window.askia) {
                    askia.triggerAnswer();
                }
				
				if ( resizeToFit || stackResponses ) {
					$('.responseItem[data-ontarget=false]').hide();
					$('.responseItem[data-ontarget=false]:hidden:first').show();
				}
				
				$(clickActive).removeClass('responseActive');
				$('.circle, .startArea').unbind('click');
				clickActive = null;
				
				$('.targetLayer').hide();
			},
            hoverClass: "over"
		});
        
		if ( ( (resizeToFit || stackResponses) && !landscape ) && ( $(window).height() > ( $container.find('.startArea').height() + $container.find('.targetContainer').height() ) ) ) {
						
			$container.find('.targetContainer').height( $(window).height() - $container.find('.startArea').height() + 'px');
            $container.find('.circle' + scaleMin ).css('top',(($container.find('.targetContainer').outerHeight()/2) - $container.find('.circle' + scaleMin ).outerHeight()/2) +'px');
						
			if ( options.targetVerticalPosition === 'top' ) {
           		$container.find('.targetContainer').css({'top':'0px','position':'absolute'});
				$container.find('.startArea').css({'top':$container.find('.targetContainer').outerHeight()+'px','position':'absolute'});
			} else {
				$container.find('.targetContainer').css('top',$container.find('.startArea').outerHeight()+'px');
				$container.find('.startArea').css('top','0px');
			}
			
		} else if ( landscape ) {
			
			if ( $container.find('.targetContainer').height() < $container.find('.startArea').height() ) {
				$container.find('.targetContainer').height( $container.find('.startArea').height() );
				$container.find('.circle' + scaleMin ).css('top',(($container.find('.targetContainer').outerHeight()/2) - $container.find('.circle' + scaleMin ).outerHeight()/2) +'px');
			} else {
				
			}
			
		}
		
        // Activate items
		$('.responseItem').each(function(question, index) { 
		
			if ( resizeToFit || stackResponses ) {
												
				$(this).css({
					'top' : (($container.find('.startArea').outerHeight()*0.5) - ($(this).outerHeight(true)*0.5)) + 'px'
				});
				
				
				var offset = $(this).offset();
				
				$(this).offset(offset);
				$(this).data({
					'oTop':(($container.find('.startArea').outerHeight()*0.5) - ($(this).outerHeight(true)*0.5)) + 'px'
				});
				
			}
			
			// if value is set then move item;
            var val = iterations[$(this).data('index')].element.val();
			
			$('#res'+$(this).data('index')).data({
				'left':$(this).offset().left, // REMOVE TOP AND LEFT DATA
				'top':$(this).offset().top,
				'onTarget':false
			});
			if ( val !=='' ) {
				
				var x = 0,
					y = 0;
				if ( resizeToFit || stackResponses ) {
					x = (($('.circle'+val).offset().left - $('.startArea').offset().left ) - ($(this).outerWidth(true)/2)) + (circleSizeDiff/4);
					y = (($('.circle'+val).offset().top - $('.startArea').offset().top ) - ($(this).outerHeight(true)/2) + ($('.circle'+val).outerHeight(true)/2));
				} else {
					x = (($('.circle'+val).offset().left - parseInt( $(this).data('oLeft') ) - $('.startArea').offset().left ) - ($(this).outerWidth(true)/2)) + (circleSizeDiff/4);
					y = (($('.circle'+val).offset().top - $('.startArea').offset().top ) - ($(this).outerHeight(true)/2) + ($('.circle'+val).outerHeight(true)/2));
				}
				
				// Place in random angle
				var r = ($('.circle'+val).width()/2) - (circleSizeDiff/4),
					a = x + r,
					b = y,
					t = (Math.PI*2) * (randomNR(0,100)/100);
				x = a + r * Math.cos(t);
				y = b + r * Math.sin(t); 
				                
				$('#res'+$(this).data('index')).draggable({ 
					revert : 'invalid', 
					distance: 10,
					cursorAt: { 
						top:isMobile?(($('#res'+$(this).data('index')).data('oHeight'))/2):(($('#res'+$(this).data('index')).data('oHeight'))/4), 
						left:isMobile?(($('#res'+$(this).data('index')).data('oWidth'))/2):(($('#res'+$(this).data('index')).data('oWidth'))/4)
					}})
					.animate({top:y, left:x}, 
						function(){ 
							$(this).draggable({ 
								revert : 'invalid', 
								cursorAt: { 
									top:isMobile?(($('#res'+$(this).data('index')).data('oHeight'))/2):(($('#res'+$(this).data('index')).data('oHeight')*options.scaleOnTarget)/2), 
									left:isMobile?(($('#res'+$(this).data('index')).data('oWidth'))/2):(($('#res'+$(this).data('index')).data('oWidth')*options.scaleOnTarget)/2)
								},
								zIndex: 2700
							});
						}
					)
					.transition({ scale: options.scaleOnTarget })
					.bind('click', function (e) {
						
						noDrag(e.target);
						e.stopPropagation();
							
					})
					.attr('data-ontarget',true);
					
			} else {
				
				// Initialise draggables
				$('#res'+$(this).data('index')).draggable({ 
					revert: 'invalid',
					distance: 10, 
					zIndex: 2700, 
					cursorAt: { 
						top:$(this).outerHeight()/2, 
						left:$(this).outerWidth()/2 
					},
					drag: function( event, ui ) {
						
						var x = ($('.circle' + scaleMin ).offset().left - $( this ).data('oLeft')) + $('.circle' + scaleMin ).outerWidth(true)/2;
						var y = ($('.circle' + scaleMin ).offset().top - $( this ).offset().top) - 
								$( event.target ).outerHeight()/2 + $('.circle' + scaleMin ).outerHeight()/2;
						
						var targetX = $('.circle' + scaleMin ).offset().left + $('.circle' + scaleMin ).outerWidth(true)/2;
						var targetY = $('.circle' + scaleMin ).offset().top + $('.circle' + scaleMin ).outerHeight()/2;
						
						var annoyingDiffX = ($(this).outerWidth() - $(this).width())/2;
						var annoyingDiffY = ($(this).outerWidth() - $(this).width())/2;
						
						var distanceX = ($('.circle' + scaleMin ).offset().left + $('.circle' + scaleMin ).outerWidth()/2) - 
										($(this).offset().left + annoyingDiffX + $(this).outerWidth()/2);
						var distanceY = ($('.circle' + scaleMin ).offset().top + $('.circle' + scaleMin ).outerHeight()/2) - 
										($(this).offset().top + annoyingDiffY + $(this).outerHeight()/2);
						
					}
				}).bind('click', function (e) {
					noDrag(e.target);	
					e.stopPropagation();				
				})
				.attr('data-ontarget',false);
			}
			
			if ( resizeToFit || stackResponses ) {
				$('#res'+$(this).data('index')).hide();
				$('.responseItem[data-ontarget=true]').show();
			}
			
		});
		
		if ( landscape ) $container.height( $container.find('.targetContainer').outerHeight() );
		else $container.height( $container.find('.targetContainer').outerHeight() + $container.find('.startArea').outerHeight() );
		
		// Select next reponse
		if ( selectNextResponse ) {
			noDrag($(".responseItem[data-ontarget='false']").eq(0));	
		}
			
        function noDrag(target) {
									
			if ( $(target).attr('class') === 'responseTargetLayer' ) target = $(target).parent().get();
			
            if ( $(target).hasClass('responseActive') ) {
				
                clickActive = null;
                $(target).removeClass('responseActive');
                $('.circle').unbind('click');

				$('.targetLayer').hide();
				
            } else {
				
                // deselect all others
                $('.responseItem').each(function(index) { 
                    $('#res'+$(this).data('index')).removeClass('responseActive');
                    $('.circle').unbind('click');
                });

                $(target).addClass('responseActive');
				clickActive = target;

                $('.circle').bind('click', function (e) {
					if ( $(e.target).data('index') === $(this).data('index') ) setTarget(e);	
                });

				$('.targetLayer').css({'display':'block','width':$container.find('.startArea').outerWidth(),'height':$container.find('.startArea').outerHeight(),'position':'absolute','top':'0','left':'0','background':'rgba(000,000,000,0)','z-index':'10000'});
				$('.startArea').bind('click', function (e) {
                    if ( $(e.target).data('index') == $(this).data('index') ) setTarget('start');
                });

            }
						
        }
	
        function setTarget(e) {
						
			if ( e !== 'start' ) {
								
				$(clickActive).animate({
					top:e.pageY - (( resizeToFit || stackResponses ) ? 0 : $(clickActive).data('oTop')) - ($(clickActive).outerHeight(true)/2) - $('.startArea').offset().top,
					left:e.pageX - (( resizeToFit || stackResponses ) ? 0 : $(clickActive).data('oLeft')) - ($(clickActive).outerWidth(true)/2) - $('.startArea').offset().left
				},function() {
					if ( resizeToFit || stackResponses ) {
						$('.responseItem[data-ontarget=false]').hide();
						$('.responseItem[data-ontarget=false]:hidden:first').show();
					}
					$('.targetLayer').hide();
					
					if ( selectNextResponse ) {
						noDrag($(".responseItem[data-ontarget='false']").eq(0));	
					} else {
						$(clickActive).removeClass('responseActive');
						$('.circle, .startArea').unbind('click');
						clickActive = null;
					}
				}).transition({ scale: options.scaleOnTarget }).attr('data-ontarget',true);
				
				iterations[$(clickActive).data('index')].element.val( parseInt($(e.target).data('index')) );
                if (window.askia) {
                    askia.triggerAnswer();
                }
			
			} else {
				
				if ( resizeToFit || stackResponses ) {
					$( clickActive ).animate({ top:$(clickActive).data('oTop'), left:$(clickActive).data('oLeft') },function() {
						$('.responseItem[data-ontarget=false]').hide();
						$('.responseItem[data-ontarget=false]:hidden:first').show();
					}).transition({ scale: 1 }).attr('data-ontarget',false);
				} else {
					$( clickActive ).animate({ top:0, left:0 },function() {
						if ( resizeToFit || stackResponses ) {
							$('.responseItem[data-ontarget=false]').hide();
							$('.responseItem[data-ontarget=false]:hidden:first').show();
						}
					}).transition({ scale: 1 }).attr('data-ontarget',false);
				}
				$('.targetLayer').hide();
				
				if ( selectNextResponse ) {
					noDrag($(".responseItem[data-ontarget='false']").eq(0));
				} else {
					$(clickActive).removeClass('responseActive');
					$('.circle, .startArea').unbind('click');
					clickActive = null;
				}
				
			}
			
        }
		
		if ( options.animate ) {
			var delay = 0,
				easing = (!$.support.transition)?'swing':'snap';
			
			$container.find('.responseItem').each(function forEachItem() {
				$container.css({ y: 200, opacity: 0 }).transition({ y: 0, opacity: 1, delay: delay }, options.animationSpeed, easing);
				delay += 30;
			});
		}
		if ( total_images > 0 ) {
			$container.find('img').each(function() {
				var fakeSrc = $(this).attr('src');
				$("<img/>").css('display', 'none').load(function() {
					images_loaded++;
					if (images_loaded >= total_images) {
						
						// now all images are loaded.
						$container.css('visibility','visible');
						if ( resizeToFit || stackResponses ) $('.responseItem[data-ontarget=false]:hidden:first').show();
	
					}
				}).attr("src", fakeSrc);
			});
		} else {
			$container.css('visibility','visible');
			
			if ( resizeToFit || stackResponses ) $('.responseItem[data-ontarget=false]:hidden:first').show();
		}
		
		// Returns the container
		return this;
	};
	
} (jQuery));