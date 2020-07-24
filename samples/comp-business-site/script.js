$(function() {
	//Scroll animations
	$('#head-nav a').click(function (){
		var linktag = $(this).attr('href');
		//var linktag = $('section.read').attr('id');
		var targetdist = 50;
		if($(linktag).length){
			var offsetValue = $(linktag).offset().top;
			$('html, body').animate({
				scrollTop: offsetValue - targetdist
			}, 1200);
		}
		return false;
	}); 
	
	//Tabular animations
	$('#features .tabs li').on('click', function() {
		//find the container that the event was clicked on 
		var panels = $(this).closest('.tabs');
		//figure out which panel to show
		var tpanel = $(this).attr('rel');
		//if we use the 'data-tabpanel' tag
		//var tpanel = $(this).data('tabpanel');
		
		//Change active tab.
		$('#features .tabs li.is-active').removeClass('is-active');
		$(this).addClass('is-active');
		
		//hide the current panel and show the new one.
		$('#features .tab.is-active').slideUp(300, function() {
			$(this).removeClass('is-active');
			$('#'+tpanel).slideDown(240, function() {
				$(this).addClass('is-active');
			});
		});
	});
	
	//Send requests
	var form = $('#enq-message');
	// Get the messages div.
    var formMessages = $('#message');
	$(form).submit(function(event) {
		event.preventDefault(); // Debug
		alert('Request sent');
		var formData = $(form).serialize();
		$.ajax({
			type: 'POST',
			url: $(form).attr('action'),
			data: formData
		}).done(function(res) {
			$(formMessages).removeClass('has-text-danger');
			$(formMessages).addClass('has-text-success');
			$(formMessages).text(res);
			
			//Clear the form
			$('#email').val('');
			$('#enquiry').val('');
		}).fail(function(data) {
			$(formMessages).removeClass('has-text-success');
			$(formMessages).addClass('has-text-danger');
			//Set the message text 
			if(data.responseText !== ''){
				$(formMessages).text(data.responseText);
			}else if(data.status === 400) {
				$(formMessages).text('We couldn\'t connect to the server, we will be back shortly.');
			}else{
				$(formMessages).text('Oops an error occurred, please try again later.');
			}
		});
	});
});

//Dumped sources
var services = {};