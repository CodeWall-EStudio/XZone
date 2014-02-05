define(['config','helper/request'],function(config,request){

	var	handerObj = $(Schhandler);

	function init(){
		var opt = {
			cgi : config.cgi.myinfo,
			data : {}
		}

		var success = function(d){
			if(d.code == 0){
				handerObj.triggerHandler('nav:load',d.result);
			}
		}
		request.get(opt,success);
	}

	var handlers = {
		'nav:init' : init
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}

	return handerObj;
});