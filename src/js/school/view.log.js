define(['config','cache','helper/view','helper/request','helper/util'],function(config,Cache,View,request,Util){
	var	handerObj = $(Schhandler),
		pageNum = config.pagenum,
		isInit = false;
		nowPage = 0,
		nowDate = new Date().getTime(),
		nowGid = 0,
		isLoad = false,
		logType = 0,
		logSt = 0,
		logEt = 0,
		nowType = -1;
		nowKey = '',
		myInfo = null;

	function loadLog(obj){
		if(nowKey != ''){
			obj.fileName = nowKey;
		}
		if(nowType>=0){
			obj.fromGroupType = nowType;
		}
		var opt = {
			cgi : config.cgi.logsearch,
			data : obj
		}		
		var success = function(data){
			isLoad = false;
			if(data.err==0){
				var view = new View({
					target : $('#logList'),
					tplid : 'log.list',
					data : {
						filetype : config.filetype,
						size : Util.getSize,
						list : data.result.list,
						logType : Util.logType,
						time : Util.time
					}
				});
				view.appendPanel();
				if($('#logList tr').length < data.result.total){
					nowPage++;
					$('.next-log-page').attr('data-next',nowPage).text('点击加载更多');
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
		$('#logGroupType').val(-1);
		nowPage = 0;
		nowGid = 0;
		isLoad = false;
		logType = 0;
		logSt = 0;
		logEt = 0;
		nowType = -1;
		nowKey = '';
		myInfo = Cache.get('myinfo');
		$('#logType').attr('data-type',0).text('全部');
		var obj = {
			page : 0,
			pageNum : pageNum
		}	
		if(d.gid){
			var gid = d.gid;
			nowGid = gid;
			obj.fromGroupId = gid;
			if(!myInfo.auth == 15){
				if((myInfo.group2key[gid] && !myInfo.group2key[gid].auth) && (myInfo.dep2key[gid] && !myInfo.dep2key[gid].auth)){
					obj.fromUserId = myInfo.id;
				}			
			}
		}else{
			nowGid = 0;
			obj.fromUserId = myInfo.id;
		}
		$('#logList').html('');
		if(!isLoad){
			isLoad = true;
			loadLog(obj);
		}
		if(!isInit){
			$('#logBlock .dropdown-menu li').bind('click',function(){
				$('#logType').attr('data-type',$(this).attr('data-type')).text($(this).text());
					var obj = {
						page : 0,
						pageNum : pageNum
					};		
					if(parseInt($(this).attr('data-type'))){
						obj.type = [$(this).attr('data-type')];
						logType = $(this).attr('data-type');
					}

					$('#logList').html('');
					$('.next-log-page').removeAttr('data-next');
					if(nowGid){
						obj.fromGroupId = nowGid;
					}else{
						obj.fromUserId = myInfo.id;
					}
					nowPage = 0;
					if(!isLoad){
						isLoad = true;
						loadLog(obj);
					}
			});
			
			$('.btn-log-search').bind('click',function(){
				nowKey = $('#logSearchKey').val();
				nowType = $('#logGroupType').val();
				var st = $('.log-start-time').pickmeup('get_date').getTime();
				var et = $('.log-end-time').pickmeup('get_date').getTime();
				var type = parseInt($('#logType').attr('data-type'));
				if(st == nowDate){
					st = 0;
				}
				if(et == nowDate){
					et = 0;
				}							
				if(st > et){
					alert('开始时间不能小于结束时间!');
					return;
				}
				if(st && st == et){
					alert('开始时间不能小于结束时间!');
					return;								
				}
				if(type || st || et || nowKey != '' || nowType >= 0){
					$('#logList').html('');
					$('.next-log-page').removeAttr('data-next');
					var obj = {
						page : 0,
						pageNum : pageNum									
					};
					if(type){
						obj.type = [type];
						logType = type;
					}
					if(st){
						obj.startTime = st;
						logSt = st;
					}
					if(et){
						et += 3600*24*1000;
						obj.endTime = et;
						logEt = et;
					}
					if(nowGid){
						obj.fromGroupId = nowGid;
					}else{
						obj.fromUserId = myInfo.id;
					}
					nowPage = 0;
					if(!isLoad){
						isLoad = true;
						loadLog(obj);
					}
				}else{
					return;
				}
			});

			$('.log-start-time').pickmeup({
				format  : 'Y-m-d',
				date : nowDate,
				hide_on_select : true
			});

			$('.log-end-time').pickmeup({
				format  : 'Y-m-d',
				date : nowDate,
				hide_on_select	: true
			});				
			$('.next-log-page').bind('click',function(){
				var t = $(this),
					next = t.attr('data-next');
				if(next){
					var obj = {
						page : next,
						pageNum : pageNum
					}	
					if(logType){
						obj.type = [logType];
					}
					if(logSt){
						obj.startTime = logSt;
					}
					if(logEt){
						obj.endTime = logEt;
					}					
					if(nowGid){
						obj.fromGroupId = nowGid;
					}else{
						obj.fromUserId = myInfo.id;
					}	
					if(!isLoad){
						isLoad = true;
						loadLog(obj);
					}				
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