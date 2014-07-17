define(['config','helper/request','helper/util','cache'],function(config,request,util,Cache){
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
			//console.log(item);
			//list.push(item);
		}
		return list;
	}

	function userSearch(e,d){
		var opt = {
			cgi : config.cgi.usersearch,
			data : d
		}

		if(d.nowOg){
			var nowOg = d.nowOg,
				kl = d.kl,
				rid = d.rid;
			delete d.kl;
			opt.data = d;
		}
		var success = function(d){
			if(d.err == 0){
				var list = convent(d.result.list);
				var total = d.result.total;
				if(nowOg){
					handerObj.triggerHandler('user:listload',{
						list : list,
						total : total,
						nowOg : nowOg,
						kl : kl,
						rid : rid
					});
				}else{
					handerObj.triggerHandler('user:listload',{
						list : list,
						total : total
					});
				}
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


	function conventOrg(d){
		var td = {};
		for(var i in d){
			var item = d[i];
			td[item._id] = d[i];
			if(item.children && item.children.length){
				var tk = conventOrg(item.children);
				$.extend(td,tk);
			}
		}
		return td;
	}
	//读组织树
	function loadUser(e,d){
		// var departments = Cache.get('departments');
		// if(departments){
		// 	handerObj.triggerHandler('user:depsload',{ list :departments});
		// 	return;
		// }
		var opt = {
			cgi : config.cgi.orglist //userlist
		};
		var success = function(data){
			if(data.err == 0){
				var d2k = conventOrg(data.result.data.children);
				handerObj.triggerHandler('cache:set',{key: 'departments',data: data.result.data.children,type:1});
				handerObj.triggerHandler('user:depsload',{ root:data.result.data._id, list :data.result.data.children,kl : d2k});
			}else{
				handerObj.triggerHandler('msg:error',data.err);
			}
		}
		request.get(opt,success);		
	}

	//读目录
	function getFolder(e,d){
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
		}
		request.post(opt,success);
	}

	function modifyOrg(e,d){
		var opt = {
			cgi : config.cgi.organmodify,
			data : d
		}
		var success = function(data){
			if(data.err===0){
				var obj = data.result.data;
				handerObj.triggerHandler('user:orgmodifysuc',obj);
			}
			handerObj.triggerHandler('msg:error',data.err);
		}
		request.post(opt,success);
	}

	function delOrg(e,d){
		var opt = {
			cgi : config.cgi.orgdelete,
			data : {
				organizationId : d
			}
		}
		var success = function(data){
			if(data.err===0){
				handerObj.triggerHandler('user:orgdelsuc',d);
			}
			handerObj.triggerHandler('msg:error',data.err);
		}
		request.post(opt,success);	
	}

	function orgUserAdd(e,d){
		var opt = {
			cgi : config.cgi.adduser,
			data : d
		};
		var success = function(data){
			if(data.err === 0){
				handerObj.triggerHandler('user:addusersuc',d);
			}
			handerObj.triggerHandler('msg:error',data.err);
		}
		request.post(opt,success);
	}

	function orgUserDel(e,d){
		var opt = {
			cgi : config.cgi.removeuser,
			data : d
		};
		var success = function(data){
			if(data.err === 0){
				handerObj.triggerHandler('user:delusersuc',d);
			}
			handerObj.triggerHandler('msg:error',data.err);			
		}
		request.post(opt,success);
	}	

	function depSearch(e,d){
		var key = d.key,
			list = d.list;
		var result = {};
		for(var i in list){
			var item = list[i];
			if(item.name.indexOf(key) >= 0){
				result[item._id] = item;
			}
		}
		handerObj.triggerHandler('user:depsearchreturn',result);
	}

	function getOne(e,d){
		var opt = {
			cgi : config.cgi.info,
			data : {
				userId : d
			}
		};
		var success = function(data){
			if(data.err === 0){
				handerObj.triggerHandler('user:oneload',data.result);
			}
			handerObj.triggerHandler('msg:error',data.err);			
		}
		request.get(opt,success);		
	}

	var handlers = {
		'user:getone' : getOne,
		'user:orgdel' : delOrg,
		'user:orgmodify' : modifyOrg,
		'user:orgcreate' : createOrg,
		'user:resetpwd' : resetPwd,
		'user:create' : createUser,
		'user:search' : userSearch,
		'user:modify' : userModify,
		'user:folderstatus' : folderStatus,
		'user:getfolder' : getFolder,
		'user:deps' : loadUser,
		'user:depsearch' : depSearch,
		'user:orguseradd' : orgUserAdd,
		'user:orguserdel' : orgUserDel		
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}

});