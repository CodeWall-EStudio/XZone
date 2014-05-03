define(['../school/config','../school/cache','../school/helper/view','model.user'],function(config,Cache,View){
	var handerObj = $(Schhandler);
	var isInit = {}, //初始化
		userList = {},
		isLoading = false;
		nowUin = 0,
		nowPage = 0,
		nowKey = '',
		pageNum = config.pagenum;

	//组织树初始化
	function despInit(){

	}

	function getUser(obj){
		obj.pageNum = pageNum;
		handerObj.triggerHandler('user:search',obj);
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
		var view = new View({
			target : $('#userList'),
			tplid : 'manage/search.user.list',
			data : d
		});
		view.appendPanel();
		if($('#tableBody tr').length < d.total){
			nowPage++;
			$('#userMa .next-group-page').attr('data-next',1);
		}else{
			$('#userMa .next-group-page').removeAttr('data-next').text('已经全部加载完了');
		}		
	}

	function userModifySuc(e,d){
		$('.btn-user-colse').prop({'disabled':true});
		$.extend(userList[d.id],d);
		var view = new View({
			target : $('#tr-user'+d.id),
			tplid : 'manage/search.user.list.one',
			data : {
				item : d
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
					'.user-data' : {
						'click' : function(){
							var id = $(this).attr('data-id');
							handerObj.triggerHandler('user:folderstatus',id);
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
							$('.btn-user-colse').prop({'disabled':false});
							nowUin = $(this).attr('data-id');
							$('.tr-user').removeClass('group-tr-selected');
							$(this).addClass('group-tr-selected');
							modifyUser(nowUin);
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
							var obj = {
								userId : nowUin,
								sizegroupId : sizeid
							}
							handerObj.triggerHandler('user:modify',obj);
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
		//console.log(d);
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
	function getuserList(list,target){

		var selected = target.find('.dep-click:checked').length;
		var view = new View({
			target : target,
			tplid : 'manage/deps.user.li',
			data : {
				list : list.children,
				ulist : list.users,
				selected : selected
			},
			after : function(){
				// target.find('.plus').unbind().bind('click',function(e){
				// 		var target = $(e.target),
				// 			id = target.attr('data-id');
				// 		var p = target.parent('li');
				// 		if(p.find('ul').length > 0){
				// 			var ul = p.find('ul')[0];
				// 			if(target.hasClass("minus")){
				// 				target.removeClass('minus');
				// 				p.find('ul').hide();
				// 			}else{
				// 				target.addClass('minus');
				// 				p.find('ul').show();
				// 			}
				// 			return;
				// 		}else{	
				// 			target.addClass('minus');
				// 			var p = target.parent('li');
				// 			getuserList(getUList(id,list.children),p);
				// 		}
				// });
			}			
		});
		view.appendPanel();
	}	

	function depsLoad(e,d){
		var view = new View({
			target : $('#deptreeMa'),
			tplid : 'manage/deps',
			after : function(){
				$('#deptreeMa').removeClass('hide');
				isInit.deps = true;
			},
			data : {
				list : d.list
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
							getuserList(getUList(id,d.list),p);
						}						
					}
				}				
			}
		});
		view.appendPanel();
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

	var handlers = {
		'user:listload' : userLoad,
		'user:statusload' : statusLoad,
		'user:depsload' : depsLoad,
		'user:foldload' : foldLoad
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}

	return {
		init : init
	}
});