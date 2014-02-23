define(['config','helper/view','cache','model.groupprep'],function(config,View,Cache){
	var	handerObj = $(Schhandler);

	var	stitTarget = $('#sectionTit'),
		tabletitTarget = $("#tableTit"),
		tmpTarget = $('#fileInfoList'),
		groupPrepAsideTarget = $('#groupPrepAside');

	var nowGid = 0,
		action = 0,
		nowKey = '',
		nowFd = 0,
		userList = null,
		nowOrder  = ['createtime',1],
		nowGrade = 0,
		nowTag = 0,
		nowPrep = 0, //当前是否是备课
		nowD = null,
		nextPage = 0
		nowPrep = null;

	function prepAside(){
		var data = {
			name : '备课检查',
			pt : 1
		};
		var view = new View({
			target : groupPrepAsideTarget,
			tplid : 'group.aside',
			data : data,
			after : function(){
				groupPrepAsideTarget.attr('have',1);
			}
		});
		view.createPanel();
	}

	function crTit(){
		var view = new View({
			target : stitTarget,
			tplid : 'prep.group.tit',
			data : {
				list : nowPrep.list,
				tlist : config.tag,
				glist : config.grade,
				key : nowKey,
				fold : 0,
				fdid : nowFd,
				ulist : userList,
				pid : nowPid,
				gid : nowPid,
				tag : nowTag,
				grade : nowGrade,
				uid : nowUid
			}
		});
		view.createPanel();	
	}

	function init(e,d){
		d.prep = 'group';
		if(d){
			nowD = d;
			nowGrade = d.grade || 0;
			nowTag = d.tag || 0;
			nowGid = d.gid || 0;
			nowFd = d.fdid || 0;
			nowUid = d.uid || 0;
			nowPid = d.pid || 0;
			if(d.order){
				nowOrder = d.order;
			}
			nowKey = d.key || '';
			//nowPrep = d.prep || 0;
		}

		$('.aside-divs').hide();
		if(!groupPrepAsideTarget.attr('have')){
			prepAside();
		}
		groupPrepAsideTarget.show();

		if(!userList){
			handerObj.triggerHandler('nav:getuser',{type:'prep'});
		}else{
			if(!nowUid){
				crTit();
			}
			handerObj.triggerHandler('groupprep:get',{pid:nowPid,grade:nowGrade,tag:nowTag});
		}
		// handerObj.triggerHandler('file:init',d);
		// handerObj.triggerHandler('fold:init',d); 
	};

	function userLoad(e,d){
		userList = Cache.get('alluser2key');
		handerObj.triggerHandler('groupprep:get',{pid:nowPid,grade:nowGrade,tag:nowTag});
	}

	function loadSuc(e,d){
		nowPrep = d;
		crTit();	
		if(nowGid){
			handerObj.triggerHandler('fold:init',nowD);
			if(nowFd){
				handerObj.triggerHandler('file:init',nowD);
			}
			return;
		}		
		
		var plist = d.plist;
		var list = d.list;
		var view = new View({
			target : tmpTarget,
			tplid : 'prep.group.list',
			data : {
				list : plist,
				ul : userList,
				pid : nowPid,
				tag : nowTag,
				grade : nowGrade,
				uid : nowUid				
			}
		});　
		view.createPanel();
		
	}

	var handlers = {
		'groupprep:init' : init,
		'groupprep:loadsuc' : loadSuc,
		'groupprep:userload' : userLoad
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}

});