define(['config','helper/request','helper/util'],function(config,request,util){
	var	handerObj = $(Schhandler);

	function convent(data){
		var list = [];
		for(var i = 0,l= data.length;i<l;i++){
			var item = data[i];
			var obj = {
				id : item._id,
				time : util.time(item.createTime),
				content : item.content
			};
			if(item.creator){
				obj.name = item.creator.nick;
			}
			list.push(obj);
		}
		return list;
	}

	function conventMembers(list){
		var ml = [];
		//console.log(list);
		for(var i in list){
			if(list[i] !== null){
				ml.push(list[i]._id);
			}
		}
		return ml;
	}

	function convent2Members(list){
		var ml = {};
		for(var i in list){
			if(list[i] !== null){
				list[i].id = list[i]._id;
				ml[list[i]._id] = list[i];
			}
		}
		return ml;
	}	

	function groupEdit(e,d){
		var opt = {
			cgi : config.cgi.groupmodify,
			data : d
		}	
		var success = function(d){
			if(d.err == 0){
				d.result.data.id = d.result.data._id;
				d.result.data.auth = 1;
				handerObj.triggerHandler('msg:error',d.err);
				handerObj.triggerHandler('group:modifySuc',d.result.data);
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.post(opt,success);	
	}	

	function board(e,d){
		var gid = d.groupId,
			type = d.type,
			keyword = d.keyword;
		var opt = {
			cgi : config.cgi.boardlist,
			data : d
		}	
		var success = function(d){
			if(d.err == 0){
				var list = convent(d.result.list);
				if(type){
					handerObj.triggerHandler('board:asidelistsuc',{list : list,type:type,next : d.result.next});
				}else{
					handerObj.triggerHandler('board:listsuc',{list : list,next : d.result.next,keyword:keyword});
				}
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);		
	}		

	function groupInfo(e,d){
		var deftype = 'group';
		var gid,type = 0,
			recy = false,
			school = 0;
		if(typeof d == 'object'){
			gid = d.gid;
			type = d.type;
			recy = d.recy;
		}else{
			gid = d;
			type = deftype;
		}
		

		var opt = {
			cgi : config.cgi.groupinfo,
			data : {
				groupId : gid
			}
		}
		var success = function(d){
			if(d.err == 0){
				d.result.data.recy = recy;
				d.result.data.id = d.result.data._id;
				d.result.data.ml = conventMembers(d.result.data.members);
				d.result.data.mlist = convent2Members(d.result.data.members);
				d.result.data.rootFolder.id = d.result.data.rootFolder.$id; 
				handerObj.triggerHandler(type+':infosuc',d.result.data);
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);	
	}

	function boardNew(e,d){
		var type = d.type;
		var opt = {
			cgi : config.cgi.boardcreate,
			data : d
		}
		var success = function(d){

			handerObj.triggerHandler('msg:error',d.err);
			if(d.err == 0){
				var data = convent([d.result.data]);
				//if(type){
					handerObj.triggerHandler('group:boardasideaddsuc',data);
				if(!type){
					handerObj.triggerHandler('group:boardaddsuc',data);
				}
				//handerObj.triggerHandler('group:infosuc',d.result.data);
			}else{
				//handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.post(opt,success);		
	}

	function boardDel(e,d){
		var target = d.target;
		var type = d.type;
		var opt = {
			cgi : config.cgi.boarddel,
			data : {
				boardId : d.boardId
			}
		}
		var id = d.boardId;
		var success = function(d){
			if(d.err == 0){
				handerObj.triggerHandler('group:boarddelsuc',{target:target,id:id});
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}	
		request.post(opt,success);			
	}

	var handlers = {
		'board:del' : boardDel,
		'board:new' : boardNew,
		'group:info' : groupInfo,
		'group:edit' : groupEdit,
		'group:board' : board
	}	

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}	
});