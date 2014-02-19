define(['config','helper/request','helper/util'],function(config,request,util){
	var handerObj = $(Schhandler);

	function convent(data){
		var o = {};
		o.nick = data.user.nick;
		o.name = data.user.name;
		o.size = data.user.size;
		o.used = data.user.used;
		o.auth = data.user.auth;
		o.id = data.user.id;
		return o;
	}

	function conventGroup(data){
		data.id = data._id;
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

	function allUser(e,d){
		var opt = {
			cgi : config.cgi.userlist,
			data : {}
		}

		var success = function(d){
			if(d.err == 0){
				conventUid2key(d.result.list);
				handerObj.triggerHandler('manage:alluserloadsuc');
			}
		}
		request.get(opt,success);		
	}

	function getUser(e,d){

		var opt = {
			cgi : config.cgi.getinfo,
			data : {}
		}

		var success = function(d){
			if(d.err == 0){
				var obj = convent(d.result);
				//handerObj.triggerHandler('cache:set',{key: 'myinfo',data: obj});
				handerObj.triggerHandler('manage:userloadsuc',obj);
			}
		}
		request.get(opt,success);
	}

	function creatGroup(e,d){

		var opt = {
			cgi : config.cgi.groupcreate,
			data : d
		}

		var success = function(d){
			if(d.err == 0){
				var obj = conventGroup(d.result.data);
				handerObj.triggerHandler('manage:createsuc',{list:obj});
			}
		}
		request.post(opt,success);			
	}

	function getGroup(e,d){
		var opt = {
			cgi : config.cgi.mlistgroup,
			data : {
				page : 0,
				pageNum : 100
			}
		}

		var success = function(d){
			if(d.err == 0){
				var list = d.result.list;
				var prep = [];
				for(var i in list){
					list[i] = conventGroup(list[i]);
					if(list[i].type == 3 && !list[i].parent){
						prep.push(list[i]);
					}
				}
				//handerObj.triggerHandler('cache:set',{key: 'myinfo',data: obj});
				handerObj.triggerHandler('manage:groupload',{
					list : list,
					prep : prep
				});
			}
		}
		request.get(opt,success);		
	}

	function appRove(e,d){
		var opt = {
			cgi : config.cgi.mappgroup,
			data : d
		}
		var id = d.groupId;
		var type = d.validateStatus;
		var success = function(d){
			if(d.err == 0){
				handerObj.triggerHandler('manage:appsuc',{
					id : id,
					type : type
				});
			}else{

			}
		}
		request.post(opt,success);
	}


	var handlers = {
		'manage:approve' : appRove,
		'manage:user' : getUser,
		'manage:alluser' : allUser,
		'manage:create' : creatGroup,
		'manage:grouplist' : getGroup
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}	 
});