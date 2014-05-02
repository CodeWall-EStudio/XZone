define(['../school/config','../school/helper/request','../school/helper/util','../school/cache'],function(config,request,util,Cache){
	var handerObj = $(Schhandler);


	function convent(data){

		var o = {};
		o.id = data.user._id;
		o.nick = data.user.nick;
		o.pre = util.getNums(data.user.used/data.user.size)*100;
		if(!o.pre && !data.user.used){
			o.pre = 0;
		}
		if(o.pre >= 0 && o.pre < 0.001){
			o.pre = 0.1;
		}

		o.name = data.user.name;
		if(data.user.size){
			o.size = util.getSize(data.user.size);
		}else{
			o.size = 0;
		}
		if(data.user.used){
			o.used = util.getSize(data.user.used);
		}else{
			o.used = 0;
		}
		o.oused = data.user.used;
		o.osize = data.user.size;
		o.auth = data.user.auth;
		o.mailnum = data.user.mailnum;
		o.group = [];
		o.dep = [];
		o.prep = [];
		o.school = 0;
		o.group2key = {};
		o.dep2key = {};
		o.prep2key = {};

		o.rootFolder = data.user.rootFolder;
		o.rootFolder.id = data.user.rootFolder['$id'];

		//学校
		if(data.school){
			o.school = data.school;
			o.school.id = o.school._id;
			o.school.auth = data.school.auth || 0;
			if(data.school.rootFolder){
				o.school.rootFolder.id = data.school.rootFolder.$id || 0;
			}
			o.group2key[o.school.id] = o.school;
		}else{
			o.school = false;
		}
		
		for(var i =0,l=data.departments.length;i<l;i++){
			var item = data.departments[i];
				item.id = item._id;
				item.pt = item.pt || 0;
				item.auth = item.auth || 0;
			if(item.rootFolder){
				item.rootFolder.id = item.rootFolder._id || item.rootFolder.$id;
			}				
			o.dep.push(item);
			o.dep2key[item.id] = item;
			o.group2key[item.id] = item;				
		}

		for(var i=0,l=data.prepares.length;i<l;i++){
			var item = data.prepares[i];
				item.id = item._id;
				item.pt = item.pt || 0;
			if(item.rootFolder){
				item.rootFolder.id = item.rootFolder._id || item.rootFolder.$id;
			}				
			item.isMember = true;	
			o.prep.push(item);
			o.prep2key[item.id] = item;
			o.group2key[item.id] = item;
		}

		for(var i =0,l=data.groups.length;i<l;i++){
			var item = data.groups[i];
			if(!item){
				continue;
			}
			item.id = item._id;
			item.pt = item.pt || 0;
			if(item.rootFolder){
				item.rootFolder.id = item.rootFolder._id || item.rootFolder.$id;
			}
			item.isMember = true;
			o.group2key[item.id] = item;
			item.pt = item.pt || 0;
			o.group.push(item);
			// switch(item.type){
			// 	case 0: //学校
			// 		o.school = item;
			// 		break;
			// 	case 1: //小组
					
			// 		break;
			// 	case 2: //部门
			// 		item.isMember = item.isMember || 1;
			// 		o.dep.push(item);
			// 		o.dep2key[item.id] = item;
			// 		break;
			// 	case 3: //备课
			// 		o.prep.push(item);
			// 		o.prep2key[item.id] = item;
			// 		break;
			// }

		}
		return o;
	}


	function convertSize(obj){
		var list = {};
		for(var i = 0,l=obj.length;i<l;i++){
			var item = obj[i];
			item.id = item._id;
			item.nsize = util.getSize(item.size);
			list[item.id] = item;
		}
		return list;
	}

	function convertSizeOne(obj){
		obj.id = obj._id;
		obj.nsize = util.getSize(obj.size);
		return obj;
	}	

	function getKey(key){
		var opt = {
			cgi : config.cgi.getstorge,
			data : {
				key : key
			}
		}

		var success = function(d){
			if(d.err==0){
				d = d.result.data;

				if(d){
					var v = JSON.parse(d.value);
					handerObj.triggerHandler('cache:set',{key: d.key ,data: v,type:1});
				}
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);
	}

	function setKey(e,d){
		var obj = {
			key : d.key,
			value : JSON.stringify(d.value)
		}
		var opt = {
			cgi : config.cgi.setstorge,
			data : obj
		}

		var success = function(data){
			if(data.err==0){
				handerObj.triggerHandler('cache:set',{key: d.key ,data: d.value,type:1});
				handerObj.triggerHandler('manage:setsuc',d);
			}else{
				handerObj.triggerHandler('msg:error',data.err);
			}
		}
		request.post(opt,success);		
	}

	//加载空间组
	function sGroup(e,d){
		var opt = {
			cgi : config.cgi.sgrouplist,
			data : {
				page : 0,
				pageNum : 0
			}
		}

		var success = function(data){
			if(data.err==0){
				list = convertSize(data.result.list);
				handerObj.triggerHandler('cache:set',{key: 'sizegroup' ,data: list,type:1});
				handerObj.triggerHandler('manage:slistload',{
					list : list
				});
			}else{
				handerObj.triggerHandler('msg:error',data.err);
			}
		}
		request.get(opt,success);	
	}

	//增加空间组
	function addSizeGroup(e,d){
		var opt = {
			cgi : config.cgi.addsgroup,
			data : d
		}

		var success = function(data){
			if(data.err==0){
				var list = Cache.get('sizegroup');
				var obj = convertSizeOne(data.result.data);
				//更新缓存
				list[obj.id] = obj;
				handerObj.triggerHandler('cache:set',{key: 'sizegroup' ,data: list,type:1});
				// handerObj.triggerHandler('cache:set',{key: 'sizegroup' ,data: list,type:1});
				handerObj.triggerHandler('manage:sizegroupadded', obj);
			}else{
				handerObj.triggerHandler('msg:error',data.err);
			}
		}
		request.post(opt,success);			
	}

	//修改空间组
	function modifySizeGroup(e,d){
		var opt = {
			cgi : config.cgi.modifysgroup,
			data : d
		}

		var success = function(data){
			if(data.err==0){
				var list = Cache.get('sizegroup');
				var obj = convertSizeOne(data.result.data);
				list[obj.id] = obj;
				//更新缓存
				//list.push(obj);
				handerObj.triggerHandler('cache:set',{key: 'sizegroup' ,data: list,type:1});
				// handerObj.triggerHandler('cache:set',{key: 'sizegroup' ,data: list,type:1});
				handerObj.triggerHandler('manage:sizegroupmodifyed', obj);
			}else{
				handerObj.triggerHandler('msg:error',data.err);
			}
		}
		request.post(opt,success);
	}

	//删除空间组
	function delSizeGroup(e,d){
		var opt = {
			cgi : config.cgi.delsgroup,
			data : d
		}

		var success = function(data){
			if(data.err==0){
				var list = Cache.get('sizegroup');
				delete list[d.sizegroupId];
				handerObj.triggerHandler('cache:set',{key: 'sizegroup' ,data: list,type:1});
				handerObj.triggerHandler('manage:sizegroupdeled', d.sizegroupId);
			}else{
				handerObj.triggerHandler('msg:error',data.err);
			}
		}
		request.post(opt,success);
	}		

	function Log(e,d){
		var opt = {
			cgi : config.cgi.logsearch,
			data : d
		}		
		var success = function(data){
			if(data.err==0){
				handerObj.triggerHandler('manage:logload', data.result);
			}else{
				handerObj.triggerHandler('msg:error',data.err);
			}
		}
		request.get(opt,success);		
	}

	function conventStatic(obj){
		obj.allsize = util.getSize(obj.totalSize);
		for(var i in obj.fileStatistics){
			obj.fileStatistics[i].nsize = util.getSize(obj.fileStatistics[i].size); 
		}
		return obj;
	}

	//汇总
	function allStatic(e,d){
		var opt = {
			cgi : config.cgi.mstatic,
			data : d
		}		
		var success = function(data){
			if(data.err==0){
				handerObj.triggerHandler('manage:staticload', conventStatic(data.result));
			}else{
				handerObj.triggerHandler('msg:error',data.err);
			}
		}
		request.get(opt,success);		
	}	

	function userLoad(e,d){

		var info = Cache.get('myinfo');
		if(info){
			handerObj.triggerHandler('manage:userLoaded',info);
		}

		var opt = {
			cgi : config.cgi.getinfo,
			data : {}
		}

		var success = function(d){
			if(d.err == 0){
				var obj = convent(d.result);
				handerObj.triggerHandler('cache:set',{key: 'myinfo',data: obj});
				handerObj.triggerHandler('manage:userLoaded',obj);
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);
	}

	var handlers = {
		'manage:setkey' : setKey,
		'manage:sgrouplist' : sGroup,
		'manage:addsgroup' : addSizeGroup,
		'manage:modifysgroup' : modifySizeGroup,
		'manage:delsgroup' : delSizeGroup,
		'manage:log' : Log,
		'manage:allstatic' : allStatic,
		'manage:userinfo' : userLoad
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}

	return {
		getKey : getKey
	}
});