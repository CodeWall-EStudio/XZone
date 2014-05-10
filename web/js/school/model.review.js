define(['config','helper/request','helper/util'],function(config,request,util){
	var	handerObj = $(Schhandler);

	function getFile(obj,callback){
		var opt = {
			cgi : config.cgi.filesearch,
			data : obj
		}
		var success = function(d){
			if(d.err == 0){
				if(typeof callback === 'function'){
					callback(d.result);
				}else{
					handerObj.triggerHandler('review:fileload',d.result);
				}
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);
	}

	function getMailFile(obj,callback){
		var opt = {
			cgi : config.cgi.msgsearch,
			data : obj
		}
		var success = function(d){
			if(d.err == 0){
				if(typeof callback === 'function'){
					callback(d.result);
				}else{
					handerObj.triggerHandler('review:fileload',d.result);
				}
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);		
	}

	function getCollFile(obj,callback){
		var opt = {
			cgi : config.cgi.favsearch,
			data : d
		}	

		var success = function(d){
			if(d.err == 0){
				if(typeof callback === 'function'){
					callback(d.result);
				}else{
					handerObj.triggerHandler('review:fileload',d.result);
				}
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);
	}

	return {
		getfile : getFile,
		getmailfile : getMailFile,
		getcollfile : getCollFile
	}
});