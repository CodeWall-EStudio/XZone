define(['config','helper/request','helper/util'],function(config,request,util){
	var	handerObj = $(Schhandler);

	function convent(data){
		var list = [];
		for(var i=0,l=data.length;i<l;i++){
			var item = data[i];
			var td = {
				id : item._id,
				fid : item.resource._id,
				name : item.name,
				mark : item.mark,
				type : item.resource.type,
				size : util.getSize(item.resource.size),
				time : util.time(item.createTime),
				coll : item.isFav
			}
			list.push(td);
		}
		return list;
	}

	function searchFile(e,d){
		var opt = {
			cgi : config.cgi.filesearch,
			data : d
		}
		var success = function(d){
			if(d.err == 0){
				var list = convent(d.result.list);
				handerObj.triggerHandler('file:load',{
					list : list,
					total : d.result.total,
					next : d.result.next
				});
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);			
	}

	function coll(e,d){
		var id = d.fileId,
			target = d.target,
			gid = d.groupId;
		var obj = {
			fileId : id
		}
		if(gid){
			obj.groupId = gid;
		}
		var opt = {
			method : 'POST',
			cgi : config.cgi.favcreate,
			data : obj
		}			
		var success = function(d){
			handerObj.triggerHandler('msg:error',d.err);
			if(d.err == 0){
				var favid = [];
				for(var i in d.result.list){
					favid.push(d.result.list[i]._id);
				}
				handerObj.triggerHandler('fav:collsuc',{favid:favid,id:id,target:target,gid:gid});
			}else{
				
			}
		}
		request.post(opt,success);	
	}

	function unColl(e,d){
		var favid = d.favId,
			id = d.id,
			target = d.target,
			gid = d.groupId;
		var obj = {
			favId : favid
		}
		if(gid){
			obj.groupId = gid;
		}
		var opt = {
			method : 'POST',
			cgi : config.cgi.favdel,
			data : obj
		}			
		var success = function(d){
			handerObj.triggerHandler('msg:error',d.err);
			if(d.err == 0){
				handerObj.triggerHandler('fav:uncollsuc',{favId:favid,id:id,target:target,gid:gid});
			}else{
				
			}
		}
		request.post(opt,success);	
	}

	function editmark(e,d){

		var data = {
			fileId : d.folderId,
			mark : d.mark
		};
		if(d.groupId){
			data.groupId = d.groupId;
		}
		var target = d.target,
			mark = d.mark;
		var opt = {
			method : 'POST',
			cgi : config.cgi.filemodify,
			data : data
		}	

		var success = function(d){
			handerObj.triggerHandler('msg:error',d.err);
			if(d.err == 0){
				handerObj.triggerHandler('fold:marksuc',{id:d.id,target:target,gid:d.gid,mark:mark});
			}else{
				
			}
		}
		request.post(opt,success);	
	}

	function delFile(e,d){
		var fileId = [];
		for(var i in d){
			fileId.push(i);
		}
		var opt = {
			method : 'POST',
			cgi : config.cgi.filedel,
			data : {
				fileId : fileId
			}
		}
		var success = function(d){
			handerObj.triggerHandler('msg:error',d.err);
			if(d.err == 0){
				handerObj.triggerHandler('file:delsuc',{id: fileId});
			}else{
				
			}
		}
		request.post(opt,success);			
	}

	function fileModify(e,d){
		var opt = {
			method : 'POST',
			cgi : config.cgi.filemodify,
			data : d
		}
		var td = d;
		var success = function(d){
			handerObj.triggerHandler('msg:error',d.err);
			if(d.err == 0){
				handerObj.triggerHandler('file:modifysuc',td);
			}else{
				
			}
		}
		request.post(opt,success);		
	}

	function fileShare(e,d){
			var opt = {
				method : 'POST',
				cgi : config.cgi.fileshare,
				data : d
			};
		// }else{
		// 	var opt = {
		// 		method : 'POST',
		// 		cgi : config.cgi.fileshare,
		// 		data : {
		// 			fileId : d.fileId,
		// 			toUserId : d.toUserId
		// 		}
		// 	}
		// }
		var success = function(d){
			if(d.err == 0){
				handerObj.triggerHandler('msg:error',d.err);
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}	
		request.post(opt,success);		
	}

	function getUser(e,d){
		var opt = {
			cgi : config.cgi.userlist
		}
		var success = function(data){
			if(data.err == 0){
				var list = [];
				for(var i = 0,l=data.result.list.length;i<l;i++){

					var item = data.result.list[i];
					list.push({
						id : item._id,
						name : item.nick
					});
				}
				handerObj.triggerHandler('file:shareload',{ type : d.type,files: d.files, list :list});
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);
	}

	function fileMove(e,d){
		var fids = d.fileId;
		var opt = {
			cgi : config.cgi.filemove,
			data : d
		}	
		var success = function(d){
			if(d.err == 0){
				handerObj.triggerHandler('file:movesuc',{ids: fids});
				handerObj.triggerHandler('msg:error',d.err);
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}	
		request.post(opt,success);				
	}

	function fileCopy(e,d){
		var fids = d.fileId;
		var opt = {
			cgi : config.cgi.filemove,
			data : d
		}	
		var success = function(d){
			if(d.err == 0){
				//handerObj.triggerHandler('file:copysuc',fids);
				handerObj.triggerHandler('msg:error',d.err);
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}	
		request.post(opt,success);				
	}

	function recyRef(e,d){
		var ids = d.fileId;
		var opt = {
			cgi : config.cgi.recrev,
			data : d
		}	
		var success = function(d){
			if(d.err == 0){
				handerObj.triggerHandler('recy:recysuc',{ids:ids});
				handerObj.triggerHandler('msg:error',d.err);
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}	
		request.post(opt,success);	
	}

	function recyDel(e,d){
		var ids = d.fileId,
			size = d.size;
		var opt = {
			cgi : config.cgi.recdel,
			data : d
		}	
		var success = function(d){
			if(d.err == 0){
				handerObj.triggerHandler('recy:recysuc',{ids:ids,size:size});
				handerObj.triggerHandler('msg:error',d.err);
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}	
		request.post(opt,success);			
	}	

	var handlers = {
		'file:recyref' : recyRef,
		'file:recydel' : recyDel,
		//'file:get' : getFile,
		'file:copyto' : fileCopy,
		'file:moveto' : fileMove,
		'file:getuser' : getUser,
		'file:shareto' : fileShare,
		'file:modify' : fileModify,
		'file:delfiles' : delFile,
		'file:search' : searchFile,
		'file:coll' : coll,
		'file:uncoll' : unColl,
		'file:edit' : editmark
	}	

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}	
});