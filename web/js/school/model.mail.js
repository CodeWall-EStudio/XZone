define(['config','helper/request','helper/util'],function(config,request,util){

	var	handerObj = $(Schhandler);

	function convent(data){
		var list = [];
		for(var i=0,l=data.length;i<l;i++){
			var item = data[i];
			list.push({
				id : item._id,
				tname : item.toUser.nick,
				fname : item.fromUser.nick,
				fid : item.fid,
				name : item.name,
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

	function conventType(data){
		var list = [];
		for(var i=0,l=data.length;i<l;i++){
			var item = data[i];
			list.push({
				id: item._id,
				fid : item.resource._id,
				name : item.name,
				type : item.type,
				size : util.getSize(item.size || 0),
				time : util.time(item.createTime),
				gname : item.group.name,
				fname : item.folder,
				content : item.content
			});
		}
		return list;
	}

	function search(e,d){
		var cate = d.cate;
		if(d.cate == 0){
			d.cate = parseInt(1);
			var opt = {
				cgi : config.cgi.filequery,
				data : d
			}
		}else{
			var opt = {
				cgi : config.cgi.msgsearch,
				data : d
			}
		}	
		var success = function(d){
			if(d.err == 0){
				if(cate == 0){
					handerObj.triggerHandler('mail:load',{
						list : conventType(d.result.list),
						ul : d.result.ul,
						next : d.result.next,
						total : d.result.total
					});
				}else{
					handerObj.triggerHandler('mail:load',{
						list : convent(d.result.list),
						ul : d.result.ul,
						next : d.result.next,
						total : d.result.total
					});					
				}

			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);			
	}

	function save(e,d){
		var obj = {
			messageId : d
		}
		var opt = {
			cgi : config.cgi.filesave,
			data : obj
		}
		var success = function(d){
			handerObj.triggerHandler('msg:error',d.err);
			if(d.err == 0){
				handerObj.triggerHandler('mail:savesuc',obj.messageId);
			}else{
				
			}
		}
		request.post(opt,success);					
	}

	var handlers = {
		'mail:search' : search,
		'mail:save' : save
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}		
});

