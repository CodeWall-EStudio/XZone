define(['config','helper/request','cache','helper/util'],function(config,request,cache,util){

	var	handerObj = $(Schhandler);

	function convent(data){

		var o = {};
		o.nick = data.user.nick;
		o.pre = Math.round(data.user.used/data.user.size*100)/100;
		if(!o.pre){
			o.pre = 0;
		}
		if(o.pre > 0 && o.pre < 0.001){
			o.pre = 0.001;
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
		for(var i =0,l=data.groups.length;i<l;i++){
			var item = data.groups[i];
			if(!item){
				continue;
			}
			item.id = item._id;
			if(item.rootFolder){
				item.rootFolder.id = item.rootFolder._id;
			}
			o.group2key[item.id] = item;
			item.pt = item.pt || 0;
			switch(item.type){
				case 0: //学校
					o.school = 1;
					break;
				case 1: //小组
					o.group.push(item);
					break;
				case 2: //部门
					o.dep.push(item);
					o.dep2key[item.id] = item;
					break;
				case 3: //备课
					o.prep.push(item);
					o.prep2key[item.id] = item;
					break;
			}

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