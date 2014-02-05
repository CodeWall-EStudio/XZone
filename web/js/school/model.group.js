define(['config','helper/request','helper/util'],function(config,request,util){
	var	handerObj = $(Schhandler);

	function groupEdit(e,d){

	}	

	function board(e,d){

	}		

	function boardAdd(e,d){

	}	

	function groupInfo(e,d){
		var gid = d;

		var opt = {
			cgi : config.cgi.groupinfo,
			data : {
				groupId : gid
			}
		}
		var success = function(d){
			if(d.err == 0){
				handerObj.triggerHandler('group:infosuc',d.result.data);
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);	

	}

	var handlers = {
		'group:info' : groupInfo,
		'group:edit' : groupEdit,
		'group:board' : board,
		'group:boardadd' : boardAdd
	}	

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}	
});