define(['config','cache','helper/view','helper/util','model.group','view.groupprep'],function(config,Cache,View,util){
	var	handerObj = $(Schhandler);

	var nowGid = 0,
		myGroups = null,
		myInfo = null,
		nowGroup,
		nowPage = 0,
		nowData = null,
		nowFd = 0;

	var actTarget = $('#actWinZone'),
		actWin = $('#actWin'),	
		userAsideTarget = $('#userAside'),
		userPrepAsideTarget = $('#userPrepAside'),
		groupAsideTarget = $('#groupAside'),
		groupPrepAsideTarget = $('#groupPrepAside');

	var tmpTarget = $('#boxTableList'),
		stitTarget = $('#sectionTit'),
		titTarget = $("#boxtableTit");		

	function init(e,d){

		nowGid = d.gid;
		nowFd = d.fdid || 0;
		nowData = d;
		if(!myGroups){
			myInfo = Cache.get('myinfo'),
			myGroups = myInfo.group2key;
		}
		nowGroup = myGroups[nowGid];

			$("#fileActZone .renamefile").show();
			$("#fileActZone .delfile").show();
			$("#fileActZone .movefile").show();		

		if(nowGroup.isMember){
			$("#btnZone").show();
			//$('.btn-upload').show();
		}else{
			$("#btnZone").hide();
		}
		// handerObj.triggerHandler('group:init',myGroups[nowGid]);
		if(myGroups[nowGid]){
			//handerObj.triggerHandler('group:info',{gid:nowGid,type:'group'});
			handerObj.triggerHandler('group:infosuc',myGroups[nowGid]);
		}else{
			handerObj.triggerHandler('msg:error',1010);
		}
	}

	function groupAside(){
		var view = new View({
			target : groupAsideTarget,
			tplid : 'group.aside',
			data : nowGroup,
			handlers : {
				'.group-desc-edit' : {
					'click' : function(e){
						$('#groupEdit').removeClass('hide');
						$("#groupDesc").addClass('hide');
					}
				},
				'.group-desc-save' : {
					'click' : function(e){
						var desc = $('#groupEdit textarea').val();
						handerObj.triggerHandler('group:edit',{
							groupId : nowGid,
							content : desc,
							type : 1
						});
						$('#groupEdit').addClass('hide');
						$("#groupDesc").removeClass('hide');						
					}
				},
				'.group-desc-esc' : {
					'click' : function(e){
						$('#groupEdit').addClass('hide');
						$("#groupDesc").removeClass('hide');
					}
				} 
			}
		});
		view.createPanel();
	}

	function showAside(d){

		if(!myGroups){
			myInfo = Cache.get('myinfo'),
			myGroups = myInfo.group2key;
		}
		nowGroup = myGroups[d.id];

		var data = {
			gid : d.id,
			fdid : d.rootFolder.id,
			info : d
		}
		if(!nowData){
			nowData = {};
		}
		nowData.info = d;
		if((nowFd == 0 || !nowFd) && d.rootFolder){
			nowData.fdid = d.rootFolder.id || d.rootFolder.$id;
		}
		nowData.rootfdid = d.rootFolder.id || d.rootFolder.$id;

		$('#aside .aside-divs').hide();	
		
		groupAsideTarget.show();
		groupAside();

		if(!d.pt){
			handerObj.triggerHandler('group:board',{
				groupId : d.id,
				pageNum : 10,
				order : '{crateTime:-1}',
				page : 0,
				type : 1
			});
		}			
	}

	function info(e,d){
		var data = {
			gid : nowGid,
			fdid : nowFd,
			info : d
		}
		if(d.recy){
			showAside(d);
			return;
		}
		nowData.info = d;

		if((nowFd == 0 || !nowFd) && d.rootFolder){
			nowData.fdid = d.rootFolder.id || d.rootFolder.$id;
		}
		nowData.rootfdid = d.rootFolder.id || d.rootFolder.$id;

		$('#aside .aside-divs').hide();
		switch(d.type){
			case 0:
				break;
			case 1:
			case 2:
				groupAsideTarget.show();
				groupAside();
				if(!d.pt){
					handerObj.triggerHandler('group:board',{
						groupId : nowGid,
						pageNum : 10,
						order : '{crateTime:-1}',
						page : 0,
						type : 1
					});
				}
				break;
			case 3:
				break;
		}
		if(d.pt){
			nowData.prep = 'group';
			handerObj.triggerHandler('groupprep:init',nowData);
		}else{
	        //handerObj.triggerHandler('file:init',nowData);
	        handerObj.triggerHandler('fold:init',nowData); 
	        handerObj.triggerHandler('upload:param',nowData);
    	}
	}

	function newBoard(){
		var view = new View({
			target : actTarget,
			tplid : 'board.new',
			after : function(){
				$("#actWin").modal('show');
			},
			handlers : {
				'.btn-post' : {
					'click' : function(){
						var desc = $.trim(actTarget.find('textarea').val());
						if(desc != ''){
							handerObj.triggerHandler('board:new',{
								groupId : nowGid,
								content : desc,
								type : 1
							});
						}
					}
				}
			}
		});
		view.createPanel();
	}

	function boardAsideSuc(e,d){
		// $('#groupBoard').data('list',d.list);
		var target,
			tpl;
			target = $('#groupBoard');
			tplid = 'group.board';
		var view = new View({
			target : target,
			tplid : tplid,
			data : {
				list : d.list,
				auth : nowGroup.auth
			},
			handlers : {
				'.group-post-board' : {
					'click' : function(){
						newBoard();
					}
				},
				'.show-all-board' : {
					'click' : function(){
						handerObj.triggerHandler('board:init',{gid : nowGid});
					}	
				}
			}
		});
		view.createPanel();
	}

	function updateGroup(d){
		myInfo.group2key[d.id] = d;
		handerObj.triggerHandler('cache:set',{key: 'myinfo',data: myInfo});
	}

	function modifySuc(e,d){
		updateGroup(d);
		var info = d,
			desc = d.content;
		if(info.content == ''){
			desc = '暂无公告'
		}
		$("#groupDesc p").html(util.transStr(desc));
	}

	function boardasideaddSuc(e,d){
		var view = new View({
			target : $('#groupBoard').find('ul'),
			tplid : 'group.boardone',
			data : d
		});
		view.beginPanel();		
	}

	function boardInit(e,d){

		var view = new View({
			target : actTarget,
			tplid : 'board.all',
			after : function(){
				$("#actWin").modal('show');
				handerObj.triggerHandler('group:board',{
					groupId : nowGid,
					pageNum : 10,
					page : 0
				});	

				actTarget.find('.board-list').on('scroll',function(){
	                var scrollTop = $(this).scrollTop();
	                var scrollHeight = $(this).get(0).scrollHeight;
	                var height = $(this).height();
	                
	                if(height + scrollTop > scrollHeight - 8){
	                	actTarget.find('.page-zone').click();
	                }
				});

				actTarget.bind('click',function(e){
					var target = $(e.target),
						cmd = target.attr('cmd');
					if(cmd == 'del'){
						var id = target.attr('data-id');
						handerObj.triggerHandler('board:del',{
							boardId : id,
							target : target
						});
					}
				})
			},
			handlers : {
				'.btn-post' : {
					'click' : function(){
						var desc = actTarget.find('.board-input').val();
						if(desc != ''){
							handerObj.triggerHandler('board:new',{
								groupId : nowGid,
								content : desc
							});
						}						
					}
				},
				'.search-btn' : {
					'click' : function(){
						var target = actTarget.find('.search-input'),
							key = $.trim(target.val()),
							def = target.attr('data-def');
						//if(key != def){
							if(key == def){
								key = '';
							}
							handerObj.triggerHandler('group:board',{
								groupId : nowGid,
								keyword : key,
								pageNum : 10,
								page : 0
							});
						//}

					}
				},
				'.search-input' : {
					'focus' : function(){
						var target = $(this),
							def = target.attr('data-def');
						if(target.val() == def){
							target.val('');
						}
					},
					'blur' : function(){
						var target = $(this),
							def = target.attr('data-def');
						if(target.val() == ''){
							target.val(def);
						}	
					},
					'keyup' : function(){
						if(e.keyCode == 13){
							actTarget.find('.search-btn').click();
						}						
					}
				},
				'.page-zone' : {
					'click' : function(){
						var target = $(this),
							next = target.attr('data-next'),
							keyword = target.attr('data-key');

						if(next){
							var obj = {
								groupId : nowGid,
								pageNum : 10,
								page : next
							}
							if(keyword){
								obj.keyword = keyword;
							}
							handerObj.triggerHandler('group:board',obj);
						}
					}
				}
			}
		});
		view.createPanel();
	}

	function boardaddSuc(e,d){

		var view = new View({
			target : $("#boardList"),
			tplid : 'board.list',
			data : {
				list : [d],
				auth : nowGroup.auth
			}
		});
		view.beginPanel();	
	}

	function boardlistSuc(e,d){
		// if(!d.list.length){
		// 	//return;
		// }
		
		var view = new View({
			target : $("#boardList"),
			tplid : 'board.list',
			after : function(){
				if(d.keyword && d.next){
					actTarget.find('.page-zone').text('更多文件').attr('data-key',d.keyword);
				}
			},
			data : {
				list : d.list,
				auth : nowGroup.auth
			}
		});
		var oldkey = actTarget.find('.page-zone').attr('data-key');
		if(oldkey == d.keyword){
			view.appendPanel();
		}else{
			view.createPanel();			
		}
		
	}

	function delSuc(e,d){
		var target = d.target;
		target.parent('li').remove();
	}

	var handlers = {
		'group:boarddelsuc' : delSuc,
		'group:boardaddsuc' : boardaddSuc,
		'board:init' : boardInit,
		'board:asidelistsuc' : boardAsideSuc,
		'group:boardasideaddsuc' : boardasideaddSuc,
		'group:init' : init,
		'group:modifySuc' : modifySuc,
		'group:infosuc' : info,
		'board:listsuc' : boardlistSuc
	}	

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}
});