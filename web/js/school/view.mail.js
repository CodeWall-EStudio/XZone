define(['config','helper/view','model.mail'],function(config,View){
	var	handerObj = $(Schhandler);

	var nowType = 0,//我的贡献 ,1 收件 2 发件
		action = 0,//活动状态
		nextPage = 0,
		nowTotal = 0,
		nowOrder  = ['createTime',-1],
		nowOds = '',
		nowKey = '';

	var tmpTarget = $('#boxTableList'),
		stitTarget = $('#sectionTit'),
		titTarget = $("#boxtableTit");		

	function crTit(obj){
		var view = new View({
			target : stitTarget,
			tplid : 'mail.tit',
			data : {
				filetype : config.filetype,
				type : nowType,
				key : nowKey
			}
		});
		view.createPanel();
	}

	function init(e,d){
		tmpTarget.html('');

		nextPage = 0;
		nowTotal = 0;

		nowType = d.type;
		if(d.order){
			nowOrder = d.order;
		}
		nowOds = '{'+nowOrder[0]+':'+nowOrder[1]+'}';
		nowKey = d.key || '';
		crTit();

		var view = new View({
			target : titTarget,
			tplid : 'coll.table.tit',
			data : {
				order : nowOrder,
				name : 'mailbox',
				type : nowType
			}			
		});

		view.createPanel();

		handerObj.triggerHandler('mail:search',{
			keyword : nowKey,
			page:nextPage,
			pageNum : config.pagenum,
			type : nowType,
			order : nowOds
		});			

	}

	function mailGet(e,d){

	}

	function load(e,d){

		nextPage = d.next;
		nowTotal = d.total;

		if($(".file").length < nowTotal){
			nextPage = 1;
		}else{
			nextPage = 0;
		}

		var view = new View({
			target : tmpTarget,
			tplid : 'mail.list',
			data : {
				list : d.list,
				ul : d.ul,
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
		if(d == 'mail'){
			action = 1;
		}else{
			action = 0;
		}
	}

	function pageNext(e,d){
		if(!action || !nextPage){
			return;
		}
		handerObj.triggerHandler('mail:search',{
			keyword : nowKey,
			page:nextPage,
			pageNum : config.pagenum,
			type : nowType,
			order : nowOds
		});			
	}

	var handlers = {
		'page:next' : pageNext,
		'model:change' : modelChange,
		'mail:init' : init,
		'mail:get' : mailGet,
		'mail:load' : load
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}	
});