define(['config','helper/view','cache','helper/util','model.school'],function(config,View,Cache,util){
	var	handerObj = $(Schhandler);

	var nowGid = 0,
		nowFd = 0,
		nowOrder  = ['createTime',-1],
		nowKey = '',
		rootFd = 0;

	var actTarget = $('#actWinZone');

	function init(e,d){
		$('#userAside').hide();
		$("#groupAside").show();

		var myinfo = Cache.get('myinfo');
		var school = myinfo.school;

		$("#fileActZone .sharefile").hide();
		$("#fileActZone .copyfile").hide();
		if(myinfo.auth < 15){
			$('#btnZone').hide();
			$("#fileActZone").addClass('hide');
			$('.tool-zone').removeClass('hide');
			$("#fileActZone .renamefile").hide();
			$("#fileActZone .delfile").hide();
			$("#fileActZone .movefile").hide();
		}

		nowGid = school.id;
		nowFd = school.rootFolder.id;

		var view = new View({
			target : $("#groupAside"),
			tplid : 'school.aside',
			data : {
				auth : school.auth
			},
			handlers : {
				'h3' : {
					'click' : function(e){
						$("#groupAside h3").removeClass('selected');
						var cmd = $(e.target).attr('cmd');
						//console.log($(e.target).hasClass('selected'),$(e.target).attr('class'));
						if(!$(e.target).hasClass('selected')){
							$(e.target).addClass('selected');
							if(cmd=='manage'){
								d.auth = school.auth;	
							}else{
								d.auth = 0;
							}
							d.school = 1;
							
					        //handerObj.triggerHandler('file:init',d);
					        handerObj.triggerHandler('fold:init',d);
						}

					}
				}
			}		
		});
		view.createPanel();

		if(d){
			if(d.order){
				nowOrder = d.order;
			}
			nowOds = '{'+nowOrder[0]+':'+nowOrder[1]+'}';
			nowKey = d.key || '';
		}		

		d.gid = nowGid;
		if(!d.fdid){
			d.fdid = nowFd;
		}
		d.info = school;

		d.school = 1;
		d.auth = 0;

        //handerObj.triggerHandler('file:init',d);
        handerObj.triggerHandler('fold:init',d); 
        handerObj.triggerHandler('upload:param',d);		
	}

	function showApv(e,d){
		var view = new View({
			target : actTarget,
			tplid : 'file.apv',
			data : {
				name : d.name
			},
			after : function(){
				$("#actWin").modal('show');
			},
			handlers : {
				'.btn-post' : {
					'click' : function(){
						var obj = {
							fileId : d.id,
							validateText : actTarget.find('.val-text').val(),
							validateStatus : d.status
						}
						handerObj.triggerHandler('school:approv',obj);
					}
				}
			}
		});
		view.createPanel();

		var validateText;
		var validateStatus;
	}

	function apvSuc(e,d){
		$('.file'+d.fileId).remove();
	}

	var handlers = {
		'school:init' : init,
		'school:showapv' : showApv,
		'school:apvsuc' : apvSuc
	};

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}	

});