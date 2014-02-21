define(['config','helper/view','model.fold'],function(config,View,model){
	var	handerObj = $(Schhandler);

	var nowGid = 0,
		action = 0, //当前页卡是否在活动状态
		nowGinfo = {},
		nowFdInfo = {},
		nowKey = '',
		nowFd = 0,
		rootFd = 0,
		nowPrep = 0, //当前是否是备课
		nowOrder  = ['createTime',-1],
		nowOds = '';
		nowUid = 0,
		nextPage = 0;

	var tmpTarget = $("#fileInfoList"),
		foldTarget = $('#foldList'),
		actTarget = $('#actWinZone'),
		actWin = $('#actWin'),	
		titTarget = $('#sectionTit');

	function crTit(obj){
		if($.isEmptyObject(obj)){
			obj = 0;
		}

		var tpl = 'file.tit';
		var data = {
			gid : nowGid,
			gname : nowGinfo.name || '',
			filetype : config.filetype,
			key : nowKey,
			fold : obj || 0
		};		
		if(nowPrep == 'my'){
			tpl = 'prep.tit';
		}else if(nowPrep == 'group'){
			return;
		}

		var view = new View({
			target : titTarget,
			tplid : tpl,
			data : data
		});

		view.createPanel();
	}

	/*
	需要拉根目录下的文件夹
	*/
	function makeTree(list,target){
		//foldTarget.html('');
		if(target == foldTarget){
			foldTarget.html('');
		};
		var view = new View({
			target : target,
			tplid : 'fold.tree',
			data : {
				list : list,
				gid : nowGid,
				order : nowOds
			},
			handlers : {
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
						}
						var obj = {
							folderId : id,
							target : p
						};
						if(nowGid){
							obj.folderId = nowGid;
						}
						handerObj.triggerHandler('fold:get',obj);
					}
				}
			}
		});
		view.appendPanel();			
	}

	function foldTree(e,d){
		makeTree(d.list,d.target);
		d.target.addClass('minus');
	}

	function marksuc(e,d){
		var target = d.target;
		if(target){
			target.parent('span').prev('span').text(d.mark);
		}
	}

	function foldInit(e,d){
		action = 1;

		foldTarget.hide().removeAttr('show');
		foldTarget.css('float','none').css('width','100%');

		// foldTarget.html('')
		tmpTarget.html('');
		nowFdInfo = {};
		if(d){
			nowGid = d.gid || 0;
			nowGinfo = d.info || {};
			nowFd = d.fdid || 0;
			nowKey = d.key || '';
			nowPrep = d.prep || 0;
			nowUid = d.uid || 0;
			rootFd = d.rootfdid || 0;
			if(d.order){
				nowOrder = d.order;
			}
			nowOds = '{'+nowOrder[0]+':'+nowOrder[1]+'}';
		}

		if(nowGinfo.rootFolder){
			nowFd = nowGinfo.rootFolder.id;
		}
		if(nowGid && !nowFd){
			$('#btnZone').hide();
		}else{
			$('#btnZone').show();
		}

		//没有fdid  是个人的.
		// if(!nowFd){
		// 	crTit();
		// 	var fid = nowFd;
		// 	if(nowGid){
		// 		fid = nowGinfo.rootFolder;
		// 	}
		// 	var data = {};
		// 	if(nowGid){
		// 		data.groupId = nowGid;
		// 	}
		// 	if(fid){
		// 		data.folderId = fid;
		// 	}else if(rootFd){
		// 		data.folderId = rootFd;
		// 	}
		// 	handerObj.triggerHandler('fold:one',data);		
		// //如果是备课		
		// }else if(nowPrep){
		//  	crTit();
		// }
		crTit();
		var data = {
			folderId : nowFd,
		};
		if(nowGid){
			data.groupId = nowGid;
		}
		handerObj.triggerHandler('fold:one',data);			

		var obj = {};
		if(nowFd){
			obj.folderId = nowFd;
		}else if(rootFd){
			obj.folderId = rootFd;
		}
		if(nowGid){
			obj.groupId = nowGid;
		}
		if(nowKey == ''){
			handerObj.triggerHandler('fold:get',obj);
		}else{
			obj.key = nowKey;
			handerObj.triggerHandler('foldsearch:start',obj);
		}
	}

	function foldOne(e,d){
		//console.log(d,nowFd);
		nowFdInfo = d;
		crTit(d);
	}

	function foldLoad(e,d){
		//个人的首页
		if(!nowGid){ // && !nowFd){
			if(!nowFd || nowFd == rootFd){
				makeTree(d.list,foldTarget);
				handerObj.triggerHandler('cache:set',{key: 'myfold',data:d.list});
			}
		}else if(nowGinfo.rootFolder){
			if(nowGinfo.rootFolder.id == nowFd){
				makeTree(d.list,foldTarget);
				handerObj.triggerHandler('cache:set',{key: 'rootFolder'+nowGid,data:d.list});
			}else{
				var obj = {
					groupId : nowGid,
					target : foldTarget
				}
				if(nowGinfo.rootFolder){
					obj.folderId = nowGinfo.rootFolder;
				}
				handerObj.triggerHandler('fold:get',obj);
			
			}
		}else{
			//console.log(1234);
		}

		var view = new View({
			target : tmpTarget,
			tplid : 'fold.user.list',
			data : {
				list : d.list,
				gid : nowGid
			}
		});

		view.beginPanel();		
	}

	// function orderChange(e,d){
	// 	tmpTarget.find('.fold').remove();
	// 	nowOrder = d.order;
	// 	nowKey = d.key;
	// 	nextPage = 0;
	// 	nowFd = 0;
	// 	handerObj.triggerHandler('fold:search',{
	// 		gid:nowGid,
	// 		keyword : nowKey,
	// 		folderId : nowFd,
	// 		page:nextPage,
	// 		pageNum : config.pagenum,
	// 		order : nowOrder
	// 	});	
	// }

	function search(e,d){
		tmpTarget.find('.fold').remove();
		nowKey = d.key;

		var data = {
			keyword : nowKey,
			page:nextPage,
			pageNum : config.pagenum,
			order : nowOds			
		}

		if(nowGid){
			data.groupId = nowGid;
		}
		if(nowFd){
			data.folderId = nowFd;
		}
		
		handerObj.triggerHandler('fold:serach',data);			
	}	

	function createFold(e,d){
		var data = {
			name : d.name
		}

		if(nowGid){
			data.groupId = nowGid;
		}
		if(nowFd){
			data.folderId = nowFd;
		}

		handerObj.triggerHandler('fold:new',data);
	}

	function delSuc(e,d){
		var list = d.id;
		for(var i = 0,l=list.length;i<l;i++){
			$('.fold'+list[i]).remove();
		}
	}

	function foldEdit(e,d){
		var view = new View({
			target : actTarget,
			tplid : 'modify',
			data : {
				type : 'fold',
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
								folderId : d.id,
								name : n
							};
							if(nowGid){
								obj.groupId = nowGid;
							}
							handerObj.triggerHandler('fold:modify',obj);
						}
					}
				}
			}
		});
		view.createPanel();			
	}

	function modifySuc(e,d){
		$('.fdname'+d.folderId).text(d.name);
	}

	var handlers = {
		'fold:treeload' : foldTree,
		'fold:modifysuc' : modifySuc,
		'fold:viewedit' : foldEdit,
		'fold:delsuc' : delSuc,
		'fold:create' : createFold,
		//'order:change' : orderChange,
		'foldsearch:start' : search,
		'fold:marksuc' : marksuc,
		'fold:init' : foldInit,
		'fold:load' : foldLoad,
		'fold:oneinfo' : foldOne
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}
});