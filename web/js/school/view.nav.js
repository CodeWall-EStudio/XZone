define(['config','model.nav','helper/view','helper/util','cache','model.manage.nav'],function(config,modelNav,View,util,Cache){

	var	handerObj = $(Schhandler),
		navTarget = $('#pageNav'),
		actTarget = $('#actWinZone'),
		actWin = $('#actWin'),		
		userasideTarget = $('#userAside'),
		userlist = null,
		nowGroup = null,
		navView = new View(),
		myView = new View();

	function init(){
		modelNav.triggerHandler('nav:init',util.getParam('ticket'));
	}

	function createSuc(e,d){
		var myinfo = Cache.get('myinfo');

		var normal = [],
			over = [];
		for(var i=0,l=myinfo.group.length;i<l;i++){
			if(myinfo.group[i].status === 2){
				over.push(myinfo.group[i]);
			}else{
				normal.push(myinfo.group[i]);
			}
		}
		over = [d.list].concat(over);
		myinfo.group = normal.concat(over);
		//myinfo.group.push(d.list);
		myinfo.group2key[d.list.id] = d.list;

		handerObj.triggerHandler('cache:set',{key: 'myinfo',data: myinfo});
		handerObj.triggerHandler('nav:load',myinfo);
	}

	function navLoad(e,d){
		var opt = {
			target : navTarget,
			tplid : 'nav',
			data : d,
			handlers : {
				'a.layout' : {
					click : function(e){
						window.location = config.cgi.logout;
					}
				},
				'.manage-one-group' : {
					click : function(e){
						var target = $(e.target),
							id = target.attr('data-id');
						handerObj.triggerHandler('nav:groupmanage',id);
					}
				},
				'.create-new-group' : {
					click : function(e){
						handerObj.triggerHandler('nav:newgroup');
					}
				}
			}
		}
		navView.expand(opt);
		navView.createPanel();		

		var opt = {
			target : userasideTarget,
			tplid : 'my.aside',
			data : d
		}
		navView.expand(opt);
		navView.createPanel();	

		var view = new View({
			target : $('#userInfoAside'),
			tplid : 'my.info',
			data : d,
			handlers : {
				'a.layout' : {
					click : function(e){
						window.location = config.cgi.logout;
					}
				}
			}			
		});
		view.createPanel();
		

		handerObj.triggerHandler('site:start');
	}

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


	function userList(list,target){
		var selected = target.find('.dep-click:checked').length;
		var data = {
			list : list.children,
			ulist : list.users,
			selected : selected
		}
		if(nowGroup){
			data.ml = nowGroup.ml;
		}
		var view = new View({
			target : target,
			tplid : 'share.user.li',
			data : data//,		
		});
		view.appendPanel();
	}		

	//添加
	function addShareUser(obj){
		//console.log(obj);
		if($('.shareUser'+obj._id).length==0){
			var view = new View({
				target : $('#groupSelectUser'),
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

	function userLoad(e,d){
		if(!userlist){
			userlist = d.list;
		}

		var data = {
			list : d.list
		},
		tplid = 'group.new';
		if(d.type == 'modify'){
			data.group = d.data;
			tplid = 'group.manage'
		}
		var view = new View({
			target : actTarget,
			tplid : tplid,
			after : function(){
				actWin.modal('show');	
			},			
			data : data,
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
						p.find('.plus').click();
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
				'.btn-post' : {
					'click' : function(){
						var name = actTarget.find('.new-group-name').val(),
							desc = actTarget.find('.new-group-desc').val(),
							members = [];
						actTarget.find('.user-click:checked').each(function(){
							members.push($(this).val());
						});
						if(name == ''){
							handerObj.triggerHandler('msg:error',77);
							return;
						}
						if(name.length < 3){
							handerObj.triggerHandler('msg:error',76);
							return;
						}
						var obj = {
							'type' : 1,
							'content' : desc,
							'members' : members
						}
						if(data.group){
						if(name != data.group.name){
							obj.name = name;
						}
						}else{
							obj.name = name;
						}
						if(d.data){
							obj.groupId = d.data.id;
						}
						if(tplid == 'group.new'){
							handerObj.triggerHandler('manage.nav:new',obj);
						}else{
							handerObj.triggerHandler('manage.nav:modify',obj);
						}
					}
				}
			}
		});
		view.createPanel();
	}


	function newGroup(e,d){
		nowGroup = null;
		if(userlist){
			handerObj.triggerHandler('nav:userload',{list:userlist,type:'new'});
		}else{
			handerObj.triggerHandler('nav:getdep',{type:'new'});
		}
	}

	function manageGroup(e,d){

		handerObj.triggerHandler('group:info',{gid:d,type:'nav'});
		
	}

	function infoSuc(e,d){
		nowGroup = d;
		if(userlist){
			handerObj.triggerHandler('nav:userload',{list:userlist,type:'modify',data:d});
		}else{
			handerObj.triggerHandler('nav:getdep',{type:'modify',data: d});
		}
	}	

	function modifySuc(e,d){
		$("#my-m-group"+d.id).text(d.name).attr('title',d.name);
		$('.group-name-tit').text(d.name);
	}

	var handlers = {
		'nav:load' : navLoad,
		'nav:newgroup' : newGroup,
		'nav:groupmanage' : manageGroup,
		'nav:userload' : userLoad,
		'nav:createsuc' : createSuc,
		'nav:infosuc' : infoSuc,
		'nav:modifysuc' : modifySuc
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}

	return {
		init : init
	}
});
