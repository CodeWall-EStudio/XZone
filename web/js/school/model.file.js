define(['config','helper/request','helper/util'],function(config,request,util){
	var	handerObj = $(Schhandler);

	function convent(data){
		var list = [];
		for(var i=0,l=data.length;i<l;i++){
			var item = data[i];
			var td = {
				id : item._id,
				fid : item.fid,
				name : item.name,
				mark : item.mark,
				type : item.type,
				time : util.time(item.createtime),
				coll : item.coll
			}
			list.push(td);
		}
		return list;
	}

	// function getFile(e,d){
	// 	var data = d || {};
	// 	var page = data.page || 0,
	// 		gid = data.gid || 0,
	// 		order = data.order || {},
	// 		fdid = data.fdid || 0;

	// 	var opt = {
	// 		cgi : config.cgi.filelist,
	// 		data : {
	// 			page : page,
	// 			fdid : fdid
	// 		}
	// 	}

	// 	var success = function(d){
	// 		if(d.err == 0){
	// 			var list = convent(d.result.list);
	// 			handerObj.triggerHandler('file:load',{
	// 				list : list,
	// 				next : d.result.next
	// 			});
	// 		}else{
	// 			handerObj.triggerHandler('msg:error',d.err);
	// 		}
	// 	}
	// 	request.get(opt,success);			
	// }

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

	var handlers = {
		//'file:get' : getFile,
		'file:modify' : fileModify,
		'file:delfiles' : delFile,
		'file:serach' : searchFile,
		'file:coll' : coll,
		'file:uncoll' : unColl,
		'file:edit' : editmark
	}	

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}	
});