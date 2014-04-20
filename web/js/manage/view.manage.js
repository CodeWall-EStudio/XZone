define(['../school/config','../school/cache','../school/helper/view'],function(config,Cache,View){
	var handerObj = $(Schhandler);
	var isInit = {}, //初始化
		isListBind = false, //已经绑定
		isLoading = false,//正在加载
		nowPage = 0,
		pageNum = config.pagenum,
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

	function init(type){
		$('#manageMa').removeClass('hide');
		switch(type){
			case 'data':
				break;
			case 'log':
				break;
			case 'grade':
				gradeInit();
				break;
			case 'size':
				break;								
			case 'manage':
				break;					
		}

	}

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
		'manage:setsuc' : setSuc
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}	

	return {
		init : init
	}
});