define(['config','helper/view','cache','helper/util'],function(config,View,Cache,util){
	var	handerObj = $(Schhandler);

	var nowGid = 0,
		nowFd = 0,
		nowOrder  = ['createTime',-1],
		nowKey = '',
		rootFd = 0;

	function init(e,d){
		var myinfo = Cache.get('myinfo');
		var school = myinfo.school;
		nowGid = school.id;
		nowFd = school.rootFolder.id;
		if(d){
			if(d.order){
				nowOrder = d.order;
			}
			nowOds = '{'+nowOrder[0]+':'+nowOrder[1]+'}';
			nowKey = d.key || '';
		}		

		d.gid = nowGid;
		d.fdid = nowFd;
		d.info = school;

        handerObj.triggerHandler('file:init',d);
        handerObj.triggerHandler('fold:init',d); 
        handerObj.triggerHandler('upload:param',d);		
	}

	var handlers = {
		'school:init' : init
	};

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}	

});