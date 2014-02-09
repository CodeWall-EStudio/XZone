define(['config','helper/view','cache'],function(config,View,Cache){
	var	handerObj = $(Schhandler);

	function init(e,d){
		console.log(d);
	};

	var handlers = {
		'groupprep:init' : init
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}

});