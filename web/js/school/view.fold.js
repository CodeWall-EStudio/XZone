define(['config','helper/view','model.fold'],function(config,View){
	var	handerObj = $(Schhandler);

	var nowGid = 0,
		action = 0,
		nowGinfo = {},
		nowFdInfo = {},
		nowKey = '',
		nowFd = 0,
		nowOrder  = { 
			'createtime': 1
		},
		nextPage = 0;

	var tmpTarget = $("#fileInfoList"),
		actTarget = $('#actWinZone'),
		actWin = $('#actWin'),	
		titTarget = $('#sectionTit');

	function crTit(obj){
		var view = new View({
			target : titTarget,
			tplid : 'file.tit',
			data : {
				gid : nowGid,
				gname : nowGinfo.name || '',
				filetype : config.filetype,
				key : nowKey,
				fold : obj || 0
			}
		});
		view.createPanel();
	}

	function marksuc(e,d){
		var target = d.target;
		if(target){
			target.parent('span').prev('span').text(d.mark);
		}
	}

	function foldInit(e,d){
		action = 1;

		tmpTarget.html('');
		nowFdInfo = {};
		if(d){
			nowGid = d.gid || 0;
			nowGinfo = d.info || {};
			nowFd = nowGinfo.rootfold || d.fdid || 0;
			nowKey = d.key || '';
		}
		if(!nowFd){
			crTit();
		}else{
			handerObj.triggerHandler('fold:one',{
				fdid:nowFd,
				gid : nowGid
			});	
		}

		handerObj.triggerHandler('fold:get',{
			gid:nowGid
		});		
	}

	function foldOne(e,d){
		//console.log(d,nowFd);
		nowFdInfo = d;
		crTit(d);
	}

	function foldLoad(e,d){
		var view = new View({
			target : tmpTarget,
			tplid : 'fold.user.list',
			data : {
				list : d.list,
				gid : nowGid
			}
		});

		view.beginPanel();		
	}

	function orderChange(e,d){
		tmpTarget.find('.fold').remove();
		nowOrder = d.order;
		nowKey = d.key;
		nextPage = 0;
		nowFd = 0;
		handerObj.triggerHandler('fold:search',{
			gid:nowGid,
			keyword : nowKey,
			folderId : nowFd,
			page:nextPage,
			pageNum : config.pagenum,
			order : nowOrder
		});	
	}

	function search(e,d){
		tmpTarget.find('.fold').remove();
		nowKey = d.key;
		
		handerObj.triggerHandler('fold:serach',{
			gid:nowGid,
			keyword : nowKey,
			folderId : nowFd,
			page:nextPage,
			pageNum : config.pagenum,
			order : nowOrder
		});			
	}	

	function createFold(e,d){
		var data = {
			gid : nowGid,
			fdid : nowFd,
			name : d.name
		}
		handerObj.triggerHandler('fold:new',data);1
	}

	function delSuc(e,d){
		var list = d.id;
		for(var i = 0,l=list.length;i<l;i++){
			$('.fold'+list[i]).remove();
		}
	}

	function foldEdit(e,d){
		var view = new View({
			target : actTarget,
			tplid : 'modify',
			data : {
				type : 'fold',
				name : d.name
			},
			after : function(){
				$("#actWin").modal('show');
			},
			handlers : {
				'.btn-modify' : {
					'click' : function(){
						var n = actTarget.find('.obj-name').val();
						if(n != ''){
							handerObj.triggerHandler('fold:modify',{
								fileId : d.id,
								groupId : nowGid,
								name : n
							});
						}
					}
				}
			}
		});
		view.createPanel();			
	}

	function modifySuc(e,d){
		console.log(d.fileId,d.name);
		$('.fdname'+d.fileId).text(d.name);
	}

	var handlers = {
		'fold:modifysuc' : modifySuc,
		'fold:edit' : foldEdit,
		'fold:delsuc' : delSuc,
		'fold:create' : createFold,
		'order:change' : orderChange,
		'search:start' : search,
		'fold:marksuc' : marksuc,
		'fold:init' : foldInit,
		'fold:load' : foldLoad,
		'fold:oneinfo' : foldOne
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}
});