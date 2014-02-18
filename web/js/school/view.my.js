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

		if(d.fdid == 0){
			d.fdid = myInfo.rootFolder.id;
		}
		d.rootfdid = myInfo.rootFolder.id;

<<<<<<< HEAD
		var obj = {}
		// if(d.fdid){
		// 	obj.fdid = d.fdid;
		// }else{
		// 	obj.fdid = d.rootfdid;
		// }
        handerObj.triggerHandler('file:init',d);
        handerObj.triggerHandler('fold:init',d);	
=======
		var obj = d;
		if(d.fdid){
			obj.fdid = d.fdid;
		}else{
			obj.fdid = d.rootfdid;
		}

        handerObj.triggerHandler('file:init',obj);
        handerObj.triggerHandler('fold:init',obj);	
>>>>>>> c893c56b6a9c2162d59c19190d9024b141fde8e6
        handerObj.triggerHandler('upload:param',obj);
	
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