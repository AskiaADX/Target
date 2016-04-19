(function ($) {
	"use strict";

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
        (options.innerCircleWidth = options.innerCircleWidth || 100);
        (options.outerCircleWidth = options.outerCircleWidth || 400);
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
			enableMobileFit = false,
            mouseMove = false,
            useAltCircle = Boolean(options.useAltCircle);
		
        var isMobile = false; //initiate as false
		// device detection
		if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;
        
        if ( isMobile ) {
            // if mobile set widths to 100%
            $container.find('.startArea').width('100%');
            $container.find('.targetContainer').width('100%');
        }
        
        
        
		if ( autoStackWidth !== '' ) {
			if ( $(this).parents('.controlContainer').width() <= parseInt(autoStackWidth) ) {
				stackResponses = true,
				enableMobileFit = true;
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
				'oTop':$(this).offset().top,
				'oLeft':$(this).offset().left,
				'oHeight':$(this).outerHeight(),
				'oWidth':$(this).outerWidth()
			});
			if ( $(this).outerWidth(true) > $('.startArea').width() )
				$(this).width( $(this).width() - ($(this).outerWidth(true) - $('.startArea').outerWidth()) );
		});
		
		// add ns to last x items
		if ( options.numberNS > 0 ) $container.find('.responseItem').slice(-options.numberNS).addClass('ns');
		
		// Use range if on
		if ( options.useRange ) {
			var maxNumber = $container.find('.responseItem').size() - options.numberNS;
			var rangeArray = options.range.split(';');
			
			var rainbow1 = new Rainbow();
				rainbow1.setSpectrum(processRgb(rangeArray[0]), processRgb(rangeArray[2]));
				rainbow1.setNumberRange(0, maxNumber);
			var rainbow2 = new Rainbow();
				rainbow2.setSpectrum(processRgb(rangeArray[1]), processRgb(rangeArray[3]));
				rainbow2.setNumberRange(0, maxNumber);
			$container.find('.responseItem').slice(0,(options.numberNS > 0)?0-options.numberNS:$container.find('.responseItem').size()).each(function( index ) {

				if ( options.rangeGradientDirection == 'ltr' ) { 
					$(this).css({ 'background': '#'+rainbow1.colourAt(index) });
					$(this).css({ 'background': '-moz-linear-gradient(left,  #'+rainbow1.colourAt(index)+' 0%, #'+rainbow2.colourAt(index)+' 100%)' });
					$(this).css({ 'background': '-webkit-gradient(linear, left top, right top, color-stop(0%,#'+rainbow1.colourAt(index)+'), color-stop(100%,#'+rainbow2.colourAt(index)+'))' });
					$(this).css({ 'background': '-webkit-linear-gradient(left, #'+rainbow1.colourAt(index)+' 0%,#'+rainbow2.colourAt(index)+' 100%)' });
					$(this).css({ 'background': '-o-linear-gradient(left, #'+rainbow1.colourAt(index)+' 0%,#'+rainbow2.colourAt(index)+' 100%)' });
					$(this).css({ 'background': '-ms-linear-gradient(left, #'+rainbow1.colourAt(index)+' 0%,#'+rainbow2.colourAt(index)+' 100%)' });
					$(this).css({ 'background': 'linear-gradient(to right, #'+rainbow1.colourAt(index)+' 0%,#'+rainbow2.colourAt(index)+' 100%)' });
					$(this).css({ 'filter': 'progid:DXImageTransform.Microsoft.gradient( startColorstr=#'+rainbow1.colourAt(index)+', endColorstr=#'+rainbow2.colourAt(index)+',GradientType=1 )' });
				} else {
					$(this).css({ 'background': '#'+rainbow1.colourAt(index) });
					$(this).css({ 'background': '-moz-linear-gradient(top,  #'+rainbow1.colourAt(index)+' 0%, #'+rainbow2.colourAt(index)+' 100%)' });
					$(this).css({ 'background': '-webkit-gradient(linear, left top, left bottom, color-stop(0%,#'+rainbow1.colourAt(index)+'), color-stop(100%,#'+rainbow2.colourAt(index)+'))' });
					$(this).css({ 'background': '-webkit-linear-gradient(top, #'+rainbow1.colourAt(index)+' 0%,#'+rainbow2.colourAt(index)+' 100%)' });
					$(this).css({ 'background': '-o-linear-gradient(top, #'+rainbow1.colourAt(index)+' 0%,#'+rainbow2.colourAt(index)+' 100%)' });
					$(this).css({ 'background': '-ms-linear-gradient(top, #'+rainbow1.colourAt(index)+' 0%,#'+rainbow2.colourAt(index)+' 100%)' });
					$(this).css({ 'background': 'linear-gradient(to bottom, #'+rainbow1.colourAt(index)+' 0%,#'+rainbow2.colourAt(index)+' 100%)' });
					$(this).css({ 'filter': 'progid:DXImageTransform.Microsoft.gradient( startColorstr=#'+rainbow1.colourAt(index)+', endColorstr=#'+rainbow2.colourAt(index)+',GradientType=0 )' });
				}
				
			});
		}
        
        // set start area to height of responses
        $container.find('.startArea').height( $container.find('.startArea').height() );
        $container.find('.targetContainer').height( $container.find('.circle0').height() );
	
		//if ( !stackResponses ) {
		for ( var i=($('.responseItem').size()-1); i>=0; i-- ) {
		
			/*var offset = $('.responseItem').eq(i).offset();
			$('.responseItem').eq(i).offset(offset);
			$('.responseItem').eq(i).data({
				'oTop':$('.responseItem').eq(i).offset().top,
				'oLeft':$('.responseItem').eq(i).offset().left,
				'oHeight':$('.responseItem').eq(i).outerHeight(),
				'oWidth':$('.responseItem').eq(i).outerWidth()
			});*/
				
		}
		if ( stackResponses ) {
			
			for ( var i=($('.responseItem').size()-1); i>=0; i-- ) {
		
				var offset = $('.responseItem').eq(0).offset();
				$('.responseItem').eq(i).css("position", "absolute");
				$('.responseItem').eq(i).offset(offset);
                $('.responseItem').eq(i).data({
                    'oTop':$('.responseItem').eq(i).offset().top,
                    'oLeft':$('.responseItem').eq(i).offset().left,
                    'oHeight':$('.responseItem').eq(i).outerHeight(),
                    'oWidth':$('.responseItem').eq(i).outerWidth()
                });
			}
			
			var maxHeight = 0;

			$(".responseItem").each(function(){
			   if ($(this).outerHeight(true) > maxHeight) { maxHeight = $(this).outerHeight(true); }
			});
									
			$('.startArea').height( maxHeight );
			
		}
        
        /* Circles */
        var totalNumberOfCircles = options.scaleMax - options.scaleMin + 1;
		var circleSizeDiff = (options.outerCircleWidth - options.innerCircleWidth) / totalNumberOfCircles;
		var currentCircleWidth = options.outerCircleWidth;
		var previousCircle = $container.find('.targetContainer');
        var alt = 0;
        		
		for ( var i=0; i<totalNumberOfCircles; i++ ) {
			
			$container.find('.circle' + i)
            	.css({
					'zoom': 1,
                    'position': 'absolute',
                    'width': currentCircleWidth + 'px',
                    'height': currentCircleWidth + 'px',
                    'top': i==0?'0px' : (circleSizeDiff/2) /*- options.borderWidth*/ + 'px',
                    'left':i==0?'0px' : (circleSizeDiff/2) /*- options.borderWidth*/ + 'px',
                    '-webkit-border-radius':(currentCircleWidth/2) + 'px',
                    '-moz-border-radius':	(currentCircleWidth/2) + 'px', 
                    '-khtml-border-radius':	(currentCircleWidth/2) + 'px', 
                    'border-radius':		(currentCircleWidth/2) + 'px' 
                })
                .data('index',i);

            if ( useAltCircle && alt === 1 ) $container.find('.circle' + i).addClass("alt");
            
			previousCircle = $container.find('.circle' + i);
			currentCircleWidth -= circleSizeDiff;
            
            if ( alt === 0 ) alt = 1;
            else alt = 0;
		
		}
        
        // set target container to biggest circle height
        $container.find('.targetContainer').height($container.find('.circle0').height());
        
        // if start area smaller in height than target then increase height
        if ( $container.find('.startArea').height() < $container.find('.targetContainer').height() ) $container.find('.startArea').height( $container.find('.targetContainer').outerHeight() );
        
        // if not mobile place side by side
        if ( !isMobile && options.targetHorizontalPosition == "right" ) $container.find('.targetContainer').css('left','50%');
        else if ( !isMobile && options.targetHorizontalPosition == "left" ) $container.find('.startArea').css({'left':'50%','position':'absolute'});
		
        // Initialise droppable	
		$( ".circle" ).droppable({
			
			tolerance: "pointer",
			greedy: true,
			drop: function( event, ui ) {
                
                $container.find('.over').removeClass('over');
								
				var x;
				var y;
				
				var posA = ($(event.target).offset().left - $( ui.draggable ).data('oLeft')) - $( ui.draggable ).outerWidth()/2 + $(event.target).outerWidth()/2; 
				var posB = ($(event.target).offset().top - $( ui.draggable ).data('oTop')) - $( ui.draggable ).outerHeight()/2 + $(event.target).outerHeight()/2;
				
				var posX = event.pageX - $( ui.draggable ).data('oLeft') - ($( ui.draggable ).data('oWidth'))/2;
				var posY = event.pageY - $( ui.draggable ).data('oTop') - ($( ui.draggable ).data('oHeight'))/2;
				
				var angle = Math.atan2( posY - posB, posX - posA )/* * 180 / Math.PI*/;
				
				var circleRadius = $(event.target).outerWidth()/2;
                circleRadius -= circleSizeDiff/4;
				
				var distance = Math.sqrt( Math.pow((posX - posA),2) + Math.pow((posY - posB),2) );
				
				if ( distance > circleRadius ) {
					x = posA + ( Math.cos(angle) * circleRadius );
					y = posB + ( Math.sin(angle) * circleRadius );
				}
				
				$( ui.draggable ).transition({ scale: options.scaleOnTarget, 'top':y + 'px', 'left':x + 'px' }).draggable({ cursorAt: { 
						top:($(ui.draggable).data('oHeight')*options.scaleOnTarget)/2, 
						left:($(ui.draggable).data('oWidth')*options.scaleOnTarget)/2
					}, zIndex: 2700 });
                										
				// FIX var currentQuestion = questions[$( ui.draggable ).data('index')];
				// FIX 	currentQuestion.setValue( parseInt($(this).data('index'))+options.scaleMin );
                iterations[$(ui.draggable).data('index')].element.val( parseInt($(this).data('index'))+options.scaleMin );
					
				$('.responseItem').each(function(index) { 
					$('#res'+$(this).data('index')).removeClass('responseActive');
					$('.circle').unbind('click');
				});	
				
				$('html').off("mousemove");
			},
            hoverClass: "over"
			/*over: function( event, ui ) {
				
				if ( $(this).parents('.circle').hasClass('over') ) $(this).parents('.circle').removeClass('over');
				$(this).addClass('over');

			},
			out: function( event, ui ) {
				
				if ( $(this).parent().hasClass('circle') ) $(this).parent().addClass('over');
				$(this).removeClass('over');
				
			},*/
            
			
		});
        
        $( ".startArea" ).droppable({
			tolerance: "pointer",
			drop: function( event, ui ) {
				$( ui.draggable ).draggable({revert:'invalid', cursorAt: { 
					top:($(ui.draggable).data('oHeight'))/2, 
					left:($(ui.draggable).data('oWidth'))/2 
				}}).animate({ top:0, left:0 }).transition({ scale: 1 });
				
				// FIX var currentQuestion = questions[$( ui.draggable ).data('index')];
				// FIX	currentQuestion.clearValues();
                iterations[$(ui.draggable).data('index')].element.val('');
			},
            hoverClass: "over"
		});
        
        // Activate items
		
		$('.responseItem').each(function(question, index) { 
			
			// if value is set then move item;
			// FIX var currentQuestion = questions[$(this).data('index')];
			// FIX var val = currentQuestion.getValue();
            var val = iterations[$(this).data('index')].element.val();
			
			$('#res'+$(this).data('index')).data({
				'left':$(this).offset().left, // REMOVE TOP AND LEFT DATA
				'top':$(this).offset().top,
				'onTarget':false
			});
			if ( val != '' ) {
                
				//top left
				var x = ($('.circle'+val).offset().left - $('#res'+$(this).data('index')).data('oLeft')) - $('#res'+$(this).data('index')).outerWidth()/2;
				var y = ($('.circle'+val).offset().top - $('#res'+$(this).data('index')).data('oTop')) - $('#res'+$(this).data('index')).outerHeight()/2 + $('.circle'+val).outerHeight()/2;
				
                // Place in random angle
                var r = $('.circle'+val).width()/2,
                    a = x + r,
                    b = y,
                    t = (Math.PI*2) * (randomNR(0,100)/100);
                x = a + r * Math.cos(t);
                y = b + r * Math.sin(t);    
    			//x = a + (r cos t)
    			//y = b + (r sin t)
                
				$('#res'+$(this).data('index')).draggable({ 
					revert : 'invalid', 
					cursorAt: { 
						top:$(this).outerHeight()/2, 
						left:$(this).outerWidth()/2 
					}})
					.animate({top:y, left:x}, 
						function(){ 
							$(this).draggable({ 
								revert : 'invalid', 
								cursorAt: false, 
								zIndex: 2700
							})
						}
					)
					.transition({ scale: options.scaleOnTarget })
					.bind('click', function (event) {
						noDrag(event.target);	
					});
			} else {
				// Initialise draggables
				$('#res'+$(this).data('index')).draggable({ 
					revert: 'invalid', 
					zIndex: 2700, 
					cursorAt: { 
						top:$(this).outerHeight()/2, 
						left:$(this).outerWidth()/2 
					},
					drag: function( event, ui ) {
						
						var x = ($('.circle0').offset().left - $( this ).data('oLeft')) + $('.circle0').outerWidth(true)/2;
						var y = ($('.circle0').offset().top - $( this ).offset().top) - 
								$( event.target ).outerHeight()/2 + $('.circle0').outerHeight()/2;
						
						var targetX = $('.circle0').offset().left + $('.circle0').outerWidth(true)/2;
						var targetY = $('.circle0').offset().top + $('.circle0').outerHeight()/2;
						
						var annoyingDiffX = ($(this).outerWidth() - $(this).width())/2;
						var annoyingDiffY = ($(this).outerWidth() - $(this).width())/2;
						
						var distanceX = ($('.circle0').offset().left + $('.circle0').outerWidth()/2) - 
										($(this).offset().left + annoyingDiffX + $(this).outerWidth()/2);
						var distanceY = ($('.circle0').offset().top + $('.circle0').outerHeight()/2) - 
										($(this).offset().top + annoyingDiffY + $(this).outerHeight()/2);
						
					}
				}).bind('click', function (event) {
					noDrag(event.target);	
				});
			}
			
		});
			
        function noDrag(target) {

            if ( $(target).hasClass('responseActive') ) {
                clickActive = null;
                $(target).removeClass('responseActive');
                $('.circle').unbind('click');
            } else {
                // deselect all others
                $('.responseItem').each(function(index) { 
                    $('#res'+$(this).data('index')).removeClass('responseActive');
                    $('.circle').unbind('click');
                });
				clickActive = $(target);
                $(target).addClass('responseActive');
                $('.circle').bind('click', function (e) {
                    if ( $(e.target).data('index') == $(this).data('index') ) setTarget(e);	
                });
            }

        }
	
        function setTarget(e) {

            $(clickActive).animate({
                top:e.pageY - $(clickActive).data('top') - ($(clickActive).outerHeight()/2),
                left:e.pageX - $(clickActive).data('left') - ($(clickActive).outerWidth()/2)
            }).transition({ scale: options.scaleOnTarget }).data('onTarget',true);

            /*var currentQuestion = questions[$( clickActive ).data('index')];
                currentQuestion.setValue( parseInt($(e.target).data('index'))+options.scaleMin );*/
            iterations[$(clickActive).data('index')].element.val( parseInt($(e.target).data('index'))+options.scaleMin );

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
	
					}
				}).attr("src", fakeSrc);
			});
		} else {
			$container.css('visibility','visible');
		}
		
		// Returns the container
		return this;
	};
	
} (jQuery));