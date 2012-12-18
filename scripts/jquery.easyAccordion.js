/*
 * 	easyAccordion 0.1.7 - jQuery plugin
 *	written by Andrea Cima Serniotti	
 *	http://www.madeincima.eu
 *
 *	Copyright (c) 2010 Andrea Cima Serniotti (http://www.madeincima.eu)
 *	Dual licensed under the MIT (MIT-LICENSE.txt) and GPL (GPL-LICENSE.txt) licenses.
 *	Built for jQuery library http://jquery.com
 *
 *  0.1.1 7-05-2011 Luch Klooster
 *  Added support for Opera browser
 *  0.1.2 26-06-2011 Luch Klooster
 *  Added support for IE9, improved slide-number display for IE8 and IE9
 *  0.1.3 01-07-2011 Luch Klooster
 *  Added support for skins with activeCorner (eg. Stitch)
 *  Added pauseOnHover
 *  0.1.4 19-02-2012 Luch Klooster
 *  Added write/read sessionstorage to support retaining active spine after page refresh
 *  0.1.5 2012-05-03 Martin Gautier (Fear of Mice)
 *  Fixed "accordionInstance is undefined" on click event
 *  Added afterClickCallback option
 *  0.1.6 2012-12-10 Luch Klooster
 *  Added support for IE10, keeping support of IE9, IE8, IE7 and IE6
 *  0.1.7 2012-12-15 Luch Klooster
 *  Added loop true slides ones and stop on startSlide (parameter continuous: true|false) (thanks to matt mcinvale)
 *  Added act on hover of spine (parameter actOnHover: true|false)
 */
 
(function(jQuery) {
	jQuery.fn.easyAccordion = function(options) {
	
	var defaults = {			
		slideNum: true,
		autoStart: false,
		pauseOnHover: false,
		actOnHover: false,
		slideInterval: 3000,
		startSlide: 1,
		afterClickCallback: null,
		continuous: true
	};
			
	this.each(function() {
		
		var settings = jQuery.extend(defaults, options);
		jQuery(this).find('dl').addClass('easy-accordion');
		
		// -------- Set the variables ------------------------------------------------------------------------------
		
		jQuery.fn.setVariables = function() {
			dlWidth = jQuery(this).width();
			dlHeight = jQuery(this).height();
			dtWidth = jQuery(this).find('dt').outerHeight();
			dtWidth2 = dtWidth;
			slideTotal = jQuery(this).find('dt').size();
			ddWidth = dlWidth - (dtWidth*slideTotal) - (jQuery(this).find('dd').outerWidth(true)-jQuery(this).find('dd').width());
			if (jQuery.browser.msie && jQuery.browser.version < 9.0){
				dtWidth = jQuery(this).find('dt').outerWidth();
				jQuery('html').addClass('lteIE8'); // Add class lteIE8 to HTML tag for 'conditional' CSS
			}
			dtHeight = dlHeight - (jQuery(this).find('dt').outerWidth()-jQuery(this).find('dt').width());
			ddHeight = dlHeight - (jQuery(this).find('dd').outerHeight(true)-jQuery(this).find('dd').height());
		};
		jQuery(this).setVariables();
		
		// -------- Fix some cross-browser issues due to the CSS rotation -------------------------------------

		var dtTop = (dlHeight-dtWidth)/2; var dtOffset = -dtTop;
		if (jQuery.browser.msie && jQuery.browser.version < 9.0) {
			var dtTop = 0;
			var dtOffset = 0;
		}
		
		// -------- Getting things ready ------------------------------------------------------------------------------
		
		var f = 1;
		var noMoreActiveID = 0;
		var startSlide = settings.startSlide;
		var accordionID = jQuery(this).find('dl').parent('div').attr('id');
		if (sessionStorage.getItem(accordionID)) {
			// Restore the contents of the text field
			startSlide = sessionStorage.getItem(accordionID);
		}
		jQuery(this).find('dt').each(function(){
			jQuery(this).css({'width':dtHeight,'top':dtTop,'margin-left':dtOffset});	
			// add unique id to each tab
			jQuery(this).addClass('spine_' + f);
			// add active corner
			var corner = document.createElement('div');
			corner.className = 'activeCorner spine_' + f;
			jQuery(this).append(corner);
			if (settings.slideNum == true){
				jQuery('<span class="slide-number">'+f+'</span>').appendTo(this);
				if (jQuery.browser.msie){
					var slideNumTop = jQuery(this).find('.slide-number').css('bottom');
					var slideNumTopVal = parseInt(slideNumTop) + parseInt(jQuery(this).css('padding-top'));
					var slideNumLeft = 10;	
					if (jQuery.browser.version == 8.0){
						slideNumTopVal = slideNumTopVal - 17;
						slideNumLeft = 0;
					}	
					if (jQuery.browser.version == 6.0 || jQuery.browser.version == 7.0){
						slideNumTopVal = slideNumTopVal + 17;
						slideNumLeft = 0;
					}	
					jQuery(this).find('.slide-number').css({'bottom': slideNumTopVal}); 
					jQuery(this).find('.slide-number').css({'left': slideNumLeft})
				} else {
					var slideNumTop = jQuery(this).find('.slide-number').css('bottom');
					var slideNumTopVal = parseInt(slideNumTop) + parseInt(jQuery(this).css('padding-top')); 
					jQuery(this).find('.slide-number').css({'bottom': slideNumTopVal}); 
				}
			}
			if (startSlide == f){
			    jQuery(this).addClass('active');
			}
			f = f + 1;
		});
		if (jQuery(this).find('.active').size()) { 
			jQuery(this).find('.active').next('dd').addClass('active');
		} else {
			jQuery(this).find('dt:first').addClass('active').next('dd').addClass('active');
		}
		
		jQuery(this).find('dt:first').css({'left':'0'}).next().css({'left':dtWidth2});
		jQuery(this).find('dd').css({'width':ddWidth,'height':ddHeight});	

		
		// -------- Functions ------------------------------------------------------------------------------

		//jQuery.each( jQuery(".verticalText"), function () { jQuery(this).html(jQuery(this).text().replace(/(.)/g, "$1<br />")) } );
		
		jQuery.fn.findActiveSlide = function() {
			var i = 1;
			jQuery(this).find('dt').each(function(){
				if (jQuery(this).hasClass('active')){
					activeID = i; // Active slide
				} else if (jQuery(this).hasClass('no-more-active')){
					noMoreActiveID = i; // No more active slide
				}
				i = i + 1;
			});
		};
			
		jQuery.fn.calculateSlidePos = function() {
			var u = 2;
			jQuery(this).find('dt').not(':first').each(function(){	
				var activeDtPos = dtWidth*activeID;
				if (u <= activeID){
					var leftDtPos = dtWidth*(u-1);
					jQuery(this).animate({'left': leftDtPos});
					if (u < activeID){ // If the item sits to the left of the active element
						jQuery(this).next().css({'left':leftDtPos+dtWidth});	
					} else { // If the item is the active one
						jQuery(this).next().animate({'left':activeDtPos});
					}
				} else {
					var rightDtPos = dlWidth-(dtWidth*(slideTotal-u+1));
					jQuery(this).animate({'left': rightDtPos});
					var rightDdPos = rightDtPos+dtWidth;
					jQuery(this).next().animate({'left':rightDdPos});	
				}
				u = u+ 1;
			});
			setTimeout( function() {
				jQuery('.easy-accordion').find('dd').not('.active').each(function(){ 
					jQuery(this).css({'display':'none'});
				});
			}, 400);
			
		};
	
		jQuery.fn.activateSlide = function() {
			this.parent('dl').setVariables();	
			this.parent('dl').find('dd').css({'display':'block'});
			this.parent('dl').find('dd.plus').removeClass('plus');
			this.parent('dl').find('.no-more-active').removeClass('no-more-active');
			this.parent('dl').find('.active').removeClass('active').addClass('no-more-active');
			this.addClass('active').next().addClass('active');	
			this.parent('dl').findActiveSlide();
			if (activeID < noMoreActiveID){
				this.parent('dl').find('dd.no-more-active').addClass('plus');
			}
			this.parent('dl').calculateSlidePos();
			sessionStorage.setItem(this.parent('dl').parent('div').attr('id'), activeID); 
		};
	
		jQuery.fn.rotateSlides = function(slideInterval, timerInstance) {
			var accordionInstance = jQuery(this);
			timerInstance.value = setTimeout(function(){accordionInstance.rotateSlides(slideInterval, timerInstance);}, slideInterval);
			if (timerInstance.paused == false){
				jQuery(this).findActiveSlide();
				var totalSlides = jQuery(this).find('dt').size();
				var newSlide = activeID + 1;
				if (newSlide > totalSlides) {
					newSlide = 1;
				}
				jQuery(this).find('dt:eq(' + (newSlide-1) + ')').activateSlide(); // activate the new slide
				if (settings.continuous == false) {
					if (newSlide == startSlide) {
						clearTimeout(timerInstance.value);
						return;
					}
				}
			}
		};

		// -------- Let's do it! ------------------------------------------------------------------------------
		
		function trackerObject() {this.value = null}
		var timerInstance = new trackerObject();
		timerInstance.paused = false;
		
		jQuery(this).findActiveSlide();
		jQuery(this).calculateSlidePos();
		jQuery(this).find('dt.active').activateSlide();
		
		if (settings.autoStart == true){
			var accordionInstance = jQuery(this);
			var interval = parseInt(settings.slideInterval);
			timerInstance.value = setTimeout(function(){accordionInstance.rotateSlides(interval, timerInstance);}, interval);
		} 

		jQuery(this).find('dt').not('active').click(function(){
			jQuery(this).activateSlide();
			accordionInstance = jQuery(this);
			if (settings.autoStart == true){
				clearTimeout(timerInstance.value);
			}
			if (typeof settings.afterClickCallback == "function") settings.afterClickCallback(); //activate callback if there is one
		})	
		
		jQuery(this).find('dt').mouseenter(function(){
			if (settings.actOnHover == true) {
				timerInstance.paused = true;
				jQuery(this).activateSlide();
			}
		})

		jQuery(this).find('dt').mouseleave(function(){
			if (settings.actOnHover == true) {
				timerInstance.paused = false;
			}
		})	
		
		if (!(jQuery.browser.msie && jQuery.browser.version == 6.0)){ 
			jQuery(this).find('dt').hover(function(){
				jQuery(this).addClass('hover');
			}, function(){
				jQuery(this).removeClass('hover');
			});
		}
		if (settings.pauseOnHover == true){
			jQuery(this).find('dd').hover(function(){
				timerInstance.paused = true;
			}, function(){
				timerInstance.paused = false;
			});
		}
	});
	};
})(jQuery);