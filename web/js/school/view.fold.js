define(['config','helper/view','model.fold'],function(config,View){
	var	handerObj = $(Schhandler);

	var nowGid = 0,
		nowGinfo = {},
		nowKey = '',
		nowFd = 0,
		nowOrder  = { 
			'createtime': 1
		},
		nextPage = 0;

	var tmpTarget = $("#fileInfoList"),
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
		target.parent('span').prev('span').text(d.mark);
	}

	function foldInit(e,d){

		tmpTarget.html('');
		if(d){
			nowGid = d.gid || 0;
			nowFd = d.fdid || 0;
			nowGinfo = d.info || {};
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

	var handlers = {
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