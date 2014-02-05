define(['config','model.file','helper/view'],function(config,mf,View){

	var	handerObj = $(Schhandler),
		loading = 0,
		isFrist = 1,
		nowKey = '',  //当前关键字
		nowFd = 0, //当前文件夹
		nowOd = 0,   //当前排序方式
		nowOn = 0,   //当前排序字段
		nextPage = 0, //下一页
		nowPage = 0; //当前页码

	var	fileView = new View(),
		foldView = new View(),
		foldTitView = new View();

	//var fileTarget = $('#fileList'),
	var	tableTarget = $('#tableTit'),
		searchTarget = $('#searchZone'),
		fileTarget = $('#fileInfoList'),
		pageTarget = $("#pageZone"),
		foldTarget = $('#foldList'),
		foldTitTarget = $('#sectionTit');

	var fileType = config.filetype;

	function init(){

	}

	function prep(){

	}


	function change(e,d){
		nowPage = 0;
		nowOd = 0;
		nowOn = 0;
		nowKey = '';
	}	

	var handlers = {
		'my:init' : init
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}

    $(document).on('scrollBottom',function(e){
    	if(loading){
    		return;
    	}
    	loading = 1;
    	if(nextPage){
    		pageTarget.find('a').click();
    	}
    });

});