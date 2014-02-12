define(['config','helper/request','helper/util'],function(config,request,util){
	var	handerObj = $(Schhandler);

	function convent(data){
		var list = [];
		for(var i=0,l=data.length;i<l;i++){
			var item = data[i];
			list.push({
				id : item._id,
				fid : item.fid,
				name : item.name,
				mark : item.mark,
				size : item.size,
				type : item.type,
				time : util.time(item.createTime),
				coll : item.coll
			})
		}
		return list;
	}

	function search(e,d){
		var opt = {
			cgi : config.cgi.recsearch,
			data : d
		}	
		var success = function(d){
			if(d.err == 0){
				handerObj.triggerHandler('recy:load',{
					list : convent(d.result.list),
					next : d.result.next
				});
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}

		request.get(opt,success);			
	}

	var handlers = {
		'recy:serach' : search
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}	
});