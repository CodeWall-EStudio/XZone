define(['config','helper/request','helper/util','cache'],function(config,request,util,Cache){
	var	handerObj = $(Schhandler);

	function convent(data){
		var list = [];
			plist = [];
		for(var i = 0,l=data.length;i<l;i++){
			var item = data[i];
			item.id = item._id;
			if(item.list){
				var tl = [];
				for(var j =0,m=item.list.length;j<m;j++){
					var obj = item.list[j];
					obj.id = obj._id;
					obj.pid = item.id;
					tl.push(obj);
					plist.push(obj);
				}
				item.list = tl;
			}
			list[item.id] = item;
		}
		return {
			list : list,
			plist : plist
		};
	}

	function fetch(d,data){
		if(!d.pid && !d.grade && !d.tag){
			return d;
		}else{
			var list = [];
			if(d.pid){
				var tl = [];
				list = data[d.pid];
				if(!d.grade && !d.tag){
					data[d.pid].list = tl;
					return data;
				}else{
					
					for(var i=0,l=list.list.length;i<l;i++){
						var item = list.list[i];
						if(item.grade == d.grade || item.tag == d.tag){
							tl.push[item];
						}
					}
					data[d.pid].list = tl;
					return data;
				}
			}else{
				for(var x in data){
					var item = data[x];
					var tl = [];
					for(var i = 0,l=item.list.length;i<l;i++){
						var	obj = item.list[i];
						if(item.grade == d.grade || item.tag == d.tag){
							tl.push[item];
						}							
					}
					data[x].list = tl;
				}
				return data;
			}
		}
	}

	function prepGet(e,d){
		var list = Cache.get('preplist');
		if(list){
			//list = fetch(d,list);
			handerObj.triggerHandler('groupprep:loadsuc',list);
			return;
		}
		var opt = {
			cgi : config.cgi.mpreplist,
			data : {
				fetchChild: true
			}
		}	
		var success = function(d){
			if(d.err == 0){
				var list = convent(d.result.list);
				//var nlist = fetch(d,list);
				handerObj.triggerHandler('groupprep:loadsuc',list);
				handerObj.triggerHandler('cache:set',{key : 'preplist' ,data : list});
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);			
	}

	var handlers = {
		'groupprep:get' : prepGet
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}	
});