define(['config'],function(config){

	var ls = window.localStorage,
		ss = window.sessionStorage;

	var	handerObj = $(Schhandler);

	var cache = {

	}

	function setCache(e,d){
		if(d.type){
			ls.setItem(d.key,JSON.stringify(d.data));
		}else{
			cache[d.key] = d.data;
		}
	}

	function getCache(d){
		if(cache[d]){
			return cache[d];
		}else{
			return JSON.parse(ls.getItem(d)) || false;	
		}
		
	}

	var handlers = {
		'cache:set' : setCache	
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}

	return {
		get : getCache
	}
});