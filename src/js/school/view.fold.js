define(['config','helper/view','cache','model.fold'],function(config,View,Cache){
	var	handerObj = $(Schhandler);

	var nowGid = 0,
		uid = 0,
		action = 0, //当前页卡是否在活动状态
		nowGinfo = {},
		nowData = {},
		nowFdInfo = {},
		nowKey = '',
		nowFd = 0,
		nowSchool = 0,
		nowAuth = 0,
		rootFd = 0,
		nowPrep = 0, //当前是否是备课
		nowOrder  = ['createTime',-1],
		nowOds = '';
		nowUid = 0,
		nowType = 0,
		nowGrade = 0,
		nowOtype = 'list',
		nowTag = 0,	
		nowPid = 0,	
		isOpen = 0,
		isRead = 0,
		isLoad = false,
		treeLoad = false,
		nextPage = 0;

	var tmpTarget = $("#fileInfoList"),
		icoTarget = $('#fileIcoList'),
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
			school : nowSchool,
			filetype : config.filetype,
			otype : nowOtype,
			root : rootFd,
			type : nowType,
			key : nowKey,
			fold : obj || 0,
			fdid : nowFd			
		}
		if(nowGid){
			data.ml = nowGinfo.mlist;
		}
	
		if(nowPrep == 'my'){
			tpl = 'prep.tit';
			data.pr = nowPrep;
		}else if(nowPrep == 'group'){
			tpl = 'prep.group.tit';
			var userList = Cache.get('alluser2key');
			var plist = Cache.get('preplist');
			// list : plist,
			// ul : userList,
			// pid : nowPid,
			// tag : nowTag,
			// grade : nowGrade,
			// uid : nowUid		
			data.pr = nowPrep;
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
			data : data,
			handlers : {
				'.dr-menu' : {
					'mouseenter' : function(e){
						var t = $(this);
							target = t.attr('data-target'),
							id = t.attr('data-id'),
							mt = $('#'+target);
						//console.log(12345);
						//mt.attr('loading');
						//if(!mt.attr('data-loaded')){
							var obj = {
								folderId : id,
								target : mt,
								type : 'fold'
							}
							if(nowGid){
								obj.groupId = nowGid;
							}
							if(nowUid){
								obj.creatorId = nowUid;
							}							
							if(mt.attr('loading')){
								$('.tit-menu').hide();
								mt.show();
								//mt.dropdown('toggle');
							}else{
								handerObj.triggerHandler('fold:get',obj);
							}
						//}
					}
				}
			}		
		});
		view.createPanel();
	}

	/*
	需要拉根目录下的文件夹
	*/
	function makeTree(list,target,id,tree){//列表.目标,当前文件夹id,是否是从树中点击过来的.
		if(target == foldTarget){
			foldTarget.html('');
		};

		var handlers = {};
		if(!treeLoad){
			treeLoad = true;
			handlers = {
				'.plus' : {
					'click' : function(){
						//console.log(123);
						var target = $(this),
							load = target.attr('data-load'),
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
						if(load){
							return;
						}
						target.attr('data-load',1);
						var obj = {
							folderId : id,
							target : p
						};
						if(nowGid){
							obj.groupId = nowGid;
						}
						handerObj.triggerHandler('fold:get',obj);							
					}
				}
			}
		}

		var view = new View({
			target : target,
			tplid : 'fold.tree',
			before : function(){
				$('#foldList li').removeClass('selected');
			},
			after : function(){
				// if(!$("#foldList").attr('show')){
				// 	$('#foldTree').click();
				// }
				$('#foldtree'+nowFd).attr('data-load',1).addClass('minus');
				$('#foldtreeli'+nowFd).addClass('selected').find('ul').show();
				// if(!tree){
				// 	var path = list[0].idpath;
				// 	path = path.split(',');
				// 	for(var i in path){
				// 		if(!$("#foldtree"+path[i]).hasClass('.minus') && !$("#foldtree"+path[i]).attr('data-load')){
				// 		}
				// 	}
				// }
			},
			data : {
				list : list,
				gid : nowGid,
				fdid : id,
				order : nowOds,
				school : nowSchool
			},
			handlers : handlers
		});
		view.appendPanel();			
	}

	function titLoad(e,d){
		var data = {
			gid : nowGid,
			gname : nowGinfo.name || '',
			school : nowSchool,
			filetype : config.filetype,
			type : nowType,
			key : nowKey,
			fdid : nowFd,
			list : d.list
		};	
		var view = new View({
			target : d.target,
			tplid : 'file.tit.list',
			data : data,
			after : function(){
				//d.target.dropdown('toggle');
				$('.tit-menu').hide();
				d.target.show();
				if(d.list.length>0){
					d.target.removeClass('hide');
				}
				d.target.attr('loading',1);
			}
		});	
		view.createPanel();
	}

	function foldTree(e,d){
		if(d.root){
			handerObj.triggerHandler('cache:set',{key: 'rootFolder'+nowGid,data:d.list});
		}
		makeTree(d.list,d.target,nowFd,true);
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
		nowData = d;
		if(!uid){
			uid = Cache.get('myinfo').id;
		}

		// foldTarget.html('')
		tmpTarget.html('');
		$("#fileIcoList").html('');
		nowFdInfo = {};
		if(d){
			nowGid = d.gid || 0;
			nowGinfo = d.info || {};
			nowFd = d.fdid || 0;
			nowKey = d.key || '';
			nowPrep = d.prep || 0;
			nowUid = d.uid || 0;
			rootFd = d.rootfdid || 0;
			nowType = d.type;
			nowOtype = d.otype || nowOtype;
			if(d.order){
				nowOrder = d.order;
			}
			nowOds = '{'+nowOrder[0]+':'+nowOrder[1]+'}';

			nowSchool = d.school || 0;
			nowAuth = d.auth || 0;
			//备课
			nowGrade = d.grade || 0;
			nowTag = d.tag || 0;
			nowUid = d.uid || 0;
			nowPid = d.pid || 0;						
		}

		if(nowOtype === 'list'){
			$('#fileInfoTable').show();
			$("#fileIcoList").hide();
		}else{
			$('#fileInfoTable').hide();
			$("#fileIcoList").show();			
		}

		if(nowOtype === 'ico'){
			$('#fileList').attr('class','dis-ico-type');
		}else{
			$('#fileList').attr('class','dis-list-type');
		}

		if(nowGid && !nowFd || (typeof nowData.now !== 'undefined' && !nowData.now)){
			$('#btnZone').hide();
		}else{
			if(nowPrep == 'group'){
				$('#btnZone').hide();
			}else if(!nowSchool){
				$('#btnZone').show();
			}
		}


		//crTit();
		var data = {};
		if(nowFd){
			data.folderId = nowFd;
		}
		//folderId : nowFd
		//};
		if(nowGid){
			data.groupId = nowGid;
		}
		handerObj.triggerHandler('fold:one',data);			

		var obj = {};
		if(nowFd){
			obj.folderId = nowFd;
		}
		// if(nowFd){
		// 	obj.folderId = nowFd;
		// }else if(rootFd){
		// 	obj.folderId = rootFd;
		// }
		if(nowGid){
			obj.groupId = nowGid;
		}
		if(nowUid){
			obj.creatorId = nowUid;
		}

		if(isLoad){
			return;			
		}
		isLoad = true;


		// if(nowFd != rootFd){

		// 	var o1 = {
		// 		folderId : rootFd
		// 	}	
		// 	if(nowUid){
		// 		o1.creatorId = nowUid;
		// 	}
		// 	o1.root = 1;
		// 	if(!nowGid){
		// 		handerObj.triggerHandler('fold:get',o1);
		// 	};
		// }
		
		obj.order = nowOds; 
		// console.log(obj,nowOrder,nowOds);	
		if(nowKey == ''){
			handerObj.triggerHandler('fold:get',obj);
		}else{
			obj.key = nowKey;
			handerObj.triggerHandler('fold:get',obj);
		}
	}

	//取一个文件夹的信息
	function foldOne(e,d){
		if(d.isOpen){
			nowData.open = 1;
		}

		//type1 新媒体

		if(d.type === 1){
			handerObj.triggerHandler('bind:swall',1);
		}else{
			handerObj.triggerHandler('bind:swall',0);
		}
		if(nowData.info){
			handerObj.triggerHandler('file:init',nowData);
		}
		if(nowGid && (nowGinfo.type != 0 && !nowGinfo.isMember) && nowFd == nowGinfo.rootFolder.id && !nowPrep){
			$('#btnZone').hide();
		}else{
			if(!$.isEmptyObject(nowGinfo) && (!nowGinfo.isMember && nowGinfo.type !=0)){
				if(d.isOpen && !d.isReady){
					$(".btn-upload").show();
				}else{
					$('#btnZone').hide();
				}
			}
		}

		nowFdInfo = d;
		crTit(d);
	}

	function foldLoad(e,d){
		isLoad = false;
		//个人的首页
		if(!nowGid){ // && !nowFd){
			//if(!nowFd || nowFd == rootFd || d.root){
				
            	//新建文件夹
                if(d.pid == rootFd){
                	var fl = Cache.get('myfold');
                	if(!fl){
                		fl = [];
                	}
                	fl.push(d.list[0]);
                	makeTree(fl,foldTarget,nowFd);
					handerObj.triggerHandler('cache:set',{key: 'myfold',data:fl});                	
                }else{
                	if(d.list.length > 0){
		            	var td = d.list[0];
		            	var target = $('#foldList .fold'+td.pid);
		            	//根目录下的文件夹
		            	if(td.pid == rootFd){
		            		target  = foldTarget;
		            	}
						makeTree(d.list,target,nowFd);
						handerObj.triggerHandler('cache:set',{key: 'myfold',data:d.list});
					}
				}
			//}
		//小组,部门,学校
		}else if(nowGinfo.rootFolder){
			if(nowGinfo.rootFolder.id == nowFd){
				if(d.pid == rootFd){
                	var fl = Cache.get('rootFolder'+nowGid);
                	fl.push(d.list[0]);
                	makeTree(fl,foldTarget,nowFd);
					handerObj.triggerHandler('cache:set',{key: 'rootFolder'+nowGid,data:fl});
				}else{
					if(d.list.length > 0){
		            	var td = d.list[0];
		            	var target = $('#foldList .fold'+td.pid);
		            	//根目录下的文件夹
		            	if(td.pid == rootFd){
		            		target  = foldTarget;
		            	}					
						makeTree(d.list,target,nowFd);
						handerObj.triggerHandler('cache:set',{key: 'rootFolder'+nowGid,data:d.list});
					}
				}
			}else{
            	var td = d.list[0];
            	if(d.list.length){
	            	var target = $('#foldList .fold'+td.pid);
	            	//根目录下的文件夹
	            	if(td.pid == rootFd){
	            		target  = foldTarget;
	            	}					
					makeTree(d.list,target,nowFd);				
				}
				//这个地方有点糊涂了...暂时不用,可能是树哪儿的逻辑.
				//非跟目录
				// var obj = {
				// 	groupId : nowGid,
				// 	target : foldTarget,
				// 	root: 1
				// }
				// if(nowGinfo.rootFolder){
				// 	obj.folderId = nowGinfo.rootFolder.id;
				// }
				//handerObj.triggerHandler('fold:get',obj);
			}
		}
		
		if(d.root){
			return;
		}

		var pr = 0;
		if(nowPrep){
			pr = nowPrep;
		}
		//console.log(d.list);

		var target = tmpTarget,
			tplid = 'fold.user.list';

		if(nowOtype === 'ico'){
			target = icoTarget;
			tplid = 'fold.ico';
		}

		var view = new View({
			target : target,
			tplid : tplid,
			data : {
				list : d.list,
				gid : nowGid,
				pr : pr,
				now : nowData.now,
				prep : nowPrep,
				grade : nowGrade,
				school : nowSchool,
				ginfo : nowGinfo,
				auth : nowAuth,
				tag : nowTag,
				uid : nowUid,
				fdid : nowFd
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
			page:0,
			pageNum : 0,
			order : nowOds			
		}



		if(nowGid){
			data.groupId = nowGid;
		}
		if(nowFd){
			data.folderId = nowFd;
		}
		if(nowUid){
			data.creatorId = nowUid;
		}
		handerObj.triggerHandler('fold:search',data);			
	}	

	//新建文件夹
	function createFold(e,d){
		var data = {
			name : d.name,
			isOpen : d.isOpen,
			isReadonly : d.isReadonly
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
		$("#fileActZone").addClass('hide');
		$(".tool-zone").removeClass('hide');		
		var list = d.id;
		var fl = [];
		var nl = [];
		if(!nowGid){
			fl = Cache.get('myfold');
		}else{
			fl = Cache.get('rootFolder'+nowGid);
		}

		for(var i = 0;i<fl.length;i++){
			if($.inArray(fl[i].id,list)<0){
				nl.push(fl[i]);
			}
		}
		if(!nowGid){
			handerObj.triggerHandler('cache:set',{key: 'myfold',data:nl});			
		}else{
			handerObj.triggerHandler('cache:set',{key: 'rootFolder'+nowGid,data:nl});			
		}

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

	function showCreateFold(){
		$('#newFold .check-open:checked').attr('checked',false);
		$('#newFold .check-read:checked').attr('checked',false);
		$('#newFold .open-fold').addClass('hide');
		$('#newFold .read-fold').addClass('hide');			
		if(nowGid){
			if(nowGinfo.isMember && nowGinfo.type==2){
				$('#newFold .open-fold').removeClass('hide');
				//$('#newFold .read-fold').removeClass('hide');
			}
		}
		$('#newFold').modal('show');
	}

	var handlers = {
		'fold:titload' : titLoad,
		'fold:treeload' : foldTree,
		'fold:modifysuc' : modifySuc,
		'fold:viewedit' : foldEdit,
		'fold:delsuc' : delSuc,
		'fold:create' : createFold,
		'fold:createfold' : showCreateFold,
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
