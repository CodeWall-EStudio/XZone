define(['config','helper/view','cache','helper/util','model.school'],function(config,View,Cache,util){
	var	handerObj = $(Schhandler);

	var nowGid = 0,
		nowFd = 0,
		nowOrder  = ['createTime',-1],
		nowKey = '',
		nowUid = 0,
		nowType = 0,
		nowOtype = 'list',
		nowManage = 0,
		nowSchool = null,
		rootFd = 0;

	var actTarget = $('#actWinZone'),
		userAsideTarget = $('#userAside'),
		userPrepAsideTarget = $('#userPrepAside'),
		groupAsideTarget = $('#groupAside'),
		groupPrepAsideTarget = $('#groupPrepAside');	

	function init(e,d){
		$('#userAside').hide();
		$("#groupAside").show();

		nowManage = d.manage;
		nowOtype = d.otype || nowOtype;

		// $('.school-link').removeClass('selected');
		// if(nowManage){
		// 	$('.school-link').eq(1).addClass('selected');
		// }else{
		// 	$('.school-link').eq(0).addClass('selected');
		// }

		util.showNav('school');
		userAsideTarget.hide();
		userPrepAsideTarget.hide();
		groupPrepAsideTarget.hide();

		var myinfo = Cache.get('myinfo');
		var school = myinfo.school;
		nowSchool = school;

		$("#fileActZone .sharefile").hide();
		$("#fileActZone .copyfile").hide();

		if(!school.auth){
			$('#btnZone').hide();
			$("#fileActZone").addClass('hide');
			$('.tool-zone').removeClass('hide');
			$("#fileActZone .renamefile").hide();
			$("#fileActZone .delfile").hide();
			$("#fileActZone .movefile").hide();
		}else{
			$('.tool-zone').removeClass('hide');
			$("#fileActZone").addClass('hide');
		}
		handerObj.triggerHandler('bind:school',{
			school : 1,
			auth : school.auth
		});
		nowGid = school.id;
		nowFd = school.rootFolder.id;
		nowUid = d.uid;
		if(d.fdid){
			nowFd = d.fdid;
		}else{
			d.fdid = nowFd;
		}

		var view = new View({
			target : $("#groupAside"),
			tplid : 'school.aside',
			data : {
				auth : school.auth,
				type : nowManage
			},
			handlers : {
				'h3' : {
					'click' : function(e){
						$("#groupAside h3").removeClass('selected');
						var cmd = $(e.target).attr('cmd');
						//console.log($(e.target).hasClass('selected'),$(e.target).attr('class'));
						if(!$(e.target).hasClass('selected')){
							$(e.target).addClass('selected');
							if(cmd=='manage'){
								d.auth = school.auth;
								nowType = 1;	
							}else{
								d.auth = 0;
								nowType = 0
							}
							d.school = 1;
							if(cmd==='recy'){
								//#recy=1&gid=<%+id%>
								//handerObj.triggerHandler('recy:init',d);	
								window.location.hash = '#recy=1&gid='+d.gid+'&school=1';
							}else{
								handerObj.triggerHandler('fold:init',d);	
							}
					        //handerObj.triggerHandler('file:init',d);
						}

					}
				}
			}		
		});
		view.createPanel();

		if(d){
			if(d.order){
				nowOrder = d.order;
			}
			nowOds = '{'+nowOrder[0]+':'+nowOrder[1]+'}';
			nowKey = d.key || '';
		}		

		d.gid = nowGid;

		d.info = school;

		d.school = 1;
		d.auth = nowType;

		handerObj.triggerHandler('group:info',{
			gid : nowGid,
			type : 'school'	
		});
        //handerObj.triggerHandler('file:init',d);
        handerObj.triggerHandler('upload:param',d);		
	}

	function infoSuc(e,d){
		var obj = {
			auth : nowType,
			school : 1,
			gid : nowGid,
			fdid : nowFd,
			uid : nowUid,
			order : nowOrder,
			otype : nowOtype,
			key : nowKey,
			info : d
		}
		if(nowManage){
			obj.auth = nowSchool.auth;
			obj.nowType = 1;			
		}
		handerObj.triggerHandler('fold:init',obj); 
	}

	function showApv(e,d){
		var fold = Cache.get('rootFolder'+nowGid);

		var view = new View({
			target : actTarget,
			tplid : 'file.apv',
			data : {
				name : d.name,
				fold : fold,
				gid : nowGid,
				status : d.status
			},
			after : function(){
				$("#actWin").modal('show');
			},
			handlers : {
				'.btn-post' : {
					'click' : function(){
						var obj = {
							fileId : d.id,
							validateText : actTarget.find('.val-text').val(),
							validateStatus : d.status
						}
						if($('#schoolFoldResultUl input:checked').length){
							obj.fdid = $('#schoolFoldResultUl input:checked').val();
							obj.gid = nowGid;
						}
						handerObj.triggerHandler('school:approv',obj);
					}
				},
				'.plus' : {
					'click' : function(){
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
		});
		view.createPanel();

		var validateText;
		var validateStatus;
	}

	function apvSuc(e,d){
		$('.file'+d.fileId).remove();
	}

	var handlers = {
		'school:init' : init,
		'school:infosuc' : infoSuc,
		'school:showapv' : showApv,
		'school:apvsuc' : apvSuc
	};

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}	

});