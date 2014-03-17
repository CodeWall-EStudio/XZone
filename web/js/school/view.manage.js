define(['config','helper/view','cache','model.manage','msg'],function(config,View,Cache){
	var handerObj = $(Schhandler);

	var navTarget = $('#pageNav'),
		addTarget = $('#addGroup'),
		listTarget = $('#groupList'),
		editTarget = $('#groupEdit');

	var userList,
		myid,
		g2k,
		preplist;

	function init(){
		handerObj.triggerHandler('manage:user');
		handerObj.triggerHandler('manage:alluser');
		handerObj.triggerHandler('manage:grouplist');
	}

	function userloadSuc(e,d){
		myid = d.id;
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
			},
			handlers : {
				'.btn-search' : {
					'click' : searchUser
				}
			}			
		});
		view.createPanel();			
	}

	function createSuc(e,d){
		addTarget.addClass('hide');
		listTarget.removeClass('hide');		
		var obj = d.list;
		if(obj.type == 3 && !obj.parent){
		var view = new View({
			target : $('#prepYearList'),
			tplid : 'manage.prep.year',
			data : {
				list : [obj]
			}
		});
		view.appendPanel();
		}

		var view = new View({
			target : $("#groupList"),
			tplid : 'manage.group.list',
			data : {
				list : [d.list],
				show : 0
			}			
		});
		view.appendPanel();			

	}

	function groupLoad(e,d){
		g2k = d.g2k;
		preplist = d.prep;
		if(d.school){
			$('.group-type').eq(0).attr('disabled',true);
		}
		if(d.haspt){
			$('.prep-type').attr('disabled',true);
		}
		var view = new View({
			target : $('#prepYearList'),
			tplid : 'manage.prep.year',
			data : {
				list : d.prep,
				ul : userList
			}
		});
		view.appendPanel();

		var view = new View({
			target : $("#groupList"),
			tplid : 'manage.group.list',
			data : {
				list : d.list,
				show : 1
			}			
		});
		view.createPanel();			
	}

	function appSuc(e,d){

		if(d.type == 1){
			$('.group'+d.id).html('审核通过');
		}else{
			$('.group'+d.id).html('审核不通过');
		}
	}

	function searchUser(e){
		var t = $(e.target);
		var v = t.prevAll('.search-member').val();
		var p = t.parents('td');
		if(v == ''){
			p.find('.group-members').removeClass('hide');
		}else{
			for(var i in userList){
				var item = userList[i];
				if(item.nick.indexOf(v)<0){
					p.find('.mb'+i).addClass('hide');
				}else{
					p.find('.mb'+i).removeClass('hide');
				}
			}
		}
	}


	function groupOne(e,d){
		addTarget.addClass('hide');
		listTarget.addClass('hide');
		editTarget.removeClass('hide');	
		d.ul = userList;
		d.my = myid;
		d.prep = preplist;

		//var data = g2k[id];
		var view = new View({
			target : editTarget,
			tplid : 'manage.group.edit',
			data : d,
			after : function(){
				$('#editGroupBtn').bind('click',function(){
					editgroup(d.id);
				});
			},
			handlers : {
				'.btn-search' : {
					'click' : searchUser
				}
			}
		});
		view.createPanel();
	}

	function showEdit(id){
		handerObj.triggerHandler('manage:groupinfo',id)
		// addTarget.hide();
		// listTarget.hide();
		// editTarget.show();		
		// var data = g2k[id];
		// console.log(data);
		// var view = new View({
		// 	target : editTarget,
		// 	tplid : 'manage.group.edit',
		// 	data : data,
		// });
		// view.createPanel();	
	}

	function modifySuc(){
		addTarget.addClass('hide');
		listTarget.removeClass('hide');
		editTarget.addClass('hide');
	}

	var handlers = {
		'manage:appsuc' : appSuc,
		'manage:createsuc' : createSuc,
		'manage:userloadsuc' : userloadSuc,
		'manage:alluserloadsuc' : alluserloadSuc,
		'manage:groupload' : groupLoad,
		'manage:groupinfosuc' : groupOne,
		'modifysuc' : modifySuc
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}

	$('#groupList').bind('click',function(e){
		var target = $(e.target),
			cmd = target.attr('cmd');
		
			var id = target.attr('data-id');
		
		switch(cmd){
			case 'edit':
				showEdit(id);
				break;
			case 'pass':
				handerObj.triggerHandler('manage:approve',{
					groupId:id,
					validateText : 'pass',
					validateStatus : 1
				});
			break;
			case 'notpass':
				handerObj.triggerHandler('manage:approve',{
					groupId:id,
					validateText : 'notpass',
					validateStatus : 0
				});	
			break;
		}
	});

	var editgroup = function(id){
		var name = editTarget.find('.group-name').val();
		var desc = editTarget.find('.group-desc').val();
		var members = [],
			manages = [];
		editTarget.find('.check-member:checked').each(function(){
			members.push($(this).val());
		});
		editTarget.find('.check-manage:checked').each(function(){
			manages.push($(this).val());
		});
		if(name == ''){
			handerObj.triggerHandler('msg:err',77);
			return;
		}
		var obj = {
			groupId : id,
			name : name,
			content : desc,
			members : members,
			managers : manages,
		}
		//console.log(obj);
		handerObj.triggerHandler('manage:modify',obj);				
	};

	$('#newGroupBtn').bind('click',function(e){
		var gn = $('#groupName').val(),
			type = parseInt($('.group-type:checked').val()),
			desc = $("#desc").val();


		var ul = [],
			ml = [];
		//managers
		addTarget.find(".check-member:checked").each(function(){
			ul.push($(this).val());
		});
		addTarget.find(".check-manage:checked").each(function(){
			ml.push($(this).val());
		});	
		var pid = 0,
			grade = 0,
			tag = 0,
			pt = 0;	
		if(type == 3){
			var tag =  $('.check-prep:checked');
			if(tag){
				pid = parseInt(tag.val());
			}
			if(pid){
				grade = $('.check-grade:checked').val();
				tag = $('.check-tag:checked').val();
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

		
		if(pid){
			var parent = $('.check-prepyear:checked').val();
			if(parent){
				obj.parentId = parent;
			}
			if(grade){
				obj.grade = grade;
			}
			if(tag){
				obj.tag = tag;
			}

			if(type == 3){
				if(!parent){
					alert('备课小组必须选择学年！');
					return;
				}
				if((!grade || !tag)){
					alert('备课小组必须选择年级和科目！');
					return;
				}
			}
			obj.name = config.grade[grade]+config.tag[tag];
		}else{
			if(type == 3){

			}
		}

		if(obj.name == ''){
			alert('小组名称不能为空!');
			return;
		}		
		//return ;

		handerObj.triggerHandler('manage:create',obj);
	});

	$('#aside a').bind('click',function(e){
		var target = $(e.target),
			type = target.attr('type');
		if(type == 'add'){
		addTarget.removeClass('hide');
		listTarget.addClass('hide');
		editTarget.addClass('hide');
		}else{
		addTarget.addClass('hide');
		listTarget.removeClass('hide');
		editTarget.addClass('hide');

		}
	})

	$('.group-type').bind('click',function(e){
		var v = $(this).val();
		if(v == 3){
			$('#prepYear').removeClass('hide');
			if($('.check-prep:checked').val() == 1){
				$('#prepTag').removeClass('hide');
			}
			//$('#prepTag').removeClass('hide');
		}else{
			$('#prepYear').addClass('hide');
			$('#prepTag').addClass('hide');
			$('#groupName').attr('disabled',false);
		}
	});

	$('.check-prep').bind('click',function(e){
		var v = $(this).val();
		if(v == 1){
			$('#prepTag').removeClass('hide');
			$('#groupName').attr('disabled',true);
		}else{
			$('#prepTag').addClass('hide');
			$('#groupName').attr('disabled',false);
		}
	});

	$('.check-grade').bind('click',function(e){
		var v = $(this).val();
		var tag = $('.check-tag:checked').val();
		var n = config.grade[v];
		if(tag){
			n += config.tag[v];
		}
		$('#groupName').val(n);
	});

	$('.check-tag').bind('click',function(e){
		var v = $(this).val();
		var grade = $('.check-grade:checked').val();
		var n = config.tag[v];
		if(grade){
			n = config.grade[grade] + n;
		}	
		$('#groupName').val(n);	
	});

	return {
		init : init
	}
});