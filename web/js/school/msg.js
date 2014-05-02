define(['config','cache','helper/view'],function(config,Cache,View){
	var	handerObj = $(Schhandler);
	var msg = config.msg;

	Messenger().options = {
	    extraClasses: 'messenger-fixed messenger-on-bottom',
	    theme: 'flat'
	}

	var at = 0;

	function showErr(e,d){
		if(d == 1001){
			window.location = config.cgi.gotologin;
			return;
		}

		var obj = {
			'message' : msg[d]
		}
		if(parseInt(d)){
			obj.type = 'error'
		}

		Messenger().post(obj);
		// clearTimeout(at);

		// var alertDiv = $('<div class="alert alert-success alert-msg fade in"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><span></span></div>');


		// alertDiv.removeClass('alert-danger');
		// if(parseInt(d)){
		// 	alertDiv.addClass('alert-danger');
		// }
		// $('body').append(alertDiv);
		
		// alertDiv.find('span').html(msg[d]);
		// alertDiv.alert();
		// at = setTimeout(function(){
		// 	alertDiv.alert('close');
		// },2000);		
	}

	var handlers = {
		'msg:error' : showErr
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}	
});