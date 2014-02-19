define(['config','helper/view','cache','model.file'],function(config,View,Cache){
	var	handerObj = $(Schhandler);

	var nowGid = 0,
		action = 0,
		nowKey = '',
		nowFd = 0,
		nowOrder  = ['createTime',1],
		nowOds = '',
		nowUid = 0,
		nowPrep = 0, //当前是否是备课
		rootFd = 0,
		nowTotal = 0,
		nextPage = 0;

	var tmpTarget = $("#fileInfoList"),
		actTarget = $('#actWinZone'),
		actWin = $('#actWin'),
		tabletitTarget = $("#tableTit");

	function toColl(e,d){
		if(nowGid){
			d.groupId = nowGid;
		}
		handerObj.triggerHandler('file:coll',d);
	}

	function toUnColl(e,d){
		if(nowGid){
			d.groupId = nowGid;
		}		
		handerObj.triggerHandler('file:uncoll',d);
	}

	function collSuc(e,d){
		var id = d.id,
			favid = d.favid
			gid = d.gid,
			target = d.target;

		//console.log(d);
		for(var i = 0,l= id.length;i<l;i++){
			$('.fav'+id[i]).addClass('s').attr('cmd','uncoll').attr('data-favid',favid[i]);
			//target[i].removeClass('s').attr('cmd','coll').attr('data-favid',favid[i]);
		}
	}

	function uncollSUc(e,d){
		var id = d.id,
			gid = d.gid,
			target = d.target;

		for(var i = 0,l= id.length;i<l;i++){
			$('.fav'+id[i]).removeClass('s').attr('cmd','coll').attr('data-favid',0);
			$('.coll'+id[i]).remove();
			//target[i].removeClass('s').attr('cmd','coll').attr('data-favid',0);
		}
	}

	function marksuc(e,d){
		var target = d.target;
		target.parent('span').prev('span').text(d.mark);
	}

	function fileInit(e,d){
		nowTotal = 0;
		nextPage = 0;
		action = 1;

		if(d){
			nowGid = d.gid || 0;
			nowFd = d.fdid || 0;
			if(d.order){
				nowOrder = d.order;
			}
			nowOds = '{'+nowOrder[0]+':'+nowOrder[1]+'}';
			nowUid = d.uid || 0;
			nowKey = d.key || '';
			nowPrep = d.prep || 0;
			//rootFd = d.rootfdid || 0;
		}

		tmpTarget.html('');

		var tpl = 'file.table';
		if(nowPrep){
			tpl = 'prep.table.tit';
		}

		// if(!nowFd && rootFd){
		// 	nowFd = rootFd;
		// }
		var view = new View({
			target : tabletitTarget,
			tplid : tpl,
			data : {
				order : nowOrder,
				gid : nowGid,
				fdid : nowFd
			}			
		});
		view.createPanel();

		var data = {
			keyword : nowKey,
			page:nextPage,
			pageNum : config.pagenum,
			order : nowOds
		}

		if(nowGid){
			data.groupId = nowGid;
		}
		if(nowFd != 0){
			data.folderId = nowFd;
		// }else if(rootFd){
		// 	data.folderId = rootFd;
		}
		if(nowUid){
			data.uid = nowUid;
		}

		handerObj.triggerHandler('file:search',data);	
	}

	function fileLoad(e,d){
		nowTotal = d.total;
		//nextPage = d.next;
		if($(".file").length < nowTotal){
			nextPage = 1;
		}else{
			nextPage = 0;
		}

		var view = new View({
			target : tmpTarget,
			tplid : 'file.user.list',
			data : {
				list : d.list,
				filetype : config.filetype,
				gid : nowGid,
				down : config.cgi.filedown
			}
		});

		view.appendPanel();	

		var pview = new View({
			target : $('#pageZone'),
			tplid : 'page',
			data : {
				next : nextPage
			}
		});

		pview.createPanel();		
	}

	// function orderChange(e,d){
	// 	tmpTarget.find('.file').remove();
	// 	nowOrder = d.order;
	// 	nowKey = d.key;
	// 	nextPage = 0;
	// 	nowFd = 0;

	// 	var view = new View({
	// 		target : tabletitTarget,
	// 		tplid : 'file.table',
	// 		data : {
	// 			order : nowOrder,
	// 			gid : nowGid,
	// 			fdid : nowFd
	// 		}			
	// 	});

	// 	view.createPanel();

	// 	handerObj.triggerHandler('file:serach',{
	// 		gid:nowGid,
	// 		keyword : nowKey,
	// 		folderId : nowFd,
	// 		page:nextPage,
	// 		pageNum : config.pagenum,
	// 		order : nowOrder
	// 	});		
	// }

	function search(e,d){
		tmpTarget.find('.file').remove();
		nowKey = d.key;
		
		var ods = {};
		ods[nowOrder[0]] = ods[nowOrder[1]];
		var obj = {
			keyword : nowKey,
			folderId : nowFd,
			page:nextPage,
			pageNum : config.pagenum,
			order : nowOds
		}
		if(nowGid){
			obj.groupId = nowGid;
		}
		if(nowUid){
			data.uid = nowUid;
		}

		handerObj.triggerHandler('file:search',obj);			
	}

	function modelChange(e,d){
		if(d == 'file'){
			action = 1;
		}else{
			action = 0;
		}
	}

	function pageNext(e,d){
		//console.log(action,nextPage);
		if(!action || !nextPage){
			return;
		}

		var ods = {};
		ods[nowOrder[0]] = nowOrder[1];
		var obj = {
			keyword : nowKey,
			folderId : nowFd,
			page:nextPage,
			pageNum : config.pagenum,
			order : nowOds
		}
		if(nowGid){
			obj.groupId = nowGid;
		}
		if(nowUid){
			data.uid = nowUid;
		}

		handerObj.triggerHandler('file:search',obj);				
	}

	function fileDel(e,d){
		var view = new View({
			target : actTarget,
			tplid : 'del',
			data : d,
			after : function(){
				$("#actWin").modal('show');
			},
			handlers : {
				'.btn-del' : {
					'click' : function(){
						if(d.fl){
							handerObj.triggerHandler('file:delfiles',d.fl);
						}
						if(d.fd){
							handerObj.triggerHandler('fold:delfolds',d.fd);
						}
					}
				}
			}
		});
		view.createPanel();
	}

	function delSuc(e,d){
		var list = d.id;
		for(var i = 0,l=list.length;i<l;i++){
			$('.file'+list[i]).remove();
		}		
		if($('.file').length == 0){
			pageNext();
		}
		$('#tableTit input:checked').attr('checked',false);
	}

	function fileEdit(e,d){
		var view = new View({
			target : actTarget,
			tplid : 'modify',
			data : {
				type : 'file',
				name : d.name
			},
			after : function(){
				$("#actWin").modal('show');
			},
			handlers : {
				'.btn-modify' : {
					'click' : function(){
						var n = actTarget.find('.obj-name').val();
						if(n != ''){
							handerObj.triggerHandler('file:modify',{
								fileId : d.id,
								groupId : nowGid,
								name : n
							});
						}
					}
				}
			}
		});
		view.createPanel();		
	}

	function modifySuc(e,d){
		$('.fdname'+d.fileId).text(d.name);
	}

	function fileShare(e,d){
		if(d.target == 'other'){
			handerObj.triggerHandler('file:getuser',{ type : d.target,files: d.fl});
		}else{
			var myinfo = Cache.get('myinfo');
			handerObj.triggerHandler('file:shareload',{ type : d.target,files: d.fl, list : myinfo[d.target]});
		}
		//handerObj.triggerHandler('file:share',{type:d.target,d.fl});
	}

	function shareLoad(e,d){

		var selected = [];
		var view = new View({
			target : actTarget,
			tplid : 'share',
			data : {
				type : d.type,
				fl : d.files,
				list : d.list
			},
			after : function(){
				$("#actWin").modal('show');

				$('.act-search-input').focus(function(){
					var target = $(this),
						def = target.attr('data-def');
					if(target.val() == def){
						target.val('');
					}	
				}).blur(function(){
					var target = $(this),
						def = target.attr('data-def');
					if(target.val() == ''){
						target.val(def);
					}					
				}).keyup(function(){
					if(e.keyCode == 13){
						actTarget.find('.act-search-btn').click();
					}
				});

				$('.act-search-btn').click(function(){
					var target = actTarget.find('.act-search-input'),
						def = target.attr('data-def'),
						key = target.val();
					if(key != def){
						$('#searchResult li').removeClass('color');
						for(var i=0,l=d.list.length;i<l;i++){
							var item = d.list[i];
							if(item.name.indexOf(key) >=0 ){
								$('.tag'+item.id).addClass('color');
							}
						}
					}
				})
			},
			handlers : {		
				'.btn-share' : {
					'click' : function(){
// toUserId
// toGroupId,
// toFolderId						
						var li = [];
						actTarget.find('input:checked').each(function(){
							li.push($(this).val());
						});
						var obj = {
							fileId : d.files
						};
						if(d.type == 'other'){
							obj.toUserId = li;
						}else{
							obj.toGroupId = li;
						}

						handerObj.triggerHandler('file:shareto',obj);
					}
				}
			}
		});
		view.createPanel();		
	}

	function aLinkClick(e){
		var t = $(e.target);
		$(".act-fold-list a").removeClass('selected');
		if(t.hasClass('list-link')){
			if(t.hasClass("selected")){
				t.removeClass('selected');
			}else{
				t.addClass('selected');
			}
		}		
	}

	function fileMove(e,d){

		var fold;
		if(nowGid){
			fold = Cache.get('rootFolder'+nowGid);
		}else{
			fold = Cache.get('myfold');
		}

		if(!fold){
			fold = [];
		}
		var fileid = [];
		var ids = [];
		for(var i in d.fl){
			fileid.push(d.fl[i].fid);
			ids.push(d.fl[i].id);
		}
		var view = new View({
			target : actTarget,
			tplid : 'movefile',
			data : {
				fl : d.fl,
				fold : fold
			},
			after : function(){
				$("#actWin").modal('show');
			},
			handlers : {
				'.list-link' : {
					'click' : aLinkClick
				},
				'.plus' : {
					'click' : function(e){
						var target = $(e.target),
							id = target.attr('data-id');

						var p = target.parent('li');
						if(p.find('ul').length > 0){
							var ul = p.find('ul')[0];
							if(target.hasClass("minus")){
								target.removeClass('minus');
								p.find('ul').hide();
							}else{
								target.addClass('minus');
								p.find('ul').show();
							}
							return;
						}else{	
							target.addClass('minus');						
							handerObj.triggerHandler('fold:get',{
								groupId : nowGid,
								folderId : id,
								target : p,
								tplid : 1
							});
						}
					}
				},
				'.btn-sub' : {
					'click' : function(e){
						var t = $(".act-fold-list a.selected");
						if(t.length){
							var id = t.attr('data-id');
							handerObj.triggerHandler('file:moveto',{
								fileId : ids,
								groupId : nowGid,
								targetId : id
							});
						}
					}
				}
			}			
		});
		view.createPanel();
	};

	function fileCopy(e,d){
		var myinfo = Cache.get('myinfo');
		var prep = myinfo['prep'];
		if(!prep){
			prep = [];
		}

		var fileid = [];
		var ids = [];
		for(var i in d.fl){
			fileid.push(d.fl[i].fid);
			ids.push(d.fl[i].id);
		}
		var gid = 0;
		var view = new View({
			target : actTarget,
			tplid : 'copyfile',
			data : {
				fl : d.fl,
				prep : prep
			},
			after : function(){
				$("#actWin").modal('show');
			},
			handlers : {
				'.list-link' : {
					'click' : aLinkClick
				},
				'.plus' : {
					'click' : function(e){
						var target = $(e.target),
							id = target.attr('data-id');
						gid = target.attr('data-gid');

						var p = target.parent('li');
						if(p.find('ul').length > 0){
							if(target.hasClass("minus")){
								target.removeClass('minus');
								p.find('ul').hide();
							}else{
								target.addClass('minus');
								p.find('ul').show();
							}
							return;
						}else{							
							handerObj.triggerHandler('fold:get',{
								groupId : gid,
								folderId : id,
								target : p,
								tplid : 1
							});
						}
					}
				},
				'.btn-sub' : {
					'click' : function(e){
						var t = $(".act-fold-list a.selected");
						if(t.length){
							var id = t.attr('data-id');
							handerObj.triggerHandler('file:copyto',{
								fileId : ids,
								groupId : gid,
								targetId : id
							});
						}
					}
				}
			}			
		});
		view.createPanel();		
	}	

	function foldTree(e,d){
		target = d.target;
		if(!d.list.length){
			target.find('i').attr('class','');
		}else{
			target.find('i').addClass('minus');
		}
		var view = new View({
			target : target,
			tplid : 'copy.tree',
			data : {
				list : d.list
			},
			handlers : {
				'.list-link' : {
					'click' : aLinkClick
				},				
				'.plus' : {
					'click' : function(e){
						var target = $(e.target),
							id = target.attr('data-id');

						var p = target.parent('li');
						if(p.find('ul').length > 0){
							if(target.hasClass("minus")){
								target.removeClass('minus');
								p.find('ul').hide();
							}else{
								target.addClass('minus');
								p.find('ul').show();
							}
							return;
						}else{							
							handerObj.triggerHandler('fold:get',{
								gid : nowGid,
								fdid : id,
								target : p,
								tplid : 1
							});
						}
					}
				}
			}
		});

		view.appendPanel();			
	}

	function moveSuc(e,d){
		var ids = d.ids;
		for(var i in ids){
			$('.file'+ids[i]).remove();
		}
	}

	function recyRef(e,d){
		handerObj.triggerHandler('file:recyref',{
			fileId : d.id,
			groupId : nowGid
		});
	}

	function recyDel(e,d){
		handerObj.triggerHandler('file:recydel',{
			fileId : d.id,
			groupId : nowGid
		});
	}	

	function recySuc(e,d){
		var ids = d.ids;
		for(var i in ids){
			$('.recy'+ids[i]).remove();
		}
	}	

	function uploadSuc(e,d){

		d.fid = d.resource._id;
		var target = tmpTarget,
			act = 0;
		if(tmpTarget.find('.file').length > 0){
			target = tmpTarget.find('.file').eq(0);
			act = 1;
		}

		var view = new View({
			target : target,
			tplid : 'file.user.list',
			data : {
				list : [d],
				filetype : config.filetype,
				gid : nowGid,
				down : config.cgi.filedown
			}
		});
		if(act){
			view.beforePanel();		
		}else{
			view.appendPanel();				
		}
		
	}

	var handlers = {
		//'order:change' : orderChange,
		'recy:recysuc' : recySuc,	
		'recy:ref' : recyRef,
		'recy:del' : recyDel,		
		'file:movesuc' : moveSuc,
		'file:treeload' : foldTree,
		'file:move' : fileMove,
		'file:copy' : fileCopy,
		'file:share' : fileShare,
		'file:shareload' : shareLoad,
		'file:modifysuc' : modifySuc,
		'file:viewedit' : fileEdit,
		'file:delsuc' : delSuc,
		'model:change' : modelChange,
		'search:start' : search,
		'file:del' : fileDel,
		'file:init' : fileInit,
		'file:load' : fileLoad,
		'file:tocoll' : toColl,
		'file:touncoll' : toUnColl,
		'fav:collsuc' : collSuc,
		'fav:uncollsuc' : uncollSUc,
		'file:marksuc' : marksuc,
		'page:next' : pageNext,
		'file:uploadsuc' : uploadSuc
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}
});