define(['../school/config','../school/helper/request','../school/helper/util','../school/cache'],function(config,request,util,Cache){
	var handerObj = $(Schhandler);

	function convent(d){
		var list = d.result.list;
		var prep = [];
		var school = 0;
		var pt = 0;
		var g2key = {};
		for(var i in list){
			list[i] = conventGroup(list[i]);

			g2key[list[i].id] = list[i];
		}

		return {
			list : list,
			g2key : g2key,
			total : d.result.total
		}		
	}

	function conventGroup(data){
		data.id = data._id;
		data.pre = util.getNums(data.used/data.size)*100;
		if(data.size){
			data.size = util.getSize(data.size);
		}else{
			data.size = 0;
		}
		if(data.used){
			data.used = util.getSize(data.used);
		}else{
			data.used = 0;
		}		
		data.stname = util.getStatus(data.status);
		data.osize = data.size;
		data.oused = data.used;
		//容错	
		if(!data.archivable){
			data.archivable = 0;
		}
		if(!data.memberCount){
			data.memberCount = 1;
		}
		if(!data.folderCount){
			data.folderCount = 1;
		}		
		return data;
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

	function conventMembers(list){
		var ml = [];
		for(var i in list){
			if(list[i]){
			ml.push(list[i]._id);
			}
		}
		return ml;
	}

	function convent2Members(list){
		var ml = {};
		for(var i in list){
			if(list[i]){
			list[i].id = list[i]._id;
			ml[list[i]._id] = list[i];
			}
		}
		return ml;
	}

	//拉小组列表
	function getList(e,d){
		var opt = {
			cgi : config.cgi.mlistgroup,
			data : d
		}		

		if(d.type == 3){
			var ret = Cache.get('preps');
			handerObj.triggerHandler('group:loaded',ret);
			return;
		}
		var success = function(d){
			if(d.err == 0){
				handerObj.triggerHandler('group:loaded',convent(d));
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}

		request.get(opt,success);
	}

	//创建小组
	function creatGroup(e,d){

		var opt = {
			cgi : config.cgi.groupcreate,
			data : d
		}

		var success = function(d){
			if(d.err == 0){
				var obj = conventGroup(d.result.data);
				var g2obj = {};
				g2obj[obj.id] = obj;
				handerObj.triggerHandler('group:createsuc',{list:[obj],g2key : g2obj});
			}
			handerObj.triggerHandler('msg:error',d.err);
		}
		request.post(opt,success);			
	}

	//读组织树
	function loadUser(e,d){
		var departments = Cache.get('departments');
		if(departments){
			handerObj.triggerHandler('group:userloaded',{ type : d.type, ml: d.ml,modify:d.modify, list :departments});
			return;
		}
		var opt = {
			cgi : config.cgi.departments //userlist
		}		
		var success = function(data){
			if(data.err == 0){
				handerObj.triggerHandler('cache:set',{key: 'departments',data: data.result.list,type:1});
				handerObj.triggerHandler('group:userloaded',{ type : d.type, ml: d.ml,modify:d.modify, list :data.result.list});
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);		
	}

	//读取单个小组资料
	function groupInfo(e,d){
		var opt = {
			cgi : config.cgi.groupinfo,
			data : {
				groupId : d
			}
		}
		var success = function(d){
			if(d.err == 0){
				d.result.data.id = d.result.data._id;
				d.result.data.mlist = conventMembers(d.result.data.members);
				d.result.data.members = convent2Members(d.result.data.members);
				handerObj.triggerHandler('group:groupinfosuc',d.result.data);
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);	
	}
	//修改群资料
	function groupModify(e,d){
		var opt = {
			cgi : config.cgi.groupmodify,
			data : d
		}	
		var success = function(d){
			if(d.err == 0){
				d.result.data.id = d.result.data._id;
				d.result.data.auth = 1;
				var data = conventGroup(d.result.data);
				handerObj.triggerHandler('msg:error',d.err);
				handerObj.triggerHandler('group:modifysuc',data);
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.post(opt,success);	
	}
	//审核
	function appRove(e,d){
		var opt = {
			cgi : config.cgi.mappgroup,
			data : d
		}
		var id = d.groupId;
		var type = d.validateStatus;
		var success = function(d){
			handerObj.triggerHandler('msg:error',d.err);
			if(d.err == 0){
				handerObj.triggerHandler('group:appsuc',{
					id : id,
					type : type
				});
			}else{

			}
		}
		request.post(opt,success);
	}	


	function loadPrep(){
		var opt = {
			cgi : config.cgi.mlistgroup,
			data : {
				type : 3,
				page : 0,
				pageNum : 1000
			}
		}		

		var success = function(d){
			if(d.err == 0){
				var ret = convent(d);
				handerObj.triggerHandler('cache:set',{key: 'preps',data: ret,type:1})
				handerObj.triggerHandler('manage:preploaded',ret);
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}

		request.get(opt,success);		
	}

	var handlers = {
		'group:list' : getList,
		'group:loaduser' : loadUser,
		'group:create' : creatGroup,
		'group:one' : groupInfo,
		'group:modify' : groupModify,
		'group:approve' : appRove,
		'group:loadprep' : loadPrep
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}
});