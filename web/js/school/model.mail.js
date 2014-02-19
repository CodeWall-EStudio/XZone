define(['config','helper/request','helper/util'],function(config,request,util){

	var	handerObj = $(Schhandler);

	function convent(data){
		var list = [];
		for(var i=0,l=data.length;i<l;i++){
			var item = data[i];
			list.push({
				id : item._id,
				fname : item.fromUser.nick,
				fid : item.fid,
				name : item.fileName,
				content : item.content,
				time : util.time(item.createTime),
				save : item.save,
				fuid : item.fromUser._id,
				tuid : item.toUser._Id,
				type : item.resource.type,
				size : util.getSize(item.resource.size || 0)
			})
		}
		return list;
	}

	function search(e,d){
		var opt = {
			cgi : config.cgi.msgsearch,
			data : d
		}	
		var success = function(d){
			if(d.err == 0){
				handerObj.triggerHandler('mail:load',{
					list : convent(d.result.list),
					ul : d.result.ul,
					next : d.result.next,
					total : d.result.total
				});
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);			
	}

	var handlers = {
		'mail:search' : search
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}		
});

