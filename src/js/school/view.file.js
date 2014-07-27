define(['config','helper/view','cache','helper/util','model.file'],function(config,View,Cache,util,Model){
	var	handerObj = $(Schhandler);

	var nowGid = 0,
		action = 0,
		nowKey = '',
		nowGroup = null,
		isLoading = false;
		nowFd = 0,
		nowOrder  = ['createTime',-1],
		nowOds = '', //当前排序
		nowUid = 0,  //当前uin
		nowPrep = 0, //当前是否是备课
		rootFd = 0,  //根目录id
		depnum = -1,
		nowTotal = 0,
		nowUid = 0,
		nowGrade = 0,
		nowTag = 0,	
		nowPid = 0,	
		nowType = 0,
		nowSchool = 0,
		nowAuth = 0,
		nowOtype = 'list',
		inReview = false, //是否在预览中
		isMember = {},		
		fileList = {},
		nextPage = 0;

	var tmpTarget = $("#fileInfoList"),
		icoTarget = $("#fileIcoList"),
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
		fileList = {};
		action = 1;

		if(depnum < 0){
			var myInfo = Cache.get('myinfo');
			depnum = myInfo.dep.length;
			if(!depnum){
				$("#actDropDown .dep").hide();
			}else{
				$("#actDropDown .dep").show();
			}
		}

		if(d){
			nowGid = d.gid || 0;
			nowFd = d.fdid || 0;
			nowType = d.type || 0;
			if(d.order){
				nowOrder = d.order;
			}
			
			nowOds = '{'+nowOrder[0]+':'+nowOrder[1]+'}';
			nowUid = d.uid || 0;
			nowKey = d.key || '';
			nowPrep = d.prep || 0;
			nowGroup = d.info || null;
			nowSchool = d.school || 0;
			nowAuth = d.auth || 0;
			nowOtype = d.otype || nowOtype;
			//rootFd = d.rootfdid || 0;
		}

		tmpTarget.find('.file').remove();

		var tpl = 'file.table';
		if(nowPrep){
			tpl = 'prep.table.tit';
		}
		var obj = {
			order : nowOrder,
			gid : nowGid,
			fdid : nowFd,
			uid : nowUid,
			prep : nowPrep,
			auth : nowAuth,
			school : nowSchool			
		}
		if(nowGid){
			obj.ml = nowGroup.mlist;
		}
		// if(!nowFd && rootFd){
		// 	nowFd = rootFd;
		// }
		var view = new View({
			target : tabletitTarget,
			tplid : tpl,
			data : obj		
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
		data.type = nowType;
		if(nowUid){
			data.creatorId = nowUid;
		}
		if(nowAuth){
			data.status = 1;
		}

		if(nowGroup && nowGroup.isMember){
			$("#fileActZone .renamefile").show();
			$("#fileActZone .delfile").show();
			$("#fileActZone .movefile").show();
		}else if(nowGroup){
			$("#fileActZone .renamefile").hide();
			if(!nowSchool){
				$("#fileActZone .delfile").hide();
			}
			$("#fileActZone .movefile").hide();			
		}
		if(nowUid){
			data.creatorId = nowUid;
		}	
		if(!d.info || nowSchool){
			handerObj.triggerHandler('file:search',data);	
		}else if((d.info && d.info.isMember) || d.open){
			handerObj.triggerHandler('file:search',data);	
		}
	}

	function fileLoad(e,d){
		nowTotal = d.total;
		//nextPage = d.next;
		if($(".file").length < nowTotal){
			nextPage += 1;
		}else{
			nextPage = 0;
		}
		var pr = 0;
		if(nowPrep){
			pr = nowPrep;
		}

		for(var i = 0,l=d.list.length;i<l;i++){
			fileList[d.list[i].id] = d.list[i];
		}

		if(inReview){
			returnList();
		}

		var target = tmpTarget,
			tplid = 'file.user.list';

		if(nowOtype === 'ico'){
			target = icoTarget;
			tplid = 'file.ico';
		}
		var view = new View({
			target : target,
			tplid : tplid,
			data : {
				list : d.list,
				filetype : config.filetype,
				gid : nowGid,
				page : nextPage,
				fdid : nowFd,
				ginfo : nowGroup,
				down : config.cgi.filedown,
				pr : nowPrep,
				dep : depnum,
				ods : nowOds,
				key : nowKey,
				school : nowSchool,
				auth : nowAuth
			}
		});
		//console.log(nowSchool,nowAuth);

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
		
		//status 0 没审核 1 审核过
		var ods = {};
		ods[nowOrder[0]] = ods[nowOrder[1]];
		var obj = {
			keyword : nowKey,
			folderId : nowFd,
			page:nextPage,
			pageNum : config.pagenum,
			type : nowType,
			order : nowOds
		}
		if(nowGid){
			obj.groupId = nowGid;
		}
		if(nowUid){
			obj.creatorId = nowUid;
		}

		if(nowAuth){
			obj.status = 1;
		}
		console.log(obj);
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
			type : nowType,
			order : nowOds
		}
		if(nowGid){
			obj.groupId = nowGid;
		}
		if(nowUid){
			obj.creatorId = nowUid;
		}
		if(nowAuth){
			obj.status = 1;
		}		
		handerObj.triggerHandler('file:search',obj);				
	}

	function fileCheckSuc(e,d){
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
						if(!$.isEmptyObject(d.fl)){
							handerObj.triggerHandler('file:delfiles',d.fl);
						}
						if(!$.isEmptyObject(d.fd)){
							handerObj.triggerHandler('fold:delfolds',d.fd);
						}
					}
				}
			}
		});
		view.createPanel();		
	}

	function fileDel(e,d){
		if(d.cid.length){
			handerObj.triggerHandler('msg:error',40);
			return;
		}		
		if(!$.isEmptyObject(d.fd)){
			var fl = [];
			for(var i in d.fd){
				fl.push(i);
			}
			var obj = {
				folderId : fl,
				fd : d.fd,
				fl : d.fl
			}
			handerObj.triggerHandler('file:checkfold',obj);
		}else{
			console.log(d);
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
							if(!$.isEmptyObject(d.fl)){
								handerObj.triggerHandler('file:delfiles',d.fl);
							}
							if(!$.isEmptyObject(d.fd)){
								handerObj.triggerHandler('fold:delfolds',d.fd);
							}
						}
					}
				}
			});
			view.createPanel();
		}
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
		resetToolbar();
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
							var obj = {
								fileId : d.id,
								name : n
							};
							if(nowGid && nowGid != 0){
								obj.groupId = nowGid;
							}
						
							handerObj.triggerHandler('file:modify',obj);
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
		}else if(d.target == 'school'){
			var myinfo = Cache.get('myinfo');
			handerObj.triggerHandler('file:shareload',{ type : d.target,files: d.fl, list : myinfo[d.target].id});
		}else{
			var myinfo = Cache.get('myinfo');
			handerObj.triggerHandler('file:shareload',{ type : d.target,files: d.fl, list : myinfo[d.target]});
		}
		//handerObj.triggerHandler('file:share',{type:d.target,d.fl});
	}

	function getUList(id,list){
		for(var i = 0,l=list.length;i<l;i++){
			var item = list[i];
			if(item._id == id){
				return item;
			}
			if(item.children){
				var ret = getUList(id,item.children);
				if(ret){
					return ret;
				}
			}
		}
		return null;
	}

	//分享的用户列表
	function userList(list,target){
		var selected = target.find('.dep-click:checked').length;
		var view = new View({
			target : target,
			tplid : 'share.user.li',
			data : {
				list : list.children,
				ulist : list.users,
				selected : selected
			}			
		});
		view.appendPanel();
	}

	//添加
	function addShareUser(obj){
		//console.log(obj);
		if($('.shareUser'+obj._id).length==0){
			var view = new View({
				target : $('#shareToUser'),
				tplid : 'share.user.span',
				data : obj
			});
			view.appendPanel();
		}
	}
	//删除
	function delShareUser(obj){
		$('.shareUser'+obj._id).remove();
		$('.userClick'+obj._id).prop({
			'checked':false
		}).parents('ul.child').prevAll('.dep-click').prop({
			'checked':false
		});
	}

	function shareuserLoad(e,d){
		var selected = [];
		var view = new View({
			target : actTarget,
			tplid : 'share.user',	
			data : {
				list : d.list,
				fl : d.files
			},
			after : function(){
				$("#actWin").modal('show');
			},
			handlers : {
				'.del-share-user' : {
					'click' : function(){
						var t = $(this),
							id = t.attr('data-id');
						delShareUser({_id:id});
					}
				},
				'.user-click' : {
					'click' : function(){
						var t = $(this),
							id = t.val(),
							nick = t.attr('data-val');
						if(t.prop('checked')){
							addShareUser({
								_id : id,
								nick : nick
							});
						}else{
							delShareUser({_id:id});	
						}

					}
				},
				'.plus' : {
					'click' : function(){
						var target = $(this),
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
							var p = target.parent('li');
							userList(getUList(id,d.list),p);
						}						
					}
				},
				'.list-link' : {
					'click' : function(){
						var t = $(this),
							p = t.parent('li');
						p.find('input').click();
					}
				},
				'.dep-click' : {
					'click' : function(){
						var t = $(this),
							v = t.val(),
							p = t.parent('li');
						var check = t.prop('checked');
						p.find('ul input').prop({'checked':check});
						var list = getUList(v,d.list);
						if(list.users){
							var ul = list.users;
							for(var i=0,l=ul.length;i<l;i++){
								var item = ul[i];
								if(check){
									addShareUser(item);
								}else{
									delShareUser(item);
								}
							}
						}

					}
				},
				'.btn-share' : {
					'click' : function(){
						var fls = [];						
						var li = [];
						for(var i in d.files){
							fls.push(d.files[i].id);
						}
						actTarget.find('#shareToUser i').each(function(){
							li.push($(this).data('id'));
						});
						if(li.length===0){
							return;
						}
						var obj = {
							fileId : fls
						};
						obj.toUserId = li;
						handerObj.triggerHandler('file:shareto',obj);
					}
				}
			}			
		});
		view.createPanel();
	}

	function shareFoldLoad(e,d){
		$('#groupResult input[type=radio]:checked').removeAttr('data-load');
		var obj = {
			target : d.target,
			tplid : d.tplid,
			data : {
				list : d.list,
				gid : d.gid,
				root : d.root,
				ismember : true
			}
		};
		var myinfo = Cache.get('myinfo');
		if(myinfo.dep2key[d.gid]){
			obj.data.ismember = myinfo.dep2key[d.gid].isMember;
		}
		if(d.root){
			obj.handlers =  {
				'.list-link' : {
					'click' : function(e){
						var t = $(this);
						p = t.parent('li');
						p.find('input').click();
					}
				},
				'.plus' : {
					'click' : function(e){
						var t = $(this),
							id = t.attr('data-id'),
							load = t.attr('data-load'),
							gid = t.attr('data-gid');
						var p = t.parent('li');
						if(p.find('ul').length > 0){
							if(t.hasClass("minus")){
								t.removeClass('minus');
								p.find('ul').hide();
							}else{
								t.addClass('minus');
								p.find('ul').show();
							}
							return;
						}
						if(load){
							return;
						}
						t.addClass('minus').attr('data-load',1);
						var obj = {
							folderId : id,
							target : p,
							groupId : gid,
							tplid : 'share.fold.li',
							type : 1
						};
						handerObj.triggerHandler('fold:get',obj);
					}
				}
			}
		}
		var view = new View(obj);
		view.appendPanel();
	}

	function shareLoad(e,d){
		// if($.isEmptyObject(isMember)){
		// 	for(var i in d.list){
		// 		isMember[d.list[i].id] = d.list[i].isMember;
		// 	}
		// }
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

				//拉学校文件夹
				if(d.type === 'school'){
						var myinfo = Cache.get('myinfo');
						var school = myinfo.school;
						var obj = {
							target : $('#groupFoldResultUl'),
							tplid : 'share.fold.li',
							groupId : school.id,
							folderId : school.rootFolder.$id,
							type : 2,
							root : 1
						}
						$('#groupFoldResultUl').html('');
						handerObj.triggerHandler('fold:get',obj);					
				}

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
				});

				$('#groupResult .group-name').bind('click',function(){
					var t = $(this),
						p = t.parent('li');
						p.find('input').click();
				});

				$('#groupResult input[type=radio]').bind('click',function(){
					var t = $(this),
						v = t.val(),
						load = t.attr('data-load'),
						fdid = t.attr('data-fd');
					if(v && !load){
						t.attr('data-load',1);
						var obj = {
							target : $('#groupFoldResultUl'),
							tplid : 'share.fold.li',
							groupId : v,
							folderId : fdid,
							type : 1,
							root : 1
						}
						$('#groupFoldResultUl').html('');
						handerObj.triggerHandler('fold:get',obj);
					}
				});
			},
			handlers : {		
				'.btn-share' : {
					'click' : function(){
						var fls = [];						
						var li = [];
						for(var i in d.files){
							fls.push(d.files[i].id);
						}
						var gid = $('#groupResult input:checked').val();
						if(d.type == 'school'){
							info = Cache.get('myinfo');
							gid = info.school.id;
						}
						
						var fdid = $("#groupFoldResultUl input:checked").val();
						/*
						actTarget.find('input:checked').each(function(){
							li.push($(this).val());
						});
						*/
						var obj = {
							fileId : fls
						};
						if(fdid && fdid.length > 20){
							obj.toFolderId = [fdid];
						}
						// if(d.type == 'other'){
						// 	obj.toUserId = li;
						// }else{
							obj.toGroupId = [gid];
						//}
						//if(li.length===0){

						if(d.type == 'dep' && !obj.toFolderId){
							handerObj.triggerHandler('msg:error',60);
							return;
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
		actTarget.find('.btn-sub').attr('disabled',false);
	}

	function fileMove(e,d){

		var fold,
			info
			rootfd = 0;
		if(nowGid){
			fold = Cache.get('rootFolder'+nowGid);
			info = Cache.get('myinfo');
			rootfd = info.group2key[nowGid].rootFolder._id || info.group2key[nowGid].rootFolder.$id || info.group2key[nowGid].rootFolder.id;
		}else{
			fold = Cache.get('myfold');
			info = Cache.get('myinfo');
			rootfd = info.rootFolder.$id;
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
				fold : fold,
				root : rootfd
			},
			after : function(){
				$("#actWin").modal('show');
				actTarget.find('.plus').unbind().bind('click',function(e){
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
				});
			},
			handlers : {
				'.list-link' : {
					'click' : aLinkClick
				},
				'.btn-sub' : {
					'click' : function(e){
						var t = $(".act-fold-list a.selected");
						if(t.length){
							var id = t.attr('data-id');
							var obj = {
								fileId : ids,
								targetId : id								
							}
							if(nowGid){
								obj.groupId = nowGid;
							}

							handerObj.triggerHandler('file:moveto',obj);
						}
					}
				}
			}			
		});
		view.createPanel();
	};

	//复制文件
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
				actTarget.find('.plus').unbind().bind('click',function(e){
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
				});
			},
			handlers : {
				'.list-link' : {
					'click' : aLinkClick
				},
				'.btn-sub' : {
					'click' : function(e){
						var t = $(".act-fold-list a.selected");
						if(t.length){
							var gid = t.attr('data-gid'),
								id = t.attr('data-id');
							var obj = {
								fileId : ids,
								toGroupId : [gid]								
							}
							if(id){
								obj.toFolderId = [id];
							}
							handerObj.triggerHandler('file:shareto',obj);
						}
					}
				}
			}			
		});
		view.createPanel();		
	}	

	//复制媒体文件
	function copytoMy(e,d){
		var myInfo = Cache.get('myinfo');
		var obj = {
			fileId : d.fl,
			targetId : myInfo.rootFolder.id,
			savetomy : 1
		}
		handerObj.triggerHandler('file:savetomy',obj);
	}	

	//小组保存到个人
	function fileSave(e,d){
		var myInfo = Cache.get('myinfo');
		var obj = {
			fileId : [d],
			targetId : myInfo.rootFolder.id,
			savetomy : 1
		}
		handerObj.triggerHandler('file:savetomy',obj);
	}

	function fileSaveSuc(e,d){
		for(var i in d){
		$('.filesave'+d[i]).remove();
		}
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
				list : d.list,
				gid : target.find('i').attr('data-gid')
			},
			after : function(){
				target.find('.plus').unbind().bind('click',function(e){
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
								folderId : id,
								target : p,
								tplid : 1
							});
						}
					});
			},
			handlers : {
				'.list-link' : {
					'click' : aLinkClick
				}
			}
		});

		view.appendPanel();			
	}

	function recyRef(e,d){
		var obj = {
			fileId : d.id
		}
		if(nowGid){
			obj.groupId = nowGid;
		}
		handerObj.triggerHandler('file:recyref',obj);
	}

	function recyDel(e,d){
		var obj = {
			fileId : d.id,
			size : d.size
		}
		if(nowGid){
			obj.groupId = nowGid;
		}
		handerObj.triggerHandler('file:recydel',obj);
	}	

	function recySuc(e,d){

		var ids = d.ids,
			size = d.size;
		var as = 0;
		for(var i in size){
			as += size[i];
		}
		for(var i in ids){
			$('.recy'+ids[i]).remove();
		}
		var myInfo = Cache.get('myinfo');
		myInfo.oused = parseInt(myInfo.oused);
		myInfo.osize = parseInt(myInfo.osize);
		myInfo.oused -= as;
		if(myInfo.oused <= 0){
			myInfo.oused = 0;
			myInfo.pre = 0;
			myInfo.used = 0;
		}else{
			myInfo.pre = util.getNums(myInfo.oused/myInfo.osize)*100;
			myInfo.used = util.getSize(myInfo.oused);
		}

		if(!myInfo.pre && !myInfo.oused){
			myInfo.pre = 0;
		}
		if(myInfo.pre >= 0 && myInfo.pre < 0.01){
			myInfo.pre = 0.1;
		}
		handerObj.triggerHandler('cache:set',{key: 'myinfo',data: myInfo});
		var view = new View({
			target : $('#userInfoAside'),
			tplid : 'my.info',
			data : myInfo,
			handlers : {
				'a.layout' : {
					click : function(e){
						window.location = config.cgi.logout;
					}
				}
			}			
		});
		view.createPanel();		
	}	

	function uploadSuc(e,d){

		d.fid = d.resource._id;
		d.size = util.getSize(d.resource.size);
		d.time = util.time(d.createTime);

		var target = tmpTarget,
			act = 0;
		if(tmpTarget.find('.file').length > 0){
			target = tmpTarget.find('.file').eq(0);
			act = 1;
		}
		var pr = 0;
		if(nowPrep == 'group'){
			pr = 1;
		}
		d.nick = Cache.get('myinfo').nick;
		var view = new View({
			target : target,
			tplid : 'file.user.list',
			data : {
				list : [d],
				filetype : config.filetype,
				gid : nowGid,
				page : nextPage,
				fdid : nowFd,
				ginfo : nowGroup,
				down : config.cgi.filedown,
				school : nowSchool,
				ods : nowOds,
				key : nowKey,
				auth : nowAuth,
				dep : depnum,
				pr : pr
			}
		});

		if(act){
			view.beforePanel();		
		}else{
			view.appendPanel();				
		}
		
	}

	function sharesuc(e,d){
		//resetToolbar();
	}

	function moveSuc(e,d){
		var ids = d.ids;
		for(var i in ids){
			$('.file'+ids[i]).remove();
		}
		//resetToolbar();
	}

	function resetToolbar(){
		$("#fileActZone").addClass('hide');
		$(".tool-zone").removeClass('hide');
	}


	function editMark(e,d){
		if(nowGid){
			d.groupId = nowGid;
		}
		handerObj.triggerHandler('file:edit',d);
	}	

	//返回列表
	function returnList(e,d){
		//console.log(d);
		if(d){
			inReview = true;
			pageNext();
		}else{
			inReview = false;
			handerObj.triggerHandler('review:return',{
				list : fileList,
				total : nowTotal,
				page : nextPage
			});
		}
	}

	var handlers = {
		//'order:change' : orderChange,
		'file:sharefoldload' : shareFoldLoad,
		'recy:recysuc' : recySuc,	
		'recy:ref' : recyRef,
		'recy:del' : recyDel,
		'file:copytomy' : copytoMy,
		'file:save' : fileSave,	
		'file:savesuc' : fileSaveSuc,	
		'file:movesuc' : moveSuc,
		'file:treeload' : foldTree,
		'file:move' : fileMove,
		'file:copy' : fileCopy,
		'file:share' : fileShare,
		'file:shareload' : shareLoad,
		'file:shareuserload' : shareuserLoad,
		'file:modifysuc' : modifySuc,
		'file:viewedit' : fileEdit,
		'file:delsuc' : delSuc,
		'model:change' : modelChange,
		'search:start' : search,
		'file:del' : fileDel,
		'fild:checkSuc' : fileCheckSuc,
		'file:init' : fileInit,
		'file:load' : fileLoad,
		'file:tocoll' : toColl,
		'file:touncoll' : toUnColl,
		'fav:collsuc' : collSuc,
		'fav:uncollsuc' : uncollSUc,
		'file:marksuc' : marksuc,
		'page:next' : pageNext,
		'file:sharesuc' : sharesuc,
		'file:editmark' : editMark,
		'file:uploadsuc' : uploadSuc,
		'file:getlist' : returnList
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}
});