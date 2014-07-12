define(['config','helper/request','helper/util'],function(config,request,util){
	
	var	handerObj = $(Schhandler);

	function convent(data){
		var list = [];
		for(var i=0,l=data.length;i<l;i++){
			var item = data[i];
			list.push({
				id : item._id,
				name : item.name,
				fileid : item.fromFile.$id,
				fid : item.resource.$id,
				coll : item.coll,
				remark : item.remark,
				time : util.time(item.createTime),
				size : util.getSize(item.size),
				type : item.type
			})
		}
		return list;
	}

	function search(e,d){
		var opt = {
			cgi : config.cgi.favsearch,
			data : d
		}	
		var success = function(d){
			if(d.err == 0){
				handerObj.triggerHandler('coll:load',{
					list : convent(d.result.list),
					total : d.result.total,
					next : d.result.next
				});
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);			
	}

	var handlers = {
		'coll:serach' : search
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}	
});