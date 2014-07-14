define(['config','helper/view','model.coll'],function(config,View){
	var	handerObj = $(Schhandler);

	var nextPage = 0,
		action = 0,
		nowOrder  = ['createTime',-1], 
		nowType = 0;
		nowOds = '',
		inReview = false,
		fileList = {},
		nowTotal = 0;
		nowKey = '';

	var tmpTarget = $('#boxTableList'),
		stitTarget = $('#sectionTit'),
		titTarget = $("#boxtableTit");

	function crTit(obj){
		var view = new View({
			target : stitTarget,
			tplid : 'coll.tit',
			data : {
				filetype : config.filetype,
				type : nowType,
				key : nowKey
			}
		});
		view.createPanel();
	}

	function init(e,d){
		nextPage = 0;
		action = 1;
		nowType = d.type;
		tmpTarget.html('');
		crTit();

		fileList = {};
		nowTotal = 0;		

		if(d.order){
			nowOrder = d.order;
		}
		nowOds = '{'+nowOrder[0]+':'+nowOrder[1]+'}';
		nowKey = d.key || '';

		var view = new View({
			target : titTarget,
			tplid : 'coll.table.tit',
			data : {
				order : nowOrder,
				name : 'mycoll',
				cate : 1
			}			
		});
		view.createPanel();

		handerObj.triggerHandler('coll:serach',{
			keyword : nowKey,
			page:nextPage,
			type:nowType,
			pageNum : config.pagenum,
			order : nowOds
		});			
	}

	function load(e,d){
		nextPage = d.next;

		nowTotal = d.total;
		for(var i in d.list){
			var item = d.list[i];
				item.id = item.fileid;
			fileList[item.fileid] = item;
		}

		if(inReview){
			returnList();
		}		

		var view = new View({
			target : tmpTarget,
			tplid : 'coll.list',
			data : {
				list : d.list,
				page : nextPage,
				ods : nowOds,
				key : nowKey,
				filetype : config.filetype
			}
		});

		view.appendPanel();

		var pview = new View({
			target : $('#boxpageZone'),
			tplid : 'page',
			data : {
				next : d.next
			}
		});

		pview.createPanel();		
	}

	function modelChange(e,d){
		if(d == 'coll'){
			action = 1;
		}else{
			action = 0;
		}
	}

	function pageNext(e,d){
		if(!action || !nextPage){
			return;
		}
		handerObj.triggerHandler('coll:serach',{
			keyword : nowKey,
			page:nextPage,
			type:nowType,
			pageNum : config.pagenum,
			order : nowOds
		});		
	}

	function getList(d){

		if(d){
			inReview = true;
			pageNext();
		}else{
			inReview = false;
			handerObj.triggerHandler('review:return',{
				list : fileList,
				total : nowTotal,
				page : nextPage
			});
		}		
		// handerObj.triggerHandler('review:return',{
		// 	list : fileList,
		// 	total : nowTotal,
		// 	page : nextPage
		// });		
	}

	var handlers = {
		'page:next' : pageNext,
		'model:change' : modelChange,
		'coll:init' : init,
		'coll:load' : load,
		'coll:getlist' : getList
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}			

});