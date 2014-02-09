define(['config','helper/request','cache'],function(config,request,cache){

	var	handerObj = $(Schhandler);

	function convent(data){
		var list = [];
		for(var i =0,l=data.length;i<l;i++){
			var item = data[i];
			item.id = item._id;
			list.push(item);
		}
		return list;
	}

	function conventGroup(data){
		data.id = data.id;
		return data;
	}

	function getUser(e,d){
		var type = d.type,
			data = d.data;
		var ul = cache.get('alluser');
		if(ul){
			handerObj.triggerHandler('nav:userload',{list:obj,type:type,data:data});
			return;
		}

		var opt = {
			cgi : config.cgi.userlist,
			data : {}
		}

		var success = function(d){
			if(d.err == 0){
				var obj = convent(d.result.list);
				handerObj.triggerHandler('cache:set',{key: 'alluser',data: obj});
				handerObj.triggerHandler('nav:userload',{list:obj,type:type,data:data});
			}
		}
		request.get(opt,success);		
	}

	function newGroup(e,d){
		var opt = {
			cgi : config.cgi.groupcreate,
			data : d
		}

		var success = function(d){
			if(d.err == 0){
				var obj = conventGroup(d.result.data);
				handerObj.triggerHandler('nav:createsuc',{list:obj});
			}
		}
		request.get(opt,success);			
	}

	function modifyGroup(e,d){
		var opt = {
			cgi : config.cgi.groupmodify,
			data : d
		}

		var success = function(d){
			if(d.err == 0){
				var obj = conventGroup(d.result.data);
				handerObj.triggerHandler('nav:modifysuc',{list:obj});
			}
		}
		request.get(opt,success);		
	}


	var handlers = {
		'nav:getuser' : getUser,
		'manage.nav:new' : newGroup,
		'manage.nav:modify' : modifyGroup
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}

	return handerObj;
});	