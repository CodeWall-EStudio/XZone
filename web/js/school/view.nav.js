define(['config','model.nav','helper/view','helper/util','cache','model.manage.nav'],function(config,modelNav,View,util,Cache){

	var	handerObj = $(Schhandler),
		navTarget = $('#pageNav'),
		actTarget = $('#actWinZone'),
		actWin = $('#actWin'),		
		userasideTarget = $('#userAside'),
		userList = null,
		navView = new View(),
		myView = new View();

	function init(){
		modelNav.triggerHandler('nav:init',util.getParam('ticket'));
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

	function userLoad(e,d){
		if(!userList){
			userList = d.list;
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
				'.act-search-input' : {
					'focus' : function(e){
						var target = $(this),
							def = target.attr('data-def');
						if(target.val() == def){
							target.val('');
						}						
					},
					'blur' : function(e){
						var target = $(this),
							def = target.attr('data-def');
						if(target.val() == ''){
							target.val(def);
						}							
					},
					'keyup' : function(e){
						if(e.keyCode == 13){
							actTarget.find('.act-search-btn').click();
						}						
					}
				},
				'.act-search-btn' : {
					'click' : function(){
					var target = actTarget.find('.act-search-input'),
						def = target.attr('data-def'),
						key = target.val();

						if(key != def){
							$('#searchResult li').removeClass('color');
							for(var i=0,l=d.list.length;i<l;i++){

								var item = d.list[i];
								
								if(item.nick.indexOf(key) >=0 ){
									$('.tag'+item.id).addClass('color');
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
						actTarget.find('input:checked').each(function(){
							members.push($(this).val());
						});
						if(name == ''){
							handerObj.triggerHandler('msg:err',77);
							return;
						}
						var obj = {
							'type' : 1,
							'content' : desc,
							'members' : members
						}
						if(name != data.group.name){
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
		if(userList){
			handerObj.triggerHandler('nav:userload',{list:userList,type:'new'});
		}else{
			handerObj.triggerHandler('nav:getuser',{type:'new'});
		}
	}

	function manageGroup(e,d){

		handerObj.triggerHandler('group:info',{gid:d,type:'nav'});
		
	}

	function infoSuc(e,d){
		if(userList){
			handerObj.triggerHandler('nav:userload',{list:userList,type:'modify',data:d});
		}else{
			handerObj.triggerHandler('nav:getuser',{type:'modify',data: d});
		}
	}	

	function createSuc(e,d){
		var myinfo = Cache.get('myinfo');
		myinfo.group.push(d.list);
		myinfo.group2key[d.list.id] = d.list;

		handerObj.triggerHandler('cache:set',{key: 'myinfo',data: myinfo});
		handerObj.triggerHandler('nav:load',myinfo);
	}

	var handlers = {
		'nav:load' : navLoad,
		'nav:newgroup' : newGroup,
		'nav:groupmanage' : manageGroup,
		'nav:userload' : userLoad,
		'nav:createsuc' : createSuc,
		'nav:infosuc' : infoSuc
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}

	return {
		init : init
	}
});