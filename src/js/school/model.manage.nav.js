define(['config','helper/request','cache'],function(config,request,Cache){

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

	function conventUid2key(data){
		var list = {};
		for(var i =0,l=data.length;i<l;i++){
			var item = data[i];
			item.id = item._id;
			list[item.id] = item;
		}
		handerObj.triggerHandler('cache:set',{key: 'alluser2key',data: list});
	}

	function conventGroup(data){
		data.id = data._id;
		return data;
	}

	function getDepUser(e,d){
		var departments = Cache.get('departments');
		if(departments){
			handerObj.triggerHandler('nav:userload',{ type : d.type,data:d.data,files: d.files, list :departments});
			return;
		}
		var opt = {
			cgi : config.cgi.departments //userlist
		}
		
		var success = function(data){
			if(data.err == 0){
				handerObj.triggerHandler('cache:set',{key: 'departments',data: data.result.list});
				handerObj.triggerHandler('nav:userload',{ type : d.type,data:d.data,list :data.result.list});
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);		
	}

	function getUser(e,d){
		var type = d.type,
			data = d.data
		var ul = Cache.get('alluser');
		if(ul){
			if(type != 'prep'){
				handerObj.triggerHandler('nav:userload',{list:ul,type:type,data:data});
			}else{
				handerObj.triggerHandler('groupprep:userload',{list:ul,type:type,data:data});
			}
			return;
		}

		var opt = {
			cgi : config.cgi.usearch,//userlist,
			data : {}
		}

		var success = function(d){
			if(d.err == 0){
				var obj = convent(d.result.list);
				conventUid2key(d.result.list);
				handerObj.triggerHandler('cache:set',{key: 'alluser',data: obj});
				if(type != 'prep'){
					handerObj.triggerHandler('nav:userload',{list:obj,type:type,data:data});
				}else{
					handerObj.triggerHandler('groupprep:userload');
				}
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
				d.result.data.auth = 1;
				d.result.data.rootFolder.id = d.result.data.rootFolder['$id'];
				var obj = conventGroup(d.result.data);
				handerObj.triggerHandler('nav:createsuc',{list:obj});
			}
			handerObj.triggerHandler('msg:error',d.err);
		}
		request.post(opt,success);			
	}

	function modifyGroup(e,d){
		var opt = {
			cgi : config.cgi.groupmodify,
			data : d
		}

		var success = function(d){
			if(d.err == 0){
				var obj = conventGroup(d.result.data);
				handerObj.triggerHandler('nav:modifysuc',obj);
			}
			handerObj.triggerHandler('msg:error',d.err);
		}

		request.post(opt,success);		
	}


	var handlers = {
		'nav:getuser' : getUser,
		'nav:getdep' : getDepUser,
		'manage.nav:new' : newGroup,
		'manage.nav:modify' : modifyGroup
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}

	return handerObj;
});	