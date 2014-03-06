define(['config','helper/view','cache','model.recy'],function(config,View,Cache){

	var	handerObj = $(Schhandler);

	var nextPage = 0,
		action = 0,
		nowOrder  = ['createTime',-1],
		nowOds = '',
		nowType = 0,
		nowKey = '';	

	var tmpTarget = $('#boxTableList'),
		stitTarget = $('#sectionTit'),
		titTarget = $("#boxtableTit");

	function crTit(obj){
		var view = new View({
			target : stitTarget,
			tplid : 'recy.tit',
			data : {
				filetype : config.filetype,
				key : nowKey
			}
		});
		view.createPanel();
	}

	function init(e,d){
		var myInfo = Cache.get('myinfo');

		action = 1;
		tmpTarget.html('');
		crTit();

		nextPage = 0;

		if(d.order){
			nowOrder = d.order;
		}
		nowType = d.type;
		nowOds = '{'+nowOrder[0]+':'+nowOrder[1]+'}';
		nowKey = d.key || '';

		var view = new View({
			target : titTarget,
			tplid : 'coll.table.tit',
			data : {
				order : nowOds,
				name : 'myrecy',
				cate : 2,
				type : nowType
			}			
		});
		view.createPanel();

		handerObj.triggerHandler('recy:serach',{
			keyword : nowKey,
			page:nextPage,
			type : nowType,
			pageNum : config.pagenum,
			order : nowOds
		});			
	}

	function load(e,d){
		//nextPage = d.next;
		console.log(d);
		if($(".file").length < d.total){
			nextPage += 1;
		}else{
			nextPage = 0;
		}
		console.log(nextPage);

		var view = new View({
			target : tmpTarget,
			tplid : 'recy.list',
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
				next : nextPage
			}
		});

		pview.createPanel();		
	}

	function modelChange(e,d){
		if(d == 'recy'){
			action = 1;
		}else{
			action = 0;
		}
	}

	function pageNext(e,d){
		if(!action || !nextPage){
			return;
		}
		handerObj.triggerHandler('recy:serach',{
			keyword : nowKey,
			page:nextPage,
			type:nowType,
			pageNum : config.pagenum,
			order : nowOds
		});			
	}

	var handlers = {
		'page:next' : pageNext,
		'model:change' : modelChange,
		'recy:init' : init,
		'recy:load' : load
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}			


});