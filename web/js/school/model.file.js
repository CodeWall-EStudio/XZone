define(['config','helper/request','helper/util'],function(config,request,util){
	var	handerObj = $(Schhandler);

	function convent(data){
		var list = [];
		for(var i=0,l=data.length;i<l;i++){
			var item = data[i];
			var td = {
				id : item._id,
				fid : item.resource,
				name : item.name,
				mark : item.mark,
				type : item.type,
				size : util.getSize(item.size),
				time : util.time(item.createTime),
				coll : item.coll
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
					next : d.result.next
				});
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);			
	}

	function coll(e,d){
		var id = d.id,
			target = d.target,
			gid = d.gid;

		var opt = {
			method : 'POST',
			cgi : config.cgi.favcreate,
			data : {
				id : id,
				gid : gid
			}
		}			
		var success = function(d){
			if(d.err == 0){
				handerObj.triggerHandler('fav:collsuc',{id:id,target:target,gid:gid});
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.post(opt,success);	
	}

	function unColl(e,d){
		var id = d.id,
			target = d.target,
			gid = d.gid;

		var opt = {
			method : 'POST',
			cgi : config.cgi.favdel,
			data : {
				id : id,
				gid : gid
			}
		}			
		var success = function(d){
			if(d.err == 0){
				handerObj.triggerHandler('fav:uncollsuc',{id:id,target:target,gid:gid});
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.post(opt,success);	
	}

	function editmark(e,d){
		var data = {
			id : d.id,
			info : d.mark,
			gid : d.gid
		};
		var target = d.target,
			mark = d.mark;
		var opt = {
			method : 'POST',
			cgi : config.cgi.filemodify,
			data : data
		}	

		var success = function(d){
			if(d.err == 0){
				handerObj.triggerHandler('file:marksuc',{id:d.id,target:target,gid:d.gid,mark:mark});
			}else{
				handerObj.triggerHandler('msg:error',d.err);
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
			if(d.err == 0){
				handerObj.triggerHandler('file:delsuc',{id: fileId});
			}else{
				handerObj.triggerHandler('msg:error',d.err);
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
			if(d.err == 0){
				handerObj.triggerHandler('file:modifysuc',td);
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.post(opt,success);		
	}

	function fileShare(e,d){
		if(d.type == 'other'){
			var opt = {
				method : 'POST',
				cgi : config.cgi.msgcreate,
				data : {
					fileId : d.fileId
				}
			}
		}else{
			var opt = {
				method : 'POST',
				cgi : config.cgi.fileshare,
				data : {
					fileId : d.fileId
				}
			}
		}
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
					console.log(item);
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
		console.log(fids);
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
		var ids = d.fileId;
		var opt = {
			cgi : config.cgi.recdel,
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