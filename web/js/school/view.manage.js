define(['config','helper/view','cache','model.manage'],function(config,View,Cache){
	var handerObj = $(Schhandler);

	var navTarget = $('#pageNav'),
		addTarget = $('#addGroup'),
		listTarget = $('#groupList');

	var userList;

	function init(){
		handerObj.triggerHandler('manage:user');
		handerObj.triggerHandler('manage:alluser');
		handerObj.triggerHandler('manage:grouplist');
	}

	function userloadSuc(e,d){
		var view = new View({
			target : navTarget,
			tplid : 'manage.user',
			data : d,

		});
		view.createPanel();			
	}

	function alluserloadSuc(e,d){
		userList = Cache.get('alluser2key');
		var view = new View({
			target : $("#userList"),
			tplid : 'manage.userlist',
			data : {
				list : userList
			}
		});
		view.createPanel();			
	}

	function createSuc(e,d){

	}

	function groupLoad(e,d){
		console.log(d);
		var view = new View({
			target : $("#groupList"),
			tplid : 'manage.group.list',
			data : {
				list : d.list
			}			
		});
		view.createPanel();			
	}

	var handlers = {
		'manage:createsuc' : createSuc,
		'manage:userloadsuc' : userloadSuc,
		'manage:alluserloadsuc' : alluserloadSuc,
		'manage:groupload' : groupLoad
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}

	$('#newGroupBtn').bind('click',function(e){
		var gn = $('#groupNmae').val(),
			type = $('.group-type:checked').val(),
			desc = $("#desc").val();

		if(gn == ''){
			alert('小组名称不能为空!');
			return;
		}
		var ul = [],
			ml = [];
		//managers
		$(".check-member:checked").each(function(){
			ul.push($(this).val());
		});
		$(".check-manage:checked").each(function(){
			ml.push($(this).val());
		});	
		var pid = 0,
			grade = 0,
			tag = 0,
			pt = 0;	
		if(type == 3){
			var tag =  $('.check-prep:checked');
			if(tag){
				pid = tag.val();
			}
			if(pid){
				grade = $('.check-grade').val();
				tag = $('.check-tag').val();
			}
		}else if(type == 2){
			if($('.prep-type:checked').length){
				pt = 1;
			}
		}


		var obj = {
			name : gn,
			content : desc,
			type : type,
			members : ul,
			managers : ml,
		}
		if(pt){
			obj.pt = pt;
		}
		if(pid){
			obj.parentId = pid;
			if(grade){
				obj.grade = grade;
			}
			if(tag){
				obj.tag = tag;
			}
		}
		handerObj.triggerHandler('manage:create',obj);
	});

	$('.group-type').bind('click',function(e){
		var v = $(this).val();
		if(v == 3){
			$('#prepYear').removeClass('hide');
		}else{
			$('#prepYear').addClass('hide');
		}
	});

	return {
		init : init
	}
});