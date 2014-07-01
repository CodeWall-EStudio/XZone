define(['config','cache','helper/view','helper/util','model.user'],function(config,Cache,View,Util){
	var handerObj = $(Schhandler);
	var isInit = {}, //初始化
		userList = {},
		o2key = {}, //组织hash
		isLoading = false;
		nowUin = 0,
		nowPage = 0,
		nowOrder = '{name:1}',
		nowOd = 1,
		nowOn = 'name',
		nowKey = '',
		nowOid = 0,
		pageNum = config.pagenum;

	//组织树初始化
	function despInit(){

	}

	function getUser(obj){
		obj.pageNum = 0;//pageNum;
		obj.order = nowOrder;
		handerObj.triggerHandler('user:search',obj);
	}
 
	//添加用户
	function addUser(){
		var sglist = Cache.get('sizegroup');

		var view = new View({
			target : $('#userModifyBlock'),
			tplid : 'manage/modify.user',
			data : {
				data : false,
				sglist : sglist
			}
		});
		view.createPanel();		
	}

	//修改用户
	function modifyUser(uin){
		if(userList[uin]){
			var sglist = Cache.get('sizegroup');

			var view = new View({
				target : $('#userModifyBlock'),
				tplid : 'manage/modify.user',
				data : {
					data : userList[uin],
					sglist : sglist
				}
			});
			view.createPanel();
		}
	}

	//清空默认数据
	function reloadUser(){
		nowUin = 0;
		nowPage = 0;
		nowKey = '';
		isLoading = false;
		userList = {};
		$('#userList').html('');
	}

	//用户列表加载完成
	function userLoad(e,d){
		$.extend(userList,d.list);

		if(d.nowOg){
			modifyOrg(d.nowOg,d.kl,d.rid);
			return;
		}

		if(nowOd == 1){
			$('th.order-'+nowOn).attr('data-od',-1);
			$('th.order-'+nowOn+' i').attr('class','au');
		}else{
			$('th.order-'+nowOn).attr('data-od',1);
			$('th.order-'+nowOn+' i').attr('class','ad');
		}

		var view = new View({
			target : $('#userList'),
			tplid : 'manage/search.user.list',
			data : d
		});
		view.appendPanel();
		// if($('#tableBody tr').length < d.total){
		// 	nowPage++;
		// 	$('#userMa .next-group-page').attr('data-next',1);
		// }else{
			$('#userMa .next-group-page').removeAttr('data-next').text('已经全部加载完了');
		//}		
	}

	function userModifySuc(e,d){
		$('.btn-user-colse').prop({'disabled':true});
		$('.btn-user-open').prop({'disabled':true});

		$.extend(userList[d.userId],d);
		var sglist = Cache.get('sizegroup');

		if(d.sizegroupId){
			userList[d.userId].size = sglist[d.sizegroupId].size;
			userList[d.userId].sizegroup.$id = d.sizegroupId;
			userList[d.userId].pre = Util.getNums(userList[d.userId].used/userList[d.userId].size)*100;
			if(userList[d.userId].size){
				userList[d.userId].size = Util.getSize(userList[d.userId].size);
			}else{
				userList[d.userId].size = 0;
			}			
		}
		if(typeof d.status != 'undefined'){
			$('#tr-user'+d.userId).attr('data-status',d.status);
		}
		var view = new View({
			target : $('#tr-user'+d.userId),
			tplid : 'manage/search.user.list.one',
			data : {
				item : userList[d.userId]
			}
		});
		view.createPanel();
	}

	//用户列表初始化
	function userInit(){
		if(isInit.user){
			nowPage = 0;
			$('#userMa').removeClass('hide');
		}else{
			$('#userMa').removeClass('hide');
			var view = new View({
				target : $('#userMa'),
				tplid : 'manage/search.user',
				data : {
					on : nowOn,
					od : nowOd
				},
				after : function(){
					isInit.user = true;
					getUser({
						page : 0
					});
				},
				handlers : {
					'.next-group-page' : {
						'click' : function(){
							var t = $(this),
								next = t.attr('data-next');
							if(next){
								getUser({
									keyword : nowKey,
									page : nowPage
								});
							}							
						}
					},
					'.user-fold' : {
						'click' : function(){
							var id = $(this).attr('data-id');
							handerObj.triggerHandler('user:getfolder',id);
						}
					},
					'.user-order' : {
						'click' : function(){
							var on = $(this).attr('data-on'),
								od = $(this).attr('data-od');
							nowOn = on;
							nowOd = od;
							nowOrder = '{"'+on+'":'+od+'}';
							reloadUser();
							var obj = {
								page : 0
							}
							getUser(obj);							
						}
					},
					'.user-data' : {
						'click' : function(){
							var id = $(this).attr('data-id');
							var sid = $(this).attr('data-sid');
							handerObj.triggerHandler('user:folderstatus',{
								id : id,
								sid : sid
							});
						}
					},
					'.user-search-key' : {
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
					'.tr-user' : {
						'click' : function(e){
							if($(e.target).hasClass('user-data') || $(e.target).hasClass('user-fold')){
								return;
							}
							//$('.btn-user-colse').prop({'disabled':false});
							nowUin = $(this).attr('data-id');
							var status = parseInt($(this).attr('data-status'));

							if(status){
								$('#userMa .btn-user-open').prop({'disabled':false});
								$('#userMa .btn-user-colse').prop({'disabled':true});
							}else{
								$('#userMa .btn-user-open').prop({'disabled':true});
								$('#userMa .btn-user-colse').prop({'disabled':false});
							}
							$('#userMa .btn-user-cpwd').prop({'disabled':false});

							$('.tr-user').removeClass('group-tr-selected');
							$(this).addClass('group-tr-selected');
							modifyUser(nowUin);
						}
					},
					'.btn-user-add' : {
						'click' : function(){
							addUser();
						}
					},
					'.btn-user-cpwd' : {
						'click' : function(){
							var obj = {
								msg : '重置该用户的密码？',
								act : {
									sub : {
										label : '重置',
										action : function(){
											handerObj.triggerHandler('user:resetpwd',nowUin);
										}
									},
									cancel : {
										label : '取消',
										action : function(){
											Messenger().hide();
										}
									}
								}
							};
							handerObj.triggerHandler('msg:config',obj);
						}
					},
					'.btn-user-newsub' : {
						'click' : function(){
							var name = $('#userName').val(),
								nick = $('#userNick').val(),
								sg = $('#userSizeGroup').val();
							if(name === '' || nick === ''){
								handerObj.triggerHandler('msg:error',22);
								return;
							}
							var obj = {
								name : name,
								nick : nick,
								sizegroupId : sg
							}
							handerObj.triggerHandler('user:create',obj);
						}
					},
					'.btn-user-open' : {
						'click' : function(){
							var obj = {
								userId : nowUin,
								status : 0
							}
							handerObj.triggerHandler('user:modify',obj);
						}
					},
					'.btn-user-colse' : {
						'click' : function(){
							var obj = {
								userId : nowUin,
								status : 1
							}
							handerObj.triggerHandler('user:modify',obj);
						}
					},
					'.btn-user-save' : {
						'click' : function(){
							var sizeid = $('.user-size-group').val();
							var nick = $('#userNick').val();
							var obj = {
								userId : nowUin,
								nick : nick,
								sizegroupId : sizeid
							}
							handerObj.triggerHandler('user:modify',obj);
						}
					},
					'.btn-reset' : {
						'click' : function(){
							var id = $(this).attr('data-id');
							if(id){
								$('.tr-user'+id).click();
							}else{
								$('#userModifyBlock').html('');
							}
						}
					},
					'.user-search-btn' : {
						'click' : function(){
							var v = $('.user-search-key').val(),
								def = $('.user-search-key').attr('data-def');
							if(v != '' && v != def){
								nowKey = v;
								reloadUser();
								var obj = {
									keyword : v,
									page : 0
								}
								getUser(obj);
							}
						}
					}

				}
			});
			view.createPanel();
		}
	}

	function statusLoad(e,d){
		isLoading = false;
		var sglist = Cache.get('sizegroup');
		d.allsize = sglist[d.sid].size;
		d.pre = Math.round(Util.getNums(d.osize/d.allsize)*100);
		var view = new View({
			target : $("#userModifyBlock"),
			tplid : 'manage/status.user',
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
				
				var plot2 = jQuery.jqplot ('userPreImg', [list],{
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

				var plot3 = jQuery.jqplot ('userPreImg1', [clist],{
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
				$('#userPreImg1').hide();
			},
			handlers : {
				'.status-size' : {
					'click' : function(){
						$(this).addClass('selected');
						$('.status-count').removeClass('selected');
						$('.preimg-zone').hide();
						$('#userPreImg').show();
					}
				},
				'.status-count' : {
					'click' : function(){
						$(this).addClass('selected');
						$('.status-size').removeClass('selected');
						$('.preimg-zone').hide();
						$('#userPreImg1').show();
					}
				},				
			}
		});
		view.createPanel();		
	}

	//部门树
	function depsInit(){
		if(isInit.deps){
			$('#deptreeMa').removeClass('hide');
		}else{
			handerObj.triggerHandler('user:deps');
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

	//用户列表
	function getuserList(list,target,pid){

		var selected = target.find('.dep-click:checked').length;
		var view = new View({
			target : target,
			tplid : 'manage/deps.user.li',
			data : {
				pid : pid,
				list : list.children,
				ulist : list.users,
				selected : selected
			}		
		});
		view.appendPanel();
	}

	function createOrg(pid,name){
		var view = new View({
			target : $('#depModifyZone'),
			tplid : 'manage/modify.dep',
			data : {
				data : false,
				pid : pid,
				pname : name
			},
			after : function(){
				$('#depsList .org-select').removeClass('hide');
			}
		});
		view.createPanel();
	}

	function modifyOrg(id,list,rid){
		if($.isEmptyObject(userList)){		
			var obj = {
				page : 0,
				nowOg : id,
				kl : list,
				rid : rid
			}
			getUser(obj);			
		}else{
			var view = new View({
				target : $('#depModifyZone'),
				tplid : 'manage/modify.dep',
				data : {
					data : list[id],
					kl : list,
					rid : rid,
					list : userList
				},
				after : function(){
					$('#depsList .org-select').removeClass('hide');
					$('.btn-org-save').attr('data-modify',1);
				}
			});
			view.createPanel();
		}
	}

	function delOrg(id){
		handerObj.triggerHandler('msg:config',{
			msg : '你确定要删除该组织，删除之后不能恢复',
			act : {
				sub : {
					label : '确定',
					action : function(){
						handerObj.triggerHandler('user:orgdel',id);
					}
				},
				cancel : {
					label : '取消'
				}
			}
		});
	}

	//add one user
	function addOneOrgUser(obj){
		handerObj.triggerHandler('msg:config',{
			msg : '你确定要添加用户'+obj.nick+'到组织中吗？',
			act : {
				sub : {
					label : '确定',
					action : function(){
						handerObj.triggerHandler('user:orguseradd',obj);
					}
				},
				cancel : {
					label : '取消'
				}
			}
		});		
	}

	//del one user
	function delOneOrgUser(obj){
		handerObj.triggerHandler('msg:config',{
			msg : '你确定要从组织中删除'+obj.nick+'吗？',
			act : {
				sub : {
					label : '确定',
					action : function(){
						handerObj.triggerHandler('user:orguserdel',obj);
					}
				},
				cancel : {
					label : '取消'
				}
			}
		});		
	}

	function addOrgUser(id,kl){
		if($.isEmptyObject(userList)){
			var obj = {
				page : 0,
				nowOg : id,
				kl : kl
			}
			getUser(obj);
		}else{
			renderOrgUser({
				nowOg : kl[id],
				list : userList
			});
		}
	}

	function renderOrgUser(d){
		var view = new View({
			target : $('#depModifyZone'),
			tplid : 'manage/user.dep',
			data : {
				data : d.nowOg,
				list : d.list
			},
			after : function(){
				$('#depsList .org-select').removeClass('hide');
				$('.btn-org-save').attr('data-modify',1);
			}
		});
		view.createPanel();
	}

	function depsLoad(e,d){
		var root = d.root;
		var kl = d.kl;
		o2key = kl;
		var view = new View({
			target : $('#deptreeMa'),
			tplid : 'manage/deps',
			after : function(){
				$('#deptreeMa').removeClass('hide');
				isInit.deps = true;
			},
			data : {
				list : d.list,
				root : d.root
			},
			handlers : {
				'.plus' : {
					'click' : function(e){
						var target = $(this),
							id = target.attr('data-id');
						var p = target.parent('li');
						if(p.find('ul').length > 0){
							//var ul = p.find('ul')[0];
							//console.log(target.attr('class'),target.hasClass("minus"));
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
							getuserList(getUList(id,d.list),p,id);
						}						
					}
				},
				'.list-link' : {
					'click' : function(e){
						var id = $(this).attr('data-id');
						var isRoot = $(this).attr('data-root');
						nowOid = id;
						if(isRoot){
							$('.btn-org-create').prop('disabled',false);
							$('#depModifyZone').html('');
							return;
						}
						//有子组织
						//console.log(kl[id].children.length);
						if(kl[id].users.length === 0){
							$('.btn-org-create').prop('disabled',false);
						}else{
							$('.btn-org-create').prop('disabled',true);
						}
						$('.btn-org-del').prop('disabled',false);
						// if(kl[id].children.length){
						// 	$('.btn-org-create').prop('disabled',false);
						// }else{
						// 	$('.btn-org-create').prop('disabled',true);
						// }
						// if(!kl[id].children.length && !kl[id].user){
						// 	$('.btn-org-del').prop('disabled',false);
						// }else{
						// 	$('.btn-org-del').prop('disabled',true);
						// }
						modifyOrg(id,kl,root);
					}
				},
				'.btn-org-create' : {
					'click' : function(){
						var id = nowOid;
						var name = '';
						if(id && kl[id]){
							name = kl[id].name;
						}else{
							name =  '根目录';
						}
						createOrg(id,name);
					}
				},
				'.btn-org-adduser' : {
					'click' : function(){
						//addOrgUser(nowOid,kl);
					}
				},
				'.btn-org-search' : {
					'keyup' : function(){
						var v = $(this).val();
					}
				},
				'.btn-org-user-search' : {
					'click' : function(){
						var val = $('#searchOrgUser').val();
						for(var i in userList){
							var item = userList[i];
							if(item.nick.indexOf(val)<0 && item.name.indexOf(val)<0){
								$('#ouser'+item.id).hide();
							}
						}
					}
				},
				'.btn-org-user-save' : {
					'click' : function(){
						var userlist = [];
						var id = $(this).attr('data-id');
						$('.org-user-list i.og-close').each(function(){
							userlist.push($(this).attr('data-id'));
						});
						var obj = {
							userId : userlist,
							organizationId : id
						}
						//handerObj.triggerHandler('user:orgusermodify',obj);
					}
				},
				'.btn-org-user-search-reset' : {
					'click' : function(){
						$('.org-user').each(function(){
							if(!$(this).attr('data-hide')){
								$(this).show();
							}
						});
					}
				},
				'.org-user' : {
					'click' : function(){
						var id = $(this).attr('data-id');
						var item = userList[id];
						var root = $('#orgUserSelectList').attr('data-root');
						if(!$('#oguser'+id).length){
							var obj = {
								userId : id,
								nick : item.nick,
								organizationId : root
							}
							addOneOrgUser(obj);
							//handerObj.triggerHandler('user:orguseradd',obj);
							//$('<li id="oguser'+id+'">'+item.nick+' <i class="dep-close og-close" data-id="'+id+'"></i></li>').appendTo('.org-user-list');
							//$(this).hide().attr('data-hide',1);
						}
					}
				},
				'.og-close' : {
					'click' : function(){
						var id = $(this).attr('data-id');
						var item = userList[id];
						var root = $('#orgUserSelectList').attr('data-root');
							var obj = {
								userId : id,
								nick : item.nick,
								organizationId : root
							}
							delOneOrgUser(obj);
							//handerObj.triggerHandler('user:orguserdel',obj);
						//$('#oguser'+id).remove();
						//$('#ouser'+id).show().removeAttr('data-hide');
					}
				},				
				'.btn-org-del' : {
					'click' : function(){
						var id = nowOid;
						delOrg(id);
					}
				},
				'.btn-org-save' : {
					'click' : function(){
						var modify = $(this).attr('data-modify') || 0;
						var name = $('#orgName').val();
						var order = $('#orgOrder').val();
						var parent = $('#orgParentId').val() || 0;
						if(order === ''){
							handerObj.triggerHandler('msg:error',10);
							return;
						}
						if(name == ''){
							handerObj.triggerHandler('msg:error',11);							
							return;
						}
						var obj = {
							name : name,
							order : parseInt(order)
						}
						if(parseInt(parent)){
							obj.parentId = parent;
						}else{
							var id = $("#orgName").attr('data-id');
							obj.parentId = root;
						}
						if(modify){
							obj.organizationId = id;
							handerObj.triggerHandler('user:orgmodify',obj);
						}else{
							handerObj.triggerHandler('user:orgcreate',obj);
						}
					}
				},
				'.btn-reset' : {
					'click' : function(){
						var id = $(this).attr('data-id');
						if(id){
							$('#org'+id).click();
						}else{
							$('#depModifyZone').html('');
						}
					}
				}	
			}
		});
		view.appendPanel();
	}

	function orgCreateSuc(e,d){
		var pid = d.parent.$id;

		d.children = [];
		d.users = [];

		o2key[d._id] = d;
		o2key[pid].children.push(d);
		var pdom = $('#org'+pid);
		pdom.find('> i').addClass('plus minus');
		var target = pdom.find('> ul');
		if(target.length === 0){
			target = $('<ul></ul>').appendTo(pdom);
		}
		var view = new View({
			target : target,
			tplid : 'manage/deps.one',
			data : {
				item : d
			}
		});
		view.appendPanel();

    // "data": {
    //   "name": "test4",
    //   "order": 1,
    //   "parent": {
    //     "$ref": "department",
    //     "$id": "539654ff05bf294863d12612",
    //     "$db": ""
    //   },
    //   "creator": {
    //     "$ref": "user",
    //     "$id": "539654ff05bf294863d12610",
    //     "$db": ""
    //   },
    //   "createTime": 1402614010256,
    //   "updateTime": 1402614010256,
    //   "_id": "539a30fa05e9492972cd8214"
    // }
	}

	function orgDelSuc(e,d){
		$('#org'+d).remove();
	}

	function orgModifySuc(e,d){
		$("#org"+d._id + ' strong').text(d.name);
	}

	function foldLoad(e,d){
		var view = new View({
			target : $('#userModifyBlock'),
			tplid : 'manage/user.fold',
			data : d
		});
		view.createPanel();
	}

	function init(type){
		
		if(type == 'user'){
			userInit();	
		}else{
			depsInit();
		}	
	}

	function delOrgUserKey(d){
		var user = o2key[d.organizationId].users;
		var tmp = [];
		for(var i=0,l=user.length;i<l;i++){
			var item = user[i];
			if(item._id !== d.userId){
				tmp.push(item);
			}
		}
		o2key[d.organizationId].users = tmp;
		console.log(o2key,d.organizationId);
	}

	//添加组织用户成功
	function addUserSuc(e,d){
		o2key[d.organizationId].users.push({
			nick : d.nick,
			_id : d.userId
		})
		$('<li id="oguser'+d.userId+'">'+d.nick+' <i class="dep-close og-close" data-id="'+d.userId+'"></i></li>').appendTo('.org-user-list');
		$('#ouser'+d.id).hide().attr('data-hide',1);
	}

	//删除组织用户成功
	function delUserSuc(e,d){
		delOrgUserKey(d);
		$('#oguser'+d.userId).remove();
		$('#ouser'+d.userId).show().removeAttr('data-hide');
	}

	var handlers = {
		'user:orgdelsuc' : orgDelSuc,
		'user:orgmodifysuc' : orgModifySuc,
		'user:orgcreatesuc' : orgCreateSuc,
		'user:listload' : userLoad,
		'user:modifysuc' : userModifySuc,
		'user:statusload' : statusLoad,
		'user:depsload' : depsLoad,
		'user:foldload' : foldLoad,
		'user:addusersuc' : addUserSuc,
		'user:delusersuc' : delUserSuc
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}

	return {
		init : init
	}
});