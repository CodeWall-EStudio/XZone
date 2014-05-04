define(['../school/config','../school/cache','../school/helper/view','../school/helper/util'],function(config,Cache,View,Util){
	var handerObj = $(Schhandler);
	var isInit = {}, //初始化
		nowSizeGroupId = 0,
		isListBind = false, //已经绑定
		isLoading = false,//正在加载
		nowPage = 0,
		nowDate = new Date().getTime(),
		pageNum = config.pagenum,
		logType = 0,
		logSt = 0,
		logEt = 0,
		nowTYpe = null;

	var manageHandler = {};

	function getObjlength(obj){
		if(!obj){
			return 0;
		}
		var i = 0;
		for(var l in obj){
			i++;
		}
		return i;
	}

	function gradeInit(){
		$('.manage-tabs').hide();	
		var grade = Cache.get('grade');
		var subject = Cache.get('subject');

		if(isInit['grade']){
			$('#gradeMange').show();
		}else{
			var view = new View({
				target : $('#manageMa'),
				tplid : 'manage/grade',
				data : {
					grade : grade,
					subject : subject
				},
				after : function(){
					isInit.grade = true;
				},
				handlers : {
					'.grade-tr' : {
						'click' : function(){
							var t = $(this),
								id = t.attr('data-id'),
								type = t.attr('data-type');

							if(type == 'grade'){
								var grade = Cache.get('grade');
								$('#addGrade').removeClass('hide');
								$('#addSubject').addClass('hide');
								$('#gradeNo').val(id);
								$('#gradeName').val(grade[id]);
								$('.btn-save-grade').attr('data-modify',1);
							}else{
								var subject = Cache.get('subject');
								$('#addSubject').removeClass('hide');
								$('#addGrade').addClass('hide');
								$('#subjectNo').val(id);
								$('#subjectName').val(subject[id]);
								$('.btn-save-sub').attr('data-modify',1);
							}
						}
					},
					'.add-grade' : {
						'click' : function(){
							$('#addGrade').removeClass('hide');
							$('#addSubject').addClass('hide');
							$('#addGrade input').val('');
							$('.btn-save-grade').removeAttr('data-modify');
													
						}
					},
					'.add-subject' : {
						'click' : function(){
							$('#addGrade').addClass('hide');
							$('#addSubject').removeClass('hide');
							$('#addSubject input').val('');
							$('.btn-save-sub').removeAttr('data-modify');	
						}
					},
					'.btn-save-grade' : {
						'click' : function(){
							var v = $.trim($('#gradeName').val());
							var n = $.trim($('#gradeNo').val());
							var modify = $(this).attr('data-modify');							
							if(v == '' || n == ''){
								handerObj.triggerHandler('msg:error',77);
								return;
							}

							if(grade){
								if(modify){
									grade[n] = v;
								}else{
									if(!grade[n]){
										grade[n] = v;
									}else{
										handerObj.triggerHandler('msg:error',79);
									}
								}
							}else{
								grade = {};
								grade[n] = v;
							}
							handerObj.triggerHandler('manage:setkey',{
								key : 'grade',
								value : grade
							});
						}
					},
					'.btn-save-sub' : {
						'click' : function(){
							var v = $.trim($('#subjectName').val());
							var n = $.trim($('#subjectNo').val());
							var modify = $(this).attr('data-modify');
							if(v == '' || n == ''){
								handerObj.triggerHandler('msg:error',77);
								return;
							}							
							if(subject){
								if(modify){
									subject[n] = v;
								}else{
									if(!subject[n]){
										subject[n] = v;
									}else{
										handerObj.triggerHandler('msg:error',79);
									}
								}
							}else{
								subject = {};
								subject[n] = v;
							}
							handerObj.triggerHandler('manage:setkey',{
								key : 'subject',
								value : subject
							})														
						}
					}
				}
			});
			view.appendPanel();
		}
	}

	function resetSize(){
		$('#sizeGroupName').val('');
		$('#defSizeGroup').prop({'checked':false});
		$('input[name=stype]').eq(0).prop({'checked':true});
		$('.size-group-val').val('');
		$('.size-type').val(1);		
	}

	function sizeInit(){
		$('.manage-tabs').hide();	
		var grade = Cache.get('grade');
		var subject = Cache.get('subject');

		if(isInit['size']){
			$('#sizeManage').show();
		}else{		
			var view = new View({
				target : $('#manageMa'),
				tplid : 'manage/size',
				after : function(){
					isInit.size = true;
					var list = Cache.get('sizegroup');
					if(list){
						handerObj.triggerHandler('manage:slistload',{
							list : list	
						})
					}else{
						isLoading = true;
						handerObj.triggerHandler('manage:sgrouplist');
					}
				},
				data : {
					list : false
				},
				handlers : {
					'.add-size-group' : {
						'click' : function(e){
							nowSizeGroupId = 0;
							$('.del-size-group').prop({'disabled':true});
							$("#addSize").removeClass('hide').removeAttr('data-modify').removeAttr('data-id');
							resetSize();
						}
					},
					'.del-size-group' : {
						'click' : function(e){
							if(nowSizeGroupId){
								if(!isLoading){
									isLoading = true;
									handerObj.triggerHandler("manage:delsgroup",{
										sizegroupId : nowSizeGroupId
									})
								}
							}
						}
					},
					'.btn-save-size' : {
						'click' : function(e){
							var modify = $(this).attr('data-modify');
							if(modify){
								id = $(this).attr('data-id');
							}
							var name = $.trim($('#sizeGroupName').val());
							var type = $('input[name=stype]:checked').val();
							var size = $('.size-group-val').val();
							var st = parseInt($('.size-type').val());
							var def = false;
							if($('#defSizeGroup:checked').length){
								def = true;
							}
							switch(st){
								case 1:
									size = size * 1024;
									break;
								case 2:
									size = size * 1024 * 1024;
									break;
								case 3:
									size = size * 1024 * 1024 * 1024;
									break;
								case 4:
									size = size * 1024 * 1024 * 1024 * 1024;
									break;									
							}
							if(name != '' && st){

							}else{
								alert('分组名和空间大小必填!');
							}
							var obj = {
								name : name,
								type : type,
								size : size,
								isDefault : def
							}
							if(modify){
								obj.sizegroupId = id;
							}
							if(!isLoading){
								isLoading = true;
								if(modify){
									handerObj.triggerHandler('manage:modifysgroup',obj);
								}else{
									handerObj.triggerHandler('manage:addsgroup',obj);
								}
							}
						}
					},
					'.size-group' : {
						'click' : function(e){
							$('.del-size-group').prop({'disabled':false});
							$('.size-group').removeClass('group-tr-selected');
							$(this).addClass('group-tr-selected');
							var id = $(this).attr('data-id');
							nowSizeGroupId = id;
							var list = Cache.get('sizegroup');

							var obj = list[id];
							if(obj){
								$('#sizeGroupName').val(obj.name);
								if(obj.type == 0){
									$('input[name=stype]').eq(0).prop({'checked':true});
								}else{
									$('input[name=stype]').eq(1).prop({'checked':true});
								}
								if(obj.isDefault){
									$('#defSizeGroup').prop({
										'checked':true
									});
								}
								if(obj.size/1024<1024){
									$('.size-group-val').val(obj.size/1024);
									$('.size-type').val(1);
								}else if(obj.size/(1024*1024)<1024){
									$('.size-group-val').val(obj.size/(1024*1024));
									$('.size-type').val(2);
								}else{
									$('.size-group-val').val(obj.size/(1024*1024*1024));
									$('.size-type').val(3);
								}
								$('#addSize').removeClass('hide');
								$('.btn-save-size').attr('data-modify',1).attr('data-id',obj.id);
							}
						}
					}
 				}
			});
			view.appendPanel();
		}
	};

	function logInit(){
		$('.manage-tabs').hide();
		if(isInit['log']){
			$('#logManage').show();
		}else{
			var view = new View({
				target : $('#manageMa'),
				tplid : 'manage/log',
				after : function(){
					isInit.log = true;
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

					handerObj.triggerHandler('manage:log',{
						page : 0,
						pageNum : pageNum
					});
				},
				handlers : {
					'.next-log-page' : {
						'click' : function(){
							//console.log(1234);
							var t = $(this),
								next = t.attr('data-next');
							if(next){
								var obj = {
									page : nowPage,
									pageNum : pageNum
								}; 
								if(logType){
									obj.type = [logType];
								}
								if(logSt){
									obj.startTime = logSt;
								}
								if(logEt){
									obj.endTime = logEt;
								}								
								handerObj.triggerHandler('manage:log',obj);
							}							
						}
					},
					'.dropdown-menu li' : {
						'click' : function(){
							$('#logType').attr('data-type',$(this).attr('data-type')).text($(this).text());
						}
					},
					'.btn-log-search' : {
						'click' : function(){
							st = $('.log-start-time').pickmeup('get_date').getTime();
							et = $('.log-end-time').pickmeup('get_date').getTime();
							var type = parseInt($('#logType').attr('data-type'));
							console.log(nowDate,st,et,$('#logType').attr('data-type'));
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
							if(type || st || et){
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
									obj.endTime = et;
									logEt = et;
								}
								handerObj.triggerHandler('manage:log',obj);																
							}else{
								return;
							}

						}
					}
				}
			});
			view.appendPanel();		
		}
	}

	function logLoad(e,d){
		var view = new View({
			target : $('#logList'),
			tplid : 'manage/log.list',
			data : {
				list : d.list,
				logType : Util.logType,
				time : Util.time
			}
		});
		view.appendPanel();
		if($('#logList tr').length < d.total){
			nowPage++;
			$('.next-log-page').attr('data-next',1);
		}else{
			$('.next-log-page').removeAttr('data-next').text('已经全部加载完了');
		}		
	}


	function dataInit(){
		$('.manage-tabs').hide();
		if(isInit.data){
			$('#allStatusBlock').show();
		}else{
			isLoading = true;
			handerObj.triggerHandler('manage:allstatic');
		}
	}

	function allStatic(e,d){
		isLoading = false;
		isInit.data = true;
		d.filetype = config.filetype;
		var view = new View({
			target : $('#manageMa'),
			tplid : 'manage/data',
			data : d,
			after : function(){
				var list = [],
					clist = [];
				var filetype = config.filetype;
				for(var i in d.fileStatistics){
					var item = d.fileStatistics[i];
					list.push([filetype[item.type],item.size,item.count]);
					clist.push([filetype[item.type],item.count]);
				}	
				var plot2 = jQuery.jqplot ('allFilePre', [list],{
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

				var plot3 = jQuery.jqplot ('allFilePre1', [clist],{
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
			}
		});
		view.appendPanel();
	}

	function init(type){
		$('#manageMa').removeClass('hide');
		switch(type){
			case 'data':
				dataInit();
				break;
			case 'log':
				logInit();
				break;
			case 'grade':
				gradeInit();
				break;
			case 'size':
				sizeInit();
				break;								
			case 'manage':
				break;					
		}
	}

	//空间组加载完成
	function sizeLoad(e,d){
		isLoading = false;
		if(d){
			var view = new View({
				target : $('#sizeGroupList'),
				tplid : 'manage/size.list',
				data : d
			});
			view.createPanel();
		}
	}

	//添加
	function addSizeGroup(e,d){
		isLoading = false;
		if(d){
			var view = new View({
				target : $('#sizeGroupList'),
				tplid : 'manage/size.list',
				data : {
					list : [d]
				}
			});
			view.appendPanel();
		}		
	}

	//修改
	function modifySizeGroup(e,d){
		isLoading = false;
		var view = new View({
			target : $('.size-group'+d.id),
			tplid : 'manage/size.list.one',
			data : d
		});
		view.createPanel();
	}

	function delSizeGroup(e,d){
		isLoading = false;
		resizeSize();
		$("#addSize").addClass('hide');
		$('.size-group'+d).remove();

	}

	//设置年级成功
	function setSuc(e,d){
		var obj = {
			tplid : 'manage/grade.list',
			data : {
				list : d.value,
				key : d.key
			}
		}

		$('#addGrade').addClass('hide');
		$('#addSubject').addClass('hide');

		if(d.key == 'grade'){
			obj.target = $('.grade-list-grade');
		}else{
			obj.target = $('.grade-list-subject');
		}
		var view = new View(obj);
		view.createPanel();

		$('#addGrade input').val('');
		$('#addSubject input').val('');
		$('.btn-save-grade').removeAttr('data-modify');
		$('.btn-save-sub').removeAttr('data-modify');
	}

	var handlers = {
		'manage:setsuc' : setSuc,
		'manage:slistload' : sizeLoad,
		'manage:sizegroupadded' : addSizeGroup,
		'manage:sizegroupmodifyed' : modifySizeGroup,
		'manage:sizegroupdeled' : delSizeGroup,
		'manage:logload' : logLoad,
		'manage:staticload' : allStatic
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}	

	return {
		init : init
	}
});