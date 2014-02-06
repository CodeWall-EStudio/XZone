define(['config','cache','model.group'],function(config,Cache){
	var	handerObj = $(Schhandler);

	var nowGid = 0,
		nowFd = 0;

	function init(e,d){
		nowGid = d.gid;
		nowFd = d.fdid || 0;
		handerObj.triggerHandler('group:info',nowGid);
	}

	function info(e,d){
		var data = {
			gid : nowGid,
			fdid : nowFd,
			info : d
		}
        handerObj.triggerHandler('file:init',data);
        handerObj.triggerHandler('fold:init',data); 
	}

	var handlers = {
		'group:init' : init,
		'group:infosuc' : info
	}	

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}
});