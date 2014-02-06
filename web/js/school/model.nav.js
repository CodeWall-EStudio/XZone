define(['config','helper/request','cache'],function(config,request,cache){

	var	handerObj = $(Schhandler);

	function convent(data){
		var o = {};
		o.nick = data.nick;
		o.name = data.name;
		o.size = data.size;
		o.used = data.used;
		o.auth = data.auth;
		o.mailnum = data.mailnum;
		o.pre = data.pre;
		o.group = [];
		o.dep = [];
		o.prep = [];
		o.school = 0;
		for(var i =0,l=data.groups.length;i<l;i++){
			var item = data.groups[i];
			switch(item.type){
				case 0:
					o.school = 1;
					break;
				case 1:
					o.group.push(item);
					break;
				case 2:
					o.dep.push(item);
					break;
				case 3:
					o.prep.push(item);
					break;
			}

		}
		return o;
	}

	function init(){

		var opt = {
			cgi : config.cgi.info,
			data : {}
		}

		var success = function(d){
			if(d.err == 0){
				var obj = convent(d.result);
				handerObj.triggerHandler('cache:set',{key: 'myinfo',data: obj});
				handerObj.triggerHandler('nav:load',obj);
			}
		}
		request.get(opt,success);
	}

	var handlers = {
		'nav:init' : init
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}

	return handerObj;
});