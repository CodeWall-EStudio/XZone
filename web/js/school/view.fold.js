define(['config','helper/view','cache','model.fold'],function(config,View,Cache){
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
		nowGrade = 0,
		nowTag = 0,	
		nowPid = 0,	
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
			fold : obj || 0,
			fdid : nowFd
		};		

		if(nowPrep == 'my'){
			tpl = 'prep.tit';
		}else if(nowPrep == 'group'){
			tpl = 'prep.group.tit';
			console.log(1234);
			var userList = Cache.get('alluser2key');
			var plist = Cache.get('preplist');
			// list : plist,
			// ul : userList,
			// pid : nowPid,
			// tag : nowTag,
			// grade : nowGrade,
			// uid : nowUid		
			data.tlist = config.tag;
			data.glist = config.grade;
			data.list =  plist;
			data.ulist = userList;
			data.pid = nowPid;
			data.tag = nowTag;
			data.grade = nowGrade;
			data.uid = nowUid;
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
						}
						var obj = {
							folderId : id,
							target : p
						};
						if(nowGid){
							obj.folderId = nowGid;
						}
						handerObj.triggerHandler('fold:get',obj);
				});
			},
			data : {
				list : list,
				gid : nowGid,
				order : nowOds
			}
			// },
			// handlers : {
			// 	'.plus' : {
			// 		'click' : function(e){

			// 		}
			// 	}
			// }
		});
		view.appendPanel();			
	}

	function foldTree(e,d){
		if(d.root){
			handerObj.triggerHandler('cache:set',{key: 'rootFolder'+nowGid,data:d.list});
		}
		makeTree(d.list,d.target);
		d.target.addClass('minus');
		d.target.find('i:first').addClass('minus');
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


			//备课
			nowGrade = d.grade || 0;
			nowTag = d.tag || 0;
			nowUid = d.uid || 0;
			nowPid = d.pid || 0;						
		}

		if(nowGid && !nowFd){
			$('#btnZone').hide();
		}else{
			if(nowPrep == 'group'){
				$('#btnZone').hide();
			}else{
				$('#btnZone').show();
			}
		}

		//crTit();
		var data = {
			folderId : nowFd,
		};
		if(nowGid){
			data.groupId = nowGid;
		}
		handerObj.triggerHandler('fold:one',data);			

		var obj = {};
		obj.folderId = nowFd;
		// if(nowFd){
		// 	obj.folderId = nowFd;
		// }else if(rootFd){
		// 	obj.folderId = rootFd;
		// }
		if(nowGid){
			obj.groupId = nowGid;
		}

		if(nowFd != rootFd){
			var o1 = {
				folderId : rootFd
				//o1.groupId = nowGid;
			}			
			o1.root = 1;
			if(!nowGid){
				handerObj.triggerHandler('fold:get',o1);
			};
		}

		if(nowKey == ''){
			handerObj.triggerHandler('fold:get',obj);
		}else{
			obj.key = nowKey;
			handerObj.triggerHandler('foldsearch:start',obj);
		}
	}

	function foldOne(e,d){
		nowFdInfo = d;
		crTit(d);
	}

	function foldLoad(e,d){
		//个人的首页
		if(!nowGid){ // && !nowFd){

			if(!nowFd || nowFd == rootFd || d.root){
                if(d.pid == rootFd){
                	var fl = Cache.get('myfold');
                	fl.push(d.list[0]);
                	makeTree(fl,foldTarget);
					handerObj.triggerHandler('cache:set',{key: 'myfold',data:fl});                	
                }else{
					makeTree(d.list,foldTarget);
					handerObj.triggerHandler('cache:set',{key: 'myfold',data:d.list});
				}
			}
		}else if(nowGinfo.rootFolder){
			if(nowGinfo.rootFolder.id == nowFd){
				if(d.pid == rootFd){
                	var fl = Cache.get('rootFolder'+nowGid);
                	fl.push(d.list[0]);
                	makeTree(fl,foldTarget);
					handerObj.triggerHandler('cache:set',{key: 'rootFolder'+nowGid,data:fl});
				}else{
					makeTree(d.list,foldTarget);
					handerObj.triggerHandler('cache:set',{key: 'rootFolder'+nowGid,data:d.list});
				}
			}else{
				var obj = {
					groupId : nowGid,
					target : foldTarget,
					root: 1
				}
				if(nowGinfo.rootFolder){
					obj.folderId = nowGinfo.rootFolder.id;
				}
				handerObj.triggerHandler('fold:get',obj);
			}
		}else{
		}

		if(d.root){
			return;
		}

		var pr = 0;
		if(nowPrep == 'group'){
			pr = 1;
		}

		var view = new View({
			target : tmpTarget,
			tplid : 'fold.user.list',
			data : {
				list : d.list,
				gid : nowGid,
				pr : pr,
				prep : nowPrep,
				grade : nowGrade,
				tag : nowTag,
				uid : nowUid
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

	//新建文件夹
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

	function editMark(e,d){
		if(nowGid){
			d.groupId = nowGid;
		}
		handerObj.triggerHandler('fold:edit',d);
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
		'fold:editmark' : editMark,
		'fold:oneinfo' : foldOne
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}
});