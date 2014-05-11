define(['config','helper/request','cache','helper/util'],function(config,request,cache,util){

	var	handerObj = $(Schhandler);

	function convent(data){

		var o = {};
		o.id = data.user._id;
		o.nick = data.user.nick;
		o.pre = util.getNums(data.user.used/data.user.size)*100;

		if(!o.pre && !data.user.used){
			o.pre = 0;
		}
		if(o.pre > 0 && o.pre < 0.001){
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

	function init(e,d){

		var opt = {
			cgi : config.cgi.getinfo,
			data : {}
		}

		var success = function(d){
			if(d.err == 0){
				var obj = convent(d.result);
				handerObj.triggerHandler('cache:set',{key: 'myinfo',data: obj});
				handerObj.triggerHandler('nav:load',obj);
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);
	}

	var handlers = {
		'nav:init' : init,

	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}

	return handerObj;
});