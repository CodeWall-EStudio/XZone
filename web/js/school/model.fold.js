define(['config','helper/request','helper/util','cache'],function(config,request,util,Cache){

	var	handerObj = $(Schhandler);

	function convent(data){
		var list = [];
		for(var i=0,l=data.length;i<l;i++){
			var item = data[i];
			list.push({
				id : item._id,
				name : item.name,
				mark : item.mark,
				hasChild : item.hasChild,
				src : item.src || 0,
				nick : item.creator.nick,				
				time : util.time(item.createTime),
				open : item.isOpen || 0,
				read : item.isReadonly || 0
			})
		}
		return list;
	}

	function conventOne(data){

		var t = {};
		if(!data){
			return t;
		}
		t.idpath = data.idpath.split(',');
		if(data.parent){
			t.pid = data.parent._id;
			t.pname = data.parent.name;
		}else{
			t.pid = 0;
			t.pname = '';
		}
		if(data.top){
			t.tid = data.top._id;
			t.tname = data.top.name;
		}else{
			t.tid = 0;
			t.tname = '';
		}

		t.isOpen = data.isOpen || false;
		t.isReady = data.isReadonly || false;

		// if(t.pid == t.tid){
		// 	t.pid = 0;
		// }
		t.id = data._id;
		t.name = data.name;
		return t;
	}

	//新建文件夹
	function foldCreate(e,d){
		var opt = {
			cgi : config.cgi.foldcreate,
			data : d
		};
		var td = d;	
		var success = function(d){
			handerObj.triggerHandler('msg:error',d.err);
			if(d.err == 0){
				var list = convent([d.result.data]);
				handerObj.triggerHandler('fold:load',{list:list,pid:d.result.data.parent['$id']});	
			}else{
				
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

		var opt = {
			cgi : config.cgi.foldinfo,
			data : d
		}

		var success = function(d){
			if(d.err == 0){
				if(d.result.data){
				var data = conventOne(d.result.data);
				handerObj.triggerHandler('fold:oneinfo',data);
				}			
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}		
		request.get(opt,success);	
	}

	function foldGet(e,d){
		var data = d || {};
		var page = data.page || 0,
			gid = data.groupId || 0,
			order = data.order || {},
			fdid = data.folderId || 0,
			tplid = data.tplid,
			target = data.target || 0,
			root = data.root || 0;

		var obj = {
			folderId : fdid
		};

		if(gid){
			obj.groupId = gid;
		}

		var opt = {
			cgi : config.cgi.foldlist,
			data : obj
		}
		var success = function(d){
			if(d.err == 0){
				var list = convent(d.result.list);
				if(target){
					if(tplid){
						handerObj.triggerHandler('file:treeload',{list:list,target:target,tplid:tplid});
					}else{
						handerObj.triggerHandler('fold:treeload',{list:list,target:target,root:root});
					}
				}else{
					handerObj.triggerHandler('fold:load',{list:list,root:root});
				}
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);	
	}


	function editmark(e,d){

		var data = {
			folderId : d.folderId,
			mark : d.mark
		};
		if(d.groupId){
			data.groupId = d.groupId;
		}
		var target = d.target,
			mark = d.mark;
		var opt = {
			method : 'POST',
			cgi : config.cgi.foldmodify,
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
			handerObj.triggerHandler('msg:error',d.err);
			if(d.err == 0){
				handerObj.triggerHandler('fold:delsuc',{id: folderId});
			}else{
				
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
			handerObj.triggerHandler('msg:error',d.err);
			if(d.err == 0){
				handerObj.triggerHandler('fold:modifysuc',td);
			}else{
				
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