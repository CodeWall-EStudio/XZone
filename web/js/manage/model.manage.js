define(['../school/config','../school/helper/request','../school/helper/util','../school/cache'],function(config,request,util,Cache){
	var handerObj = $(Schhandler);

	function getKey(key){
		var opt = {
			cgi : config.cgi.getstorge,
			data : {
				key : key
			}
		}

		var success = function(d){
			if(d.err==0){
				d = d.result.data;

				if(d){
					var v = JSON.parse(d.value);
					handerObj.triggerHandler('cache:set',{key: d.key ,data: v,type:1});
				}
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);
	}

	function setKey(e,d){
		var obj = {
			key : d.key,
			value : JSON.stringify(d.value)
		}
		var opt = {
			cgi : config.cgi.setstorge,
			data : obj
		}

		var success = function(data){
			if(data.err==0){
				handerObj.triggerHandler('cache:set',{key: d.key ,data: d.value,type:1});
				handerObj.triggerHandler('manage:setsuc',d);
			}else{
				handerObj.triggerHandler('msg:error',data.err);
			}
		}
		request.post(opt,success);		
	}

	var handlers = {
		'manage:setkey' : setKey
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}

	return {
		getKey : getKey
	}
});