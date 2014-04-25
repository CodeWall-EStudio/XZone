define(['../school/config','../school/cache','../school/helper/view','model.group'],function(config,Cache,View){
	var handerObj = $(Schhandler);
	var isInit = false, //初始化
		isListBind = false, //已经绑定
		isLoading = false,//正在加载
		nowPage = 0,
		pageNum = config.pagenum,
		nowKey = '',
		nowOd = 1,
		nowArch = 0;
		nowOn = 'name',
		nowGroup = null,
		nowType = null;

	var actTarget = $('#actWinZone'),
		actWin = $('#actWin');
	var types = {
		'group' : 1,
		'dep' : 2,
		'prep' : 3
	}
	var nowList = [],
		now2key = {};

	var groupHandler = {
		//搜索
		'.group-search-key' : {
			'focus' : function(){
				var t = $(this),
					v = t.val(),
					def = t.attr('data-def');
				if(v == def){
					t.val('');
				}
			},
			'blur' : function(){
				var t = $(this),
					v = t.val(),
					def = t.attr('data-def');
				if(v == ''){
					t.val(def);
				}
			}
		},
		'.group-search-btn' : {
			'click' : function(){
				var v = $('.group-search-key').val(),
					def = $('.group-search-key').attr('data-def');
				if(v != '' && v != def){
					nowKey = v;
					reloadGroup();
					var obj = {
						keyword : v,
						type : types[nowType],
						page : 0
					}
					getGroup(obj);
				}
			}
		},
		//添加备课
		'.add-sem' : {
			'click' : function(){
				var view = new View({
					target : $('#groupModifyZone'),
					tplid : 'manage/group.modify.dl',
					after : function(){
						$('.start-time').pickmeup({
    						format  : 'Y-m-d',
    						hide_on_select : true
						});
						$('.end-time').pickmeup({
    						format  : 'Y-m-d',
    						hide_on_select	: true
						});						
					},
					data : {
						type : nowType,
						st : 1,
						prep : false
					}
				});
				view.createPanel();
			}
		},
		'.group-check' : {
			'click' : function(){
				var t = $(this),
					v = t.val();
				if(v){
					$('.group-prep-span').removeClass('hide');
				}else{
					$('.group-prep-span').addClass('hide');
				}
			}
		},
		//添加小组
		'.add-group' : {
			'click' : function(){
				var data = {
					type : nowType,
					archivable : 0,
					st : 0
				}
				if(nowType == 'prep'){
					var prep = Cache.get('preps');
					var grade = Cache.get('grade');
					var subject = Cache.get('subject');					
					data.prep = prep.g2key;
					data.grade = grade;
					data .subject = subject;
				}else if(nowType == 'group'){
					var prep = Cache.get('preps');
					data.prep = prep.g2key;
				}
				var view = new View({
					target : $('#groupModifyZone'),
					tplid : 'manage/group.modify.dl',
					data : data
				});
				view.createPanel();
			}
		},
		//删除小组
		'.del-group' : {
			'click' : function(){
				console.log('del');
			}
		},
		//审核通过
		'.apv-pass' : {
			'click' : function(){
				handerObj.triggerHandler('group:approve',{
					groupId:nowGroup.id,
					validateText : 'pass',
					validateStatus : 1
				});				
			}
		},
		//审核通过
		'.apv-notpass' : {
			'click' : function(){
				handerObj.triggerHandler('group:approve',{
					groupId:nowGroup.id,
					validateText : 'pass',
					validateStatus : 1
				});
			}
		},
		//保存修改
		'.btn-save' : {
			'click' : function(){
				var modify = $(this).attr('data-modify');
				var name = $('#modifyZone .group-name').val();
				var archivable = $('#modifyZone input[type=radio]:checked').val();
				var managelist = [],
					memberlist = [];
				var st = 0,
					et = 0;

				$('#groupManageList i').each(function(){
					managelist.push($(this).attr('data-id'));
				});
				$('#groupMemberList i').each(function(){
					memberlist.push($(this).attr('data-id'));
				});	

				var sem = 0;
				if(nowType == 'prep'){
					//添加学年
					if($('.start-time').length){
						sem = 1;
						st = $('.start-time').pickmeup('get_date').getTime();
						et = $('.end-time').pickmeup('get_date').getTime();

						if(st >= et){
							alert('结束时间不能早于开始时间')
						}
						
						if(name == ''){
							alert('你还没有填写学年名称');
							return;
						}

					//添加科目
					}else{
						var pid = $('#prepPrep').val();
						var gid = $('#gradePrep').val();
						var sid = $('#subjectPrep').val();
						name = checkPrep(pid,gid,sid);
						if(!name){
							alert('该学年下已有同名备课目录');
						}
						if(memberlist.length ==0){
							alert('你还没选择小组成员');
							return;
						}
					}

				}else{
					if(name == ''){
						alert('你还没有填写分组名');
						return;
					}
					if(managelist.length == 0 && memberlist.length ==0){
						alert('你还没选择成员或者管理员');
						return;
					}
				}

				var obj = {
					name : name,
					content : '',
					status : 0,
					type : types[nowType],
					members : memberlist,
					managers : managelist,
				}

				if(nowType == 'group'){
					obj.archivable = archivable;
					if(archivable){
						obj.grade = $('.group-prep').val();
					}
				}else if(nowType == 'dep'){
					var order = $('.group-no').val();
					obj.order = order;
				}else if(nowType == 'prep'){
					if(sem){
						obj.startTime = st;
						obj.endTime = et;
					}else{
						obj.parentId = pid;
						obj.grade = gid;
						obj.tag = sid;						
					}
				}
				//return;
				if(modify){
					id = $('#modifyZone .group-name').attr('data-id');
					obj.groupId = id;
					handerObj.triggerHandler('group:modify',obj);	
				}else{
					handerObj.triggerHandler('group:create',obj);	
				}
				
			}
		},
		//取消修改
		'.btn-reset' : {
			'click' : function(){
				console.log(nowType);	
			}
		},
		//设置管理员
		'.btn-set-manage' : {
			'click' : function(){
				var modify = $(this).attr('data-modify');
				if(!isLoading){
					isLoading = true;
					handerObj.triggerHandler('group:loaduser',{type : 1,modify:modify});
				}
			}
		},
		//设置成员
		'.btn-set-member' : {
			'click' : function(){
				var modify = $(this).attr('data-modify');
				if(!isLoading){
					isLoading = true;
					handerObj.triggerHandler('group:loaduser',{type : 0,modify:modify});
				}
			}
		},
		//删除用户
		'.del-share-user' : {
			'click' : function(){
				var t = $(this),
					id = t.attr('data-id');
				delShareUser({_id:id});				
			}
		},
		//排序
		'.group-order' : {
			'click' : function(){
				var t = $(this),
					on = t.attr('data-on'),
					od = t.attr('data-od');
				if(on != nowOd || od != nowOd){
					nowOd = od;
					nowOn = on;
					reloadGroup();
					getGroup({
						page : 0,
						order : '{'+nowOn+':'+nowOd+'}'
					});
				}

			}
		},
		//更多
		'.next-group-page' : {
			'click' : function(){
				var t = $(this),
					next = t.attr('data-next');
				if(next){
					getGroup({
						order : '{'+nowOn+':'+nowOd+'}',
						keyword : nowKey,
						page : nowPage
					});
				}
			}
		}
	}

	//验证备课目录是否已经存在同名的.
	function checkPrep(pid,gid,sid){
		var p = Cache.get('preps'),
			prep = p.g2key,
			grade = Cache.get('grade'),
			subject = Cache.get('subject');
		var item = prep[pid];
		if(!item){
			return false;
		}
		if(item.grade == gid && item.tag == sid){
			return false;
		}
		if(grade[gid] && subject[sid]){
			return grade[gid]+subject[sid];
		}else{
			return false;
		}
		
	}


	function bind(){
		$('#groupTable').on('click','.group-tr',function(e){
			var t = $(this),
				id = t.attr('data-id');
				arch = t.attr('data-arch');
			var t1 = $(e.target),
				fid = t1.attr('data-fid');
			//显示统计
			if(fid){
				if(!isLoading){
					handerObj.triggerHandler('group:folderstatus',fid);
				}
				return;
			}

			$('#groupTable .group-tr').removeClass('group-tr-selected');
			t.addClass('group-tr-selected');
			if(id){
				if(!isLoading){
					nowArch = arch;
					isLoading = true;
					handerObj.triggerHandler('group:one',id);
				}
			}
		})
	}


	function init(type){
		nowPage = 0;
		nowKey = '';
		var obj = {
			target : $('#groupMa'),
			tplid : 'manage/group',
			data : {
				type : type
			},
			after : function(){
				$('#groupMa').removeClass('hide');
				isInit = true;
				//清空缓存
				nowList = [];
				now2key = {};

				bind();

				var view = new View({
					target : $('#modifyZone'),
					tplid : 'manage/group.modify',
					data : {
						type : type
					}
				});
				view.createPanel();

				if(!isLoading){
					var obj = {
						page : nowPage,
						pageNum : pageNum,
						type : types[type]
					}
					isLoading = true;					
					handerObj.triggerHandler('group:list',obj);
				}


				if(objTit){
					objTit.target = $('#tableTit');
					var view = new View(objTit);
					view.createPanel();
				}
			}
		};
		if(!isInit){
			obj.handlers = groupHandler;
		}

		if(type != nowType){
			nowType = type;
			var objTit = {
				tplid : 'manage/group.tit',
				data : {
					type : type,
					od : nowOd,
					on : nowOn
				}
			}
		}

		nowType = type;

		var view = new View(obj);
		view.createPanel();
	}


	function getGroup(obj){
		if(!isLoading){
			obj.pageNum = pageNum;
			obj.type = types[nowType];
			isLoading = true;			
			handerObj.triggerHandler('group:list',obj);
		}
	}

	function resetKey(){
		nowKey = '';
	}

	//重新加载
	function reloadGroup(){
		var objTit = {
			tplid : 'manage/group.tit',
			data : {
				type : nowType,
				od : nowOd,
				on : nowOn,
				keyword : nowKey
			}
		}		
		objTit.target = $('#tableTit');
		nowPage = 0;
		nowArch = 0;
		nowGroup = null;
		isLoading = false;

		var view = new View(objTit);
		view.createPanel();		
		$("#tableBody").html('');
	}

	//单个小组加载完成
	function groupInfo(e,d){
		isLoading = false;
		d.archivable = nowArch;
		nowGroup = d;
		//if(nowType == 'group'){
			d.prep = Cache.get('preps').g2key;
		//}
		if(nowType == 'prep'){
			d.subject = Cache.get('subject');;
			d.grade = Cache.get('grade');
		}
		var view = new View({
			target : $('#groupModifyZone'),
			tplid : 'manage/group.modify.dl',
			data : d		
		});
		view.createPanel();

		if(d.status == 1){
			$('.group-action-btn button').removeClass('active').prop({
				'disabled' : false
			});
		}else{
			$('.group-action-btn button.apv-pass').addClass('active').prop({
				'disabled' : true
			});
			$('.group-action-btn button.apv-notpass').addClass('active').prop({
				'disabled' : true
			});						
			$('.group-action-btn button.del-group').removeClass('active').prop({
				'disabled' : false
			});			
		}
	}

	//小组列表加载完成
	function groupLoad(e,d){
		//console.log(d);
		//status : 0 已审核 1 审核中  2 已归档 3 已关闭
		//console.log(d.total);
		isLoading = false;
		d.type = nowType;
		var prep = Cache.get('preps').g2key;
		var grade = Cache.get('grade');
		var subject = Cache.get('subject');		

		d.glist = grade;
		d.subject = subject;
		d.prep = prep;

		var view = new View({
			target : $('#tableBody'),
			tplid : 'manage/group.list',
			data : d
		});
		view.appendPanel();
		if($('#tableBody tr').length < d.total){
			nowPage++;
			$('.next-group-page').attr('data-next',1);
		}else{
			$('.next-group-page').removeAttr('data-next').text('已经全部加载完了');
		}
	}

	//用户选择处理
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
			},
			after : function(){
				target.find('.plus').unbind().bind('click',function(e){
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
							var p = target.parent('li');
							userList(getUList(id,list.children),p);
						}
				});
			}			
		});
		view.appendPanel();
	}

	//用户列表加载完成
	function userLoaded(e,d){
		isLoading = false;
		var data = {
			list : d.list
		}
		if(d.modify){
			data.members = nowGroup.members;
			data.type = d.type;
		}
		var view = new View({
			target : actTarget,
			tplid : 'manage/user',	
			data : data,
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
						actTarget.find('input:checked').each(function(){
							li.push($(this).val());
						});
						if(li.length===0){
							return;
						}
						//管理员
						if(d.type){
							$('#groupManageList').html($('#shareToUser').html());
						//成员
						}else{
							$('#groupMemberList').html($('#shareToUser').html());
						}
					}
				}
			}			
		});
		view.createPanel();		
	}

	function statusLoad(e,d){
		isLoading = false;
		//console.log(d);
		var view = new View({
			target : $("#groupModifyZone"),
			tplid : 'manage/status',
			data : d,
			after : function(){
				if(!d.totalCount){
					return;
				}
				var list = [],
					clist = [];
				var filetype = config.filetype;
				for(var i in d.list){
					var item = d.list[i];
					list.push([filetype[item.type],item.size,item.count]);
					clist.push([filetype[item.type],item.count]);
				}
				
				var plot2 = jQuery.jqplot ('preImg', [list],{
					seriesDefaults: {
						renderer: jQuery.jqplot.PieRenderer, 
						rendererOptions: {
							padding: 20, 
							// Turn off filling of slices.
							fill: true,
							showDataLabels: true, 
							// Add a margin to seperate the slices.
							sliceMargin: 4, 
							// stroke the slices with a little thicker line.
							lineWidth: 5
							}
						}, 
						legend: { 
							show:true, 
							location: 'e' 
						},
						cursor : {
							show: true,              //是否显示光标  
							showTooltip: true,      // 是否显示提示信息栏  
							followMouse: false,
						}
					}
				);

				var plot3 = jQuery.jqplot ('preImg1', [clist],{
					seriesDefaults: {
						renderer: jQuery.jqplot.PieRenderer, 
						rendererOptions: {
							padding: 20, 
							// Turn off filling of slices.
							fill: true,
							showDataLabels: true, 
							// Add a margin to seperate the slices.
							sliceMargin: 4, 
							// stroke the slices with a little thicker line.
							lineWidth: 5
							}
						}, 
						legend: { 
							show:true, 
							location: 'e' 
						},
						cursor : {
							show: true,              //是否显示光标  
							showTooltip: true,      // 是否显示提示信息栏  
							followMouse: false,
						}
					}
				);	
				$('#preImg1').hide();
			},
			handlers : {
				'.status-size' : {
					'click' : function(){
						$(this).addClass('selected');
						$('.status-count').removeClass('selected');
						$('.preimg-zone').hide();
						$('#preImg').show();
					}
				},
				'.status-count' : {
					'click' : function(){
						$(this).addClass('selected');
						$('.status-size').removeClass('selected');
						$('.preimg-zone').hide();
						$('#preImg1').show();
					}
				},				
			}
		});
		view.createPanel();
	}

	function createSuc(e,d){
		d.type = nowType;
		
		var target = $('<tr data-id="'+d.id+'" class="group-tr group-tr'+d.id+'"></tr>');

		if(nowType == 'prep'){
			//d.g2key = Cache.get('preps').g2key;
			var tg2key = Cache.get('preps').g2key;
			$.extend(tg2key,d.g2key);
			d.g2key = tg2key;
			d.glist = Cache.get('grade');
			d.subject = Cache.get('subject');	
		}else if(nowType == 'group'){
			var tg2key = Cache.get('preps').g2key;
			d.prep = tg2key;
		}
		var view = new View({
			target : target,
			tplid : 'manage/group.list.one',
			data : d
		});
		// view.createPanel();		
		// $('#tableBody').append(target);
	}

	function modifySuc(e,d){
		if(nowType == 'prep'){
			var tg2key = Cache.get('preps').g2key;
			$.extend(tg2key,d.g2key);
			d.g2key = tg2key;
			d.glist = Cache.get('grade');
			d.subject = Cache.get('subject');	
		}else if(nowType == 'group'){
			var tg2key = Cache.get('preps').g2key;
			d.prep = tg2key;
		}		
		var id = d.id;
		console.log(d);
		var view = new View({
			target : $('.group-tr'+id),
			tplid : 'manage/group.list.one',
			data : d
		})
		view.createPanel();

	}

	function appSuc(e,d){
		if(d.type == 1){
			$('.group-tr'+d.id+' .td-status').html('已审核');
		}else{
			$('.group-tr'+d.id+' .td-status').html('审核不通过');
		}		
	}

	var handlers = {
		'group:loaded' : groupLoad,
		'group:createsuc' : createSuc,
		'group:userloaded' : userLoaded,
		'group:modifysuc' : modifySuc,
		'group:groupinfosuc' : groupInfo,
		'group:appsuc' : appSuc,
		'group:statusload' : statusLoad
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}

	return {
		init : init
	}
});