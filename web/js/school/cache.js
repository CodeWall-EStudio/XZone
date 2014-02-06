define(['config'],function(config){

	var	handerObj = $(Schhandler);

	var cache = {

	}

	function setCache(e,d){
		cache[d.key] = d.data;
		console.log(d.key,d.data);
	}

	function getCache(d){
		return cache[d];
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