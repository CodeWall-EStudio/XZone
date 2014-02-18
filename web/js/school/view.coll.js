define(['config','helper/view','model.coll'],function(config,View){
	var	handerObj = $(Schhandler);

	var nextPage = 0,
		action = 0,
		nowOrder  = ['createtime',1], 
		nowOds = '',
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
				key : nowKey
			}
		});
		view.createPanel();
	}

	function init(e,d){
		action = 1;
		tmpTarget.html('');
		crTit();

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
				name : 'mycoll'
			}			
		});
		view.createPanel();

		handerObj.triggerHandler('coll:serach',{
			keyword : nowKey,
			page:nextPage,
			pageNum : config.pagenum,
			order : nowOds
		});			
	}

	function load(e,d){
		nextPage = d.next;
		var view = new View({
			target : tmpTarget,
			tplid : 'coll.list',
			data : {
				list : d.list,
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
			pageNum : config.pagenum,
			order : nowOds
		});		
	}

	var handlers = {
		'page:next' : pageNext,
		'model:change' : modelChange,
		'coll:init' : init,
		'coll:load' : load
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}			

});