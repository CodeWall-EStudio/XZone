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
		//添加小组
		'.add-group' : {
			'click' : function(){
				var view = new View({
					target : $('#groupModifyZone'),
					tplid : 'manage/group.modify.dl',
					data : {
						type : nowType,
						archivable : 0
					}
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
				$('#groupManageList i').each(function(){
					managelist.push($(this).attr('data-id'));
				});
				$('#groupMemberList i').each(function(){
					memberlist.push($(this).attr('data-id'));
				});	

				if(name == ''){
					alert('你还没有填写分组名');
					return;
				}
				if(managelist.length == 0 && memberlist.length ==0){
					alert('你还没选择成员或者管理员');
					return;
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
				}else if(nowType == 'dep'){
					var order = $('.group-no').val();
					obj.order = order;
				}
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


	function bind(){
		$('#groupTable').on('click','.group-tr',function(){
			var t = $(this),
				id = t.attr('data-id');
				arch = t.attr('data-arch');
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

	//重新加载
	function reloadGroup(){
		var objTit = {
			tplid : 'manage/group.tit',
			data : {
				type : nowType,
				od : nowOd,
				on : nowOn
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
		var view = new View({
			target : $('#groupModifyZone'),
			tplid : 'manage/group.modify.dl',
			data : d		
		});
		view.createPanel();
		console.log(d.status);
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

	function createSuc(e,d){
		console.log(d);
		d.type = nowType;
		var view = new View({
			target : $('#tableBody'),
			tplid : 'manage/group.list',
			data : d
		});
		view.appendPanel();		
	}

	function modifySuc(e,d){
		var id = d.id;
		var view = new View({
			target : $('.group-tr'+id),
			tplid : 'manage/group.list.one',
			data : d
		})
		view.createPanel();

	}

	function appSuc(e,d){
		console.log(d);
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
		'group:appsuc' : appSuc
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}

	return {
		init : init
	}
});