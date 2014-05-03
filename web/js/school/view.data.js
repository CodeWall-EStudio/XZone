define(['config','cache','helper/view','helper/request','helper/util'],function(config,Cache,View,request,Util){
	var	handerObj = $(Schhandler),
		pageNum = config.pagenum,
		isInit = false;
		nowPage = 0,
		myInfo = null;

	function showData(data){
				var list = [],
					clist = [];
				var filetype = config.filetype;
				for(var i in data.list){
					var item = data.list[i];
					list.push([filetype[item.type],item.size,item.count]);
					clist.push([filetype[item.type],item.count]);
				};
				var plot2 = jQuery.jqplot ('dataPre', [list],{
					seriesDefaults: {
						renderer: jQuery.jqplot.PieRenderer, 
						rendererOptions: {
							padding: 20, 
							fill: true,
							showDataLabels: true, 
							sliceMargin: 4, 
							lineWidth: 5
							}
						}, 
						legend: { 
							show:true, 
							location: 'e' 
						},
						cursor : {
							show: true,              //是否显示光标  
							showTooltip: true,      // 是否显示提示信息栏  
							followMouse: false,
						}
					}
				);

				var plot3 = jQuery.jqplot ('dataPre1', [clist],{
					seriesDefaults: {
						renderer: jQuery.jqplot.PieRenderer, 
						rendererOptions: {
							padding: 20, 
							fill: true,
							showDataLabels: true, 
							sliceMargin: 4, 
							lineWidth: 5
							}
						}, 
						legend: { 
							show:true, 
							location: 'e' 
						},
						cursor : {
							show: true,              //是否显示光标  
							showTooltip: true,      // 是否显示提示信息栏  
							followMouse: false,
						}
					}
				);	
				data.filetype = config.filetype;
				data.getSize = Util.getSize;
				var view = new View({
					target : $('#dataTable'),
					tplid : 'data.table',
					data : data,					
				});
				view.createPanel();
	}

	function loadData(obj){
		//汇总
			var opt = {
				cgi : config.cgi.filestatus,
				data : {
					folderId : obj
				}
			}		
			var success = function(data){
				if(data.err==0){
					showData(data.result);
					//handerObj.triggerHandler('manage:staticload', conventStatic(data.result));
				}else{
					handerObj.triggerHandler('msg:error',data.err);
				}
			}
			request.get(opt,success);		
	}

	function init(e,d){
		$('#dataTable').html('');
		$('#dataPre1').html('');
		$('#dataPre').html('');
		myInfo = Cache.get('myinfo');
		var fdid = myInfo.rootFolder.id;
		if(d.fdid){
			fdid = d.fdid;
		}
		loadData(fdid);
	}

	var handlers = {
		'data:init' : init
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}			
});