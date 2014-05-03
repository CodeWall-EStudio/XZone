define(['config','cache','helper/view','helper/request','helper/util'],function(config,Cache,View,request,Util){
	var	handerObj = $(Schhandler),
		pageNum = config.pagenum,
		isInit = false;
		nowPage = 0,
		myInfo = null;

	function loadLog(obj){
		var opt = {
			cgi : config.cgi.logsearch,
			data : obj
		}		
		var success = function(data){
			if(data.err==0){
				var view = new View({
					target : $('#logList'),
					tplid : 'manage/log.list',
					data : {
						list : data.result.list,
						logType : Util.logType,
						time : Util.time
					}
				});
				view.appendPanel();
				if($('#logList tr').length < data.result.total){
					nowPage++;
					$('.next-log-page').attr('data-next',1);
				}else{
					$('.next-log-page').removeAttr('data-next').text('已经全部加载完了');
				}
			}else{
				handerObj.triggerHandler('msg:error',data.err);
			}
		}
		request.get(opt,success);
	}

	function init(e,d){
		nowPage = 0;
		myInfo = Cache.get('myinfo');
		var obj = {
			page : 0,
			pageNum : pageNum
		}	
		if(d.gid){
			var gid = d.gid;
			obj.fromGroupId = gid;
			if(!myInfo.auth == 15){
				if((myInfo.group2key[gid] && !myInfo.group2key[gid].auth) && (myInfo.dep2key[gid] && !myInfo.dep2key[gid].auth)){
					obj.fromUserId = myInfo.id;
				}			
			}
		}else{
			obj.fromUserId = myInfo.id;
		}
		$('#logList').html('');

		loadLog(obj);
		if(!isInit){
			$('.next-log-page').bind('click',function(){
				var t = $(this),
					next = t.attr('data-next');
				if(next){
					var obj = {
						page : next,
						pageNum : pageNum,
						fromUserId : myInfo.id
					}	
					loadLog(obj);				
					// handerObj.triggerHandler('manage:log',{
					// 	page : nowPage,
					// 	pageNum : pageNum
					// });
				}				
			});
		}

	}

	var handlers = {
		'log:init' : init
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}			
});