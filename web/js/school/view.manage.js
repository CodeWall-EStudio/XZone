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
		var view = new View({
			target : $("#groupList"),
			tplid : 'manage.group.list',
			data : {
				list : d.list
			}			
		});
		view.createPanel();			
	}

	function appSuc(e,d){
		console.log(d);
		if(d.type == 1){
			$('.group'+d.id).html('审核通过');
		}else{
			$('.group'+d.id).html('审核不通过');
		}
	}

	var handlers = {
		'manage:appsuc' : appSuc,
		'manage:createsuc' : createSuc,
		'manage:userloadsuc' : userloadSuc,
		'manage:alluserloadsuc' : alluserloadSuc,
		'manage:groupload' : groupLoad
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}

	$('#groupList').bind('click',function(e){
		var target = $(e.target),
			cmd = target.attr('cmd');
		
			var id = target.attr('data-id');
		
		switch(cmd){
			case 'pass':
				handerObj.triggerHandler('manage:approve',{
					groupId:id,
					validateText : '',
					validateStatus : 1
				});
			break;
			case 'notpass':
				handerObj.triggerHandler('manage:approve',{
					groupId:id,
					validateText : '',
					validateStatus : 0
				});	
			break;
		}
	});

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
			status : 0,
			type : type,
			members : ul,
			managers : ml,
		}
		if(pt){
			obj.pt = pt;
		}
		if(pid != 0){
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

	$('#aside a').bind('click',function(e){
		addTarget.removeClass('hide');
		listTarget.addClass('hide');
	})

	$('.group-type').bind('click',function(e){
		var v = $(this).val();
		if(v == 3){
			$('#prepYear').removeClass('hide');
		}else{
			$('#prepYear').addClass('hide');
		}
	});

	$('.check-prep').bind('click',function(e){
		var v = $(this).val();
		if(v == 1){
			$('#prepTag').removeClass('hide');
		}else{
			$('#prepTag').addClass('hide');
		}
	});

	return {
		init : init
	}
});