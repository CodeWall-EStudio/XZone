define(['config','cache','helper/view','model.file'],function(config,Cache,View){

	var	handerObj = $(Schhandler),
		myInfo = null,
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

	function init(e,d){
		$('#aside .aside-divs').hide();
		$('#userAside').show();

		if(!myInfo){
			myInfo = Cache.get('myinfo');
		}
		
		$("#btnZone").show();
		$('.btn-newfold').show();
		$('.btn-upload').show();

		if(d.fdid == 0 || !d.fdid){
			d.fdid = myInfo.rootFolder.id;
		}
		d.rootfdid = myInfo.rootFolder.id;
		var obj = {};
		// if(d.fdid){
		// 	obj.fdid = d.fdid;
		// }else{
		// 	obj.fdid = d.rootfdid;
		// }
        handerObj.triggerHandler('file:init',d);
        handerObj.triggerHandler('fold:init',d);	
        handerObj.triggerHandler('upload:param',d);
	
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