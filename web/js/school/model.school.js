define(['config','helper/request','helper/util'],function(config,request,util){
	var	handerObj = $(Schhandler);

	function approw(e,d){

		var opt = {
			method : 'POST',
			cgi : config.cgi.mappfile,
			data : d
		}
		var td = d;
		var success = function(d){
			handerObj.triggerHandler('msg:error',d.err);
			if(d.err == 0){
				handerObj.triggerHandler('school:apvsuc',td);
			}
		}
		request.post(opt,success);
	}

	var handlers = {
		'school:approv' : approw
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}	
});