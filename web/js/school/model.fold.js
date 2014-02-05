define(['config','helper/request','helper/util'],function(config,request,util){

	var	handerObj = $(Schhandler);

	function convent(data){
		var list = [];
		for(var i=0,l=data.length;i<l;i++){
			var item = data[i];
			list.push({
				id : item._id,
				name : item.name,
				mark : item.mark,
				hasChild : item.haschild,
				time : util.time(item.createtime)
			})
		}
		return list;
	}

	function conventOne(data){
		var t = {};
		t.idpath = data.idpath.split(',');
		t.pid = data.pid;
		t.tid = data.tid;
		t.id = data._id;
		t.name = data.name;
		t.tname = data.tname;
		t.pname = data.pname;
		return t;
	}

	//新建文件夹
	function foldCreate(e,d){
		var opt = {
			cgi : config.cgi.foldcreate,
			data : d
		}	
		var success = function(d){
			if(d.err == 0){
				var list = convent([d.result.data]);
				handerObj.triggerHandler('fold:load',{list:list});	
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.post(opt,success);				
	}

	function foldSearch(e,d){
		
		var opt = {
			cgi : config.cgi.foldsearch,
			data : d
		}
		var success = function(d){
			if(d.err == 0){
				var list = convent(d.result.list);
				handerObj.triggerHandler('fold:load',{list:list});

			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);		
	}

	function foldOne(e,d){
		var fdid = d.fdid,
			gid = d.gid;

		var opt = {
			cgi : config.cgi.foldinfo,
			data : {
				fdid : fdid,
				gid : gid
			}
		}

		var success = function(d){
			if(d.err == 0){
				var data = conventOne(d.result.data);
				handerObj.triggerHandler('fold:oneinfo',data);			
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}		
		request.get(opt,success);	
	}

	function foldGet(e,d){
		var data = d || {};
		var page = data.page || 0,
			gid = data.gid || 0,
			order = data.order || {},
			fdid = data.fdid || 0;

		var opt = {
			cgi : config.cgi.foldlist,
			data : {
				gid : gid,
				fdid : fdid
			}
		}

		var success = function(d){
			if(d.err == 0){

				var list = convent(d.result.list);
				handerObj.triggerHandler('fold:load',{list:list});

			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);	
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
			cgi : config.cgi.foldmodify,
			data : data
		}	

		var success = function(d){
			if(d.err == 0){
				handerObj.triggerHandler('fold:marksuc',{id:d.id,target:target,gid:d.gid,mark:mark});
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.post(opt,success);	
	}

	function delFold(e,d){
		var folderId = [];
		for(var i in d){
			folderId.push(i);
		}	
		var opt = {
			method : 'POST',
			cgi : config.cgi.folddel,
			data : {
				folderId : folderId
			}
		}
		var success = function(d){
			if(d.err == 0){
				handerObj.triggerHandler('fold:delsuc',{id: folderId});
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.post(opt,success);						
	}

	function foldModify(e,d){
		var opt = {
			method : 'POST',
			cgi : config.cgi.foldmodify,
			data : d
		}
		var td = d;
		var success = function(d){
			if(d.err == 0){
				handerObj.triggerHandler('fold:modifysuc',td);
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.post(opt,success);		
	}

	var handlers = {
		//'file:get' : getFile,
		'fold:modify' : foldModify,
		'fold:delfolds' : delFold,
		'fold:one' : foldOne,
		'fold:new' : foldCreate,
		'fold:serach' : foldSearch,
		'fold:get' : foldGet,
		'fold:edit' : editmark
	}	

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}

});