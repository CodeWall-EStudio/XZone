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
						'click' : function(){
							$('.btn-user-colse').prop({'disabled':true});
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

	function init(type){
		
		if(type == 'user'){
			userInit();	
		}else{
			depsInit();
		}	
	}

	var handlers = {
		'user:listload' : userLoad
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}

	return {
		init : init
	}
});