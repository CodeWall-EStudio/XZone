define(['config'],function(config){

	var	handerObj = $(Schhandler);
	var searchTarget = $('#searchKey');
	var loading = 0,
		nowFd = 0,   //当前文件夹id
		nowGid = 0,  //当前小组id
		nowPage = 'user';


	$('.table-order').bind('click',function(e){
		var target = $(e.target),
			on = target.attr('data-on');
		if(!on){
			target = target.parent();
			on = target.attr('data-on');
		}
		if(!on){
			return;
		}
		var key = searchTarget.val(),
			def = searchTarget.attr('data-def');
		if(key == def){
			key == '';
		}
		var od = target.attr('data-od');
		var data = {};
		data[on] = od;
		handerObj.triggerHandler('order:change',{
			order : data,
			key : key
		});
	});

    $("#newFolds").validate({
            rules:{
                    foldname : {
                            required : true,
                            maxlength : 120,
                            minlength : 2
                    } 
            },
            messages:{
                    foldname : {
                            require : '请输入文件夹名称',
                            maxlength : '文件名称最长120个字',
                            minlength : '文件名称至少需要2个字'
                    }
            },
            submitHandler : function(form) { 
			 	var value = $('#foldname').val();

			 	handerObj.triggerHandler('fold:create',{
			 		name : value,
			 		fdid : nowFd,
			 		gid : nowGid
			 	});        	
                return false;
            }
    });		


	/***********************************/
	//收藏文件
	function coll(id,target){
		if(typeof id != 'object'){
			id = [id];
			target = [target];
		}
		handerObj.triggerHandler('file:coll',{id:id,gid:nowGid,target:target});

	}
	//取消收藏文件
	function uncoll(id,target){
		if(typeof id != 'object'){
			id = [id];
			target = [target];
		}
		handerObj.triggerHandler('file:uncoll',{id:id,gid:nowGid,target:target});
	}

	//下载文件
	function down(id){

	}

	//分享文件
	function share(id){

	}

	function editMark(id,mark,type,target){
		handerObj.triggerHandler(type+':edit',{id:id,gid:nowGid,target:target,mark:mark});
	}
	/***********************************/


	//搜索框的绑定
	$('.search-key').bind('keyup',function(e){
		var target = $(this),
			def = target.attr('data-def');

		if(e.keyCode == 13){
			var v= $.trim(target.val());
			if(v != def){
				handerObj.triggerHandler('search:start',{
					key : v
				});
			}
		}
	}).bind('focus',function(e){
		var target = $(this),
			val = target.val(),
			def = target.attr('data-def');

		if(val == def){
			target.val('');
		}
	}).bind('blur',function(e){
		var target = $(this),
			val = target.val(),
			def = target.attr('data-def');

		if(val == def || val == ''){
			target.val(def);
		}
	});

	$('.search-btn').bind('click',function(){
		var	def = searchTarget.attr('data-def');		
		if(v != def){
			var v= $.trim(searchTarget.val());
			handerObj.triggerHandler('search:start',{
				key : v
			});						
		}
	});


	$(".table-list").bind('click',function(e){
		var gid = $('#fileList').attr('data-gid') || 0;
		var key = $('#searchKey').val(),
			def = $('#searchKey').attr('data-def');

		if(key == def){
			key = false;
		}
		var target = $(e.target),
			cmd = target.attr('cmd');

		switch(cmd){
			case 'page': //加载更多文件
				var page = target.attr('data-page'),
					on = target.attr('data-on'),
					od = target.attr('data-od'),
					fdid = target.attr('data-fdid'),
					type = target.attr('data-type');

				pageAct(type,page,fdid,on,od,gid,key);
				break;
			case 'coll':
				var fid = target.attr('data-fid');
				coll(fid,target);
				break;
			case 'uncoll':
				var fid = target.attr('data-fid');
				uncoll(fid,target);
				break;
			case 'edit':
				$('.editmark').hide();
				target.hide();
				target.next('span').removeClass('hide').show();
				break;
			case 'editComp':
				var mark = target.prev('input').val(),
					id = target.attr('data-id'),
					type = target.attr('data-type');	
					editMark(id,mark,type,target);
					target.parent('span').prev('span').show();
					target.parent('span').addClass('hide');	
				break;
			case 'editClose':
				var mark = target.attr('data-value');
				target.prev('input').val(mark);
				target.parent('span').prev('span').show();
				target.parent('span').addClass('hide');			
				break;
			case 'down':
				down(e);
				break;
		}
	});


	//相关处理函数
	function pageAct(type,page,fdid,on,od,gid,key){
		var act = '';
		switch(type){
			case 'user':
				if(key){
					act = 'myfile:search';
				}else{
					act = 'myfile:get';
				}
				break;
			case 'prep':
				break;
			case 'group':
				break;
		}



		handerObj.triggerHandler(act,{
			page : page,
			fdid : fdid,
			on : on,
			od : od,
			gid : gid,
			key : key
		});
	}


    var scrollData = {
        scrollEl: [],
        bindScroll: function(el, eventName){
            el.on('scroll', function(){
                //check if bottom
                var scrollTop = $(this).scrollTop();
                var scrollHeight = $(this).get(0).scrollHeight;
                var height = $(this).height();
                
                if(height + scrollTop > scrollHeight - 8){
                 bottomFlag = 1;
                }else{
                 bottomFlag = 0;
                }

                if(bottomFlag){
                    el.trigger(eventName);
                    handerObj.triggerHandler('page:next');
                }
            });
        },
        push: function(el, eventName){
            this.bindScroll(el, eventName);
        }
    };

    scrollData.push($('.listDiv'), "scrollBottom");	

    var wHeight = $(window).height();
    $('.listDiv').height(wHeight-220);

    function pageChange(e,d){
    	nowPage = d;
    	console.log(nowPage);
    }

    var handlers = {
    	'page:change' : pageChange
    }

    for(var i in handlers){
    	handerObj.bind(i,handlers[i]);
    }
});