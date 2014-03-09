define(['config','helper/view','cache'],function(config,View,Cache){
	var	handerObj = $(Schhandler);

	var nowGid = 0,
		nowFd = 0,
		nowPage = 0;
		action = 0,
		prepLength = 0,
		prepList = null,
		prepKey = null;

	//userPrepAside

	function init(e,d){

		if(!prepList){
			var myinfo = Cache.get('myinfo');
			prepLength = myinfo.prep.length;
			prepList = myinfo.prep;
			prepKey = myinfo.prep2key;
		}

		if(!d.gid){
			nowGid = prepList[0].id;
			nowFd = prepList[0].rootFolder.id;
		}else{
			nowGid = d.gid;
			nowFd = d.fdid;
		}
		if(!d.fdid){
			nowFd = prepKey[nowGid].rootFolder.id;
		}

		var data = {
			gid : nowGid,
			fdid : nowFd,
			info : prepKey[nowGid],
			order : d.order,
			key : d.key,
			prep : 'my'
		}
        //handerObj.triggerHandler('file:init',data);
        handerObj.triggerHandler('fold:init',data); 
        handerObj.triggerHandler('upload:param',d);		

		$('#aside .aside-divs').hide();
		var view = new View({
			target : $('#userPrepAside'),
			tplid : 'myprep.list',
			after : function(){
				$('#userPrepAside').show();
			},
			data : { 
				list : prepList,
				length : prepLength
			}
		})
		view.createPanel();
	}

	var handlers = {
		'prep:init' : init
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}
});