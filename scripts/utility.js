

$(document).ready(function () {
							
	
	$('#accordion-1').easyAccordion({ 
			autoStart: true,
			slideInterval: 3000,
			pauseOnHover: true,
			actOnHover: true,
			continuous: true
	});
	
	$('#accordion-2').easyAccordion({ 
			autoStart: false,
			actOnHover: false
	});
	
	$('#accordion-3').easyAccordion({ 
			autoStart: false,
			startSlide: 3,
			actOnHover: false,
			slideNum:false	
	}); 
	
	$('#accordion-4').easyAccordion({ 
			autoStart: false,
			slideInterval: 5000,
	}); 
		
});