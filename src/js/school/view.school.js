define(['config','helper/view','cache','helper/util','model.school'],function(config,View,Cache,util){
	var	handerObj = $(Schhandler);

	var nowGid = 0,
		nowFd = 0,
		nowOrder  = ['createTime',-1],
		nowKey = '',
		nowUid = 0,
		nowType = 0,
		rootFd = 0;

	var actTarget = $('#actWinZone'),
		userAsideTarget = $('#userAside'),
		userPrepAsideTarget = $('#userPrepAside'),
		groupAsideTarget = $('#groupAside'),
		groupPrepAsideTarget = $('#groupPrepAside');	

	function init(e,d){
		$('#userAside').hide();
		$("#groupAside").show();

		util.showNav('school');
		userAsideTarget.hide();
		userPrepAsideTarget.hide();
		groupPrepAsideTarget.hide();

		var myinfo = Cache.get('myinfo');
		var school = myinfo.school;

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
				type : nowType
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
								$("#fileActZone .appove").removeClass('hide');
								nowType = 1;	
							}else{
								$("#fileActZone .appove").addClass('hide');
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
			info : d
		}
		handerObj.triggerHandler('fold:init',obj); 
	}

	function appoveMore(e,d){
		handerObj.triggerHandler('school:showapv',d);
	}

	function showApv(e,d){
		var fold = Cache.get('rootFolder'+nowGid);
		console.log(d);
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
						var id = d.id;
						if(typeof d.id === 'string'){
							id = [d.id];
						}
						var obj = {
							fileIds : id,
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
		var ids = d.fileIds;
		for(var i = 0,l=ids.length;i<l;i++){
			$('.file'+ids[i]).remove();
		}
	}

	var handlers = {
		'school:init' : init,
		'school:infosuc' : infoSuc,
		'school:showapv' : showApv,
		'school:apvsuc' : apvSuc,
		'school:appovemore' : appoveMore
	};

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}	

});