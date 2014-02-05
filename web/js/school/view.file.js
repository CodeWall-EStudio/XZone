define(['config','helper/view','model.file'],function(config,View){
	var	handerObj = $(Schhandler);

	var nowGid = 0,
		action = 0,
		nowKey = '',
		nowFd = 0,
		nowOrder  = { 
			'createtime': 1
		},
		nextPage = 0;

	var tmpTarget = $("#fileInfoList"),
		actTarget = $('#actWinZone'),
		actWin = $('#actWin'),
		tabletitTarget = $("#tableTit");

	function collSuc(e,d){
		var id = d.id,
			gid = d.gid,
			target = d.target;

		for(var i = 0,l= id.length;i<l;i++){
			$('.fav'+id[i]).addClass('s').attr('cmd','uncoll');
		}
	}

	function uncollSUc(e,d){
		var id = d.id,
			gid = d.gid,
			target = d.target;

		for(var i = 0,l= id.length;i<l;i++){
			$('.fav'+id[i]).removeClass('s').attr('cmd','coll');
		}
	}

	function marksuc(e,d){
		var target = d.target;
		target.parent('span').prev('span').text(d.mark);
	}

	function fileInit(e,d){

		action = 1;

		if(d){
			nowGid = d.gid || 0;
			nowFd = d.fdid || 0;
			if(d.order){
				nowOrder = d.order;
			}
			nowKey = d.key || '';
		}

		tmpTarget.html('');

		var view = new View({
			target : tabletitTarget,
			tplid : 'file.table',
			data : {
				order : nowOrder,
				gid : nowGid,
				fdid : nowFd
			}			
		});
		view.createPanel();

		handerObj.triggerHandler('file:serach',{
			gid:nowGid,
			keyword : nowKey,
			folderId : nowFd,
			page:nextPage,
			pageNum : config.pagenum,
			order : nowOrder
		});	
	}

	function fileLoad(e,d){

		nextPage = d.next;

		var view = new View({
			target : tmpTarget,
			tplid : 'file.user.list',
			data : {
				list : d.list,
				filetype : config.filetype,
				gid : nowGid,
				down : config.cgi.filedown
			}
		});

		view.appendPanel();	

		var pview = new View({
			target : $('#pageZone'),
			tplid : 'page',
			data : {
				next : d.next
			}
		});

		pview.createPanel();		
	}

	// function orderChange(e,d){
	// 	tmpTarget.find('.file').remove();
	// 	nowOrder = d.order;
	// 	nowKey = d.key;
	// 	nextPage = 0;
	// 	nowFd = 0;

	// 	var view = new View({
	// 		target : tabletitTarget,
	// 		tplid : 'file.table',
	// 		data : {
	// 			order : nowOrder,
	// 			gid : nowGid,
	// 			fdid : nowFd
	// 		}			
	// 	});

	// 	view.createPanel();

	// 	handerObj.triggerHandler('file:serach',{
	// 		gid:nowGid,
	// 		keyword : nowKey,
	// 		folderId : nowFd,
	// 		page:nextPage,
	// 		pageNum : config.pagenum,
	// 		order : nowOrder
	// 	});		
	// }

	function search(e,d){
		tmpTarget.find('.file').remove();
		nowKey = d.key;
		
		handerObj.triggerHandler('file:serach',{
			gid:nowGid,
			keyword : nowKey,
			folderId : nowFd,
			page:nextPage,
			pageNum : config.pagenum,
			order : nowOrder
		});			
	}

	function modelChange(e,d){
		if(d == 'file'){
			action = 1;
		}else{
			action = 0;
		}
	}

	function pageNext(e,d){
		//console.log(action,nextPage);
		if(!action || !nextPage){
			return;
		}
		handerObj.triggerHandler('file:serach',{
			gid:nowGid,
			keyword : nowKey,
			folderId : nowFd,
			page:nextPage,
			pageNum : config.pagenum,
			order : nowOrder
		});				
	}

	function fileDel(e,d){
		var view = new View({
			target : actTarget,
			tplid : 'del',
			data : d,
			after : function(){
				$("#actWin").modal('show');
			},
			handlers : {
				'.btn-del' : {
					'click' : function(){
						if(d.fl){
							handerObj.triggerHandler('file:delfiles',d.fl);
						}
						if(d.fd){
							handerObj.triggerHandler('fold:delfolds',d.fd);
						}
					}
				}
			}
		});
		view.createPanel();
	}

	function delSuc(e,d){
		var list = d.id;
		for(var i = 0,l=list.length;i<l;i++){
			$('.file'+list[i]).remove();
		}		
		if($('.file').length == 0){
			pageNext();
		}
		$('#tableTit input:checked').attr('checked',false);
	}

	function fileEdit(e,d){
		var view = new View({
			target : actTarget,
			tplid : 'modify',
			data : {
				type : 'file',
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
							handerObj.triggerHandler('file:modify',{
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
		$('.fdname'+d.fileId).text(d.name);
	}

	var handlers = {
		//'order:change' : orderChange,
		'file:modifysuc' : modifySuc,
		'file:edit' : fileEdit,
		'file:delsuc' : delSuc,
		'model:change' : modelChange,
		'search:start' : search,
		'file:del' : fileDel,
		'file:init' : fileInit,
		'file:load' : fileLoad,
		'fav:collsuc' : collSuc,
		'fav:uncollsuc' : uncollSUc,
		'file:marksuc' : marksuc,
		'page:next' : pageNext
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}
});