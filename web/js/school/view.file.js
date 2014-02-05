define(['config','helper/view','model.file'],function(config,View){
	var	handerObj = $(Schhandler);

	var nowGid = 0,
		nowKey = '',
		nowFd = 0,
		nowOrder  = { 
			'createtime': 1
		},
		nextPage = 0;

	var tmpTarget = $("#fileInfoList"),
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

		if(d){
			nowGid = d.gid || 0;
			nowFd = d.fdid || 0;
		}
		tmpTarget.html('');

		var view = new View({
			target : tabletitTarget,
			tplid : 'file.table',
			data : {
				order : nowOrder,
				gid : nowGid
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
		console.log(d);
		var view = new View({
			target : tmpTarget,
			tplid : 'file.user.list',
			data : {
				list : d.list,
				filetype : config.filetype
			}
		});

		view.appendPanel();	
	}

	function orderChange(e,d){
		tmpTarget.find('.file').remove();
		nowOrder = d.order;
		nowKey = d.key;
		nextPage = 0;
		nowFd = 0;

		var view = new View({
			target : tabletitTarget,
			tplid : 'file.table',
			data : {
				order : nowOrder,
				gid : nowGid
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

	function toNextPage(e,d){

		if(nextPage){

			handerObj.triggerHandler('file:serach',{
				gid:nowGid,
				keyword : nowKey,
				folderId : nowFd,
				page:nextPage,
				pageNum : config.pagenum,
				order : nowOrder
			});				
		}
	}

	var handlers = {
		'order:change' : orderChange,
		'search:start' : search,
		'file:init' : fileInit,
		'file:load' : fileLoad,
		'fav:collsuc' : collSuc,
		'fav:uncollsuc' : uncollSUc,
		'file:marksuc' : marksuc,
		'page:next' : toNextPage
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}
});