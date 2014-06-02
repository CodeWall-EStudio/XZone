define(['../school/config','../school/helper/request','../school/helper/util','../school/cache'],function(config,request,util,Cache){
	var handerObj = $(Schhandler);

	function convent(obj){
		var list = {};
		for(var i in obj){
			var item = obj[i];
			item.id = item._id;
			item.pre = Math.round(util.getNums(item.used/item.size)*100);
			if(item.size){
				item.size = util.getSize(item.size);
			}else{
				item.size = 0;
			}
			
			if(item.used){
				item.used = util.getSize(item.used);
			}else{
				item.used = 0;
			}

			item.osize = item.size;
			item.oused = item.used;	
			list[item.id] = item;
			//list.push(item);
		}
		return list;
	}

	function userSearch(e,d){
		var opt = {
			cgi : config.cgi.usersearch,
			data : d
		}

		var success = function(d){
			if(d.err == 0){
				var list = convent(d.result.list);
				var total = d.result.total;
				handerObj.triggerHandler('user:listload',{
					list : list,
					total : total
				});
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);			
	}

	function userModify(e,d){
		var opt = {
			cgi : config.cgi.usermodify,
			data : d
		}

		var success = function(data){
			if(data.err == 0){
				handerObj.triggerHandler('user:modifysuc',d);
				// var list = convent(d.result);
				// handerObj.triggerHandler('user:modifysuc',{
				// 	list : list,
				// 	total : total
				// });
			}
			handerObj.triggerHandler('msg:error',data.err);
		}
		request.post(opt,success);			
	}

	function folderStatus(e,d){
		var opt = {
			cgi : config.cgi.filestatus,
			data : {
				folderId : d.id
			}
		}	
		var sid = d.sid;
		var success = function(d){
			if(d.err == 0){
				d.result.osize = d.result.totalSize;
				d.result.size = util.getSize(d.result.totalSize);
				d.result.sid = sid;

				handerObj.triggerHandler('user:statusload',d.result);
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}

		request.get(opt,success);			
	}	

	//读组织树
	function loadUser(e,d){
		// var departments = Cache.get('departments');
		// if(departments){
		// 	handerObj.triggerHandler('user:depsload',{ list :departments});
		// 	return;
		// }
		var opt = {
			cgi : config.cgi.departments //userlist
		}		
		var success = function(data){
			console.log(data);
			if(data.err == 0){
				var d2k = {};
				for(var i in data.result.list){
					d2k[data.result.list[i]._id] = data.result.list[i];
				}
				handerObj.triggerHandler('cache:set',{key: 'departments',data: data.result.list,type:1});
				handerObj.triggerHandler('user:depsload',{ list :data.result.list,kl : d2k });
			}else{
				handerObj.triggerHandler('msg:error',data.err);
			}
		}
		request.get(opt,success);		
	}

	//读目录
	function getFolder(e,d){
		console.log(d);
		var opt = {
			cgi : config.cgi.foldlist,
			data : {
				folderId : d
			}
		}
		var success = function(data){
			handerObj.triggerHandler('user:foldload',data.result);
		}
		request.get(opt,success);
	}

	function createUser(e,d){
		var opt = {
			cgi : config.cgi.create,
			data : d
		}
		var success = function(data){
			if(data.err===0){
				var obj = data.result.data;
				obj.id = obj._id;
				handerObj.triggerHandler('user:createsuc',obj);
			}
			handerObj.triggerHandler('msg:error',data.err);
			console.log(data);
		}
		request.post(opt,success);
	}

	function resetPwd(e,d){
		var opt = {
			cgi : config.cgi.resetpwd,
			data : {
				userId : d
			}
		}
		var success = function(data){
			handerObj.triggerHandler('msg:error',data.err);
		}
		request.post(opt,success);		
	}

	function createOrg(e,d){
		var opt = {
			cgi : config.cgi.createorgan,
			data : d
		}
		var success = function(data){
			if(data.err===0){
				var obj = data.result.data;
				handerObj.triggerHandler('user:orgcreatesuc',obj);
			}
			handerObj.triggerHandler('msg:error',data.err);
			console.log(data);
		}
		request.post(opt,success);
	}

	var handlers = {
		'user:orgcreate' : createOrg,
		'user:resetpwd' : resetPwd,
		'user:create' : createUser,
		'user:search' : userSearch,
		'user:modify' : userModify,
		'user:folderstatus' : folderStatus,
		'user:getfolder' : getFolder,
		'user:deps' : loadUser
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}

});