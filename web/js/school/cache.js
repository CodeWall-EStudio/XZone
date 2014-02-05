define(['config'],function(config){

	var	handerObj = $(Schhandler);

	var myfile = {},
		myFold = {},
		groupFile = {},
		groupFold = {};

	function addUFile(e,d){

	}

	function addUFold(e,d){

	}

	function updateFile(e,d){
		var id = d.id;
	}

	function updateFold(e,d){

	}

	function addGFile(e,d){

	}

	function addGFold(e,d){

	}

	function updateGFile(e,d){

	}

	function updateGFold(e,d){

	}	

	var handlers = {
		'user:addfile' : addUFile,
		'user:addfold' : addUFold,
		'user:updatefile' : updateFile,
		'user:updatefold' : updateFold,
		'group:addfile' : addGFile,
		'group:addfold' : addGFold,
		'group:updatefile' : updateGFile,
		'group:updatefold' : updateGFold		
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}

});