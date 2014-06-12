define(['../school/config','cache','helper/view'],function(config,Cache,View){
	var	handerObj = $(Schhandler);
	var msg = config.msg;

	Messenger().options = {
	    extraClasses: 'messenger-fixed messenger-on-bottom',
	    theme: 'flat'
	}

	var at = 0;

	function showConfig(e,d){
		if(typeof d === 'undefined'){
			return;
		}
		var obj = {
			message : d.msg,
			actions : {
				sub : {
					label : d.act.sub.label,
					action : function(){
						d.act.sub.action();
						msg.hide();
					}
				},
				cancel : {
					label : d.act.cancel.label,
					action : function(){
						msg.hide();
					}					
				}
			}
		}
		var msg = Messenger().post(obj);
	}

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
		'msg:error' : showErr,
		'msg:config' : showConfig
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}	
});