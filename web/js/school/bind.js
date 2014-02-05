define(['config'],function(config){

	var	handerObj = $(Schhandler);
	var searchTarget = $('#searchKey');
	var loading = 0,
		nowFd = 0,   //当前文件夹id
		nowGid = 0,  //当前小组id
		nowPage = 'user';

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
			 		name : value
			 	});  
			 	$("#newFold .close").click();      	
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

	function gosearch(key){
		var hash = location.hash;
		if(hash.indexOf('key=')>=0){
			hash = hash.replace(/key=([^&])+/g,'key='+key);
			location.hash = hash;
		}else{
			if(hash.length<1){
				location.hash = location.hash+'key='+key;
			}else{
				location.hash = location.hash+'&key='+key;
			}
		}
	}

	//搜索框的绑定
	$('.search-key').bind('keyup',function(e){
		var target = $(this),
			def = target.attr('data-def');

		if(e.keyCode == 13){
			var v= $.trim(target.val());
			if(v != def){
				gosearch(v);
				//console.log(location.hash);
				//location.hash = location.hash+'&key='+v;
				// handerObj.triggerHandler('search:start',{
				// 	key : v
				// });
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
			gosearch(v);
			// location.hash = location.hash+'&key='+v;
			// handerObj.triggerHandler('search:start',{
			// 	key : v
			// });						
		}
	});

    //显示或者隐藏重命名和评论
    var checkAct = function(){
    	var l = $('.table-files .fclick:checked').length;

    	// $('#fileList .fdclick:checked').each(function(){
    	// 	$(this).attr('checked',false);
    	// });
	    	$('#fileActZone .sharefile').show();
	    	$('#fileActZone .downfile').show();
	    	$('#fileActZone .collfile').show();    		
	    	$('#fileActZone .copyfile').show();     	
    	if(l==0){
			$('.tool-zone').removeClass('hide');
			$('.file-act-zone').addClass('hide');
    	}else{
			$('.tool-zone').addClass('hide');
			$('.file-act-zone').removeClass('hide');
    		if(l>1){
	    		$('#renameAct').addClass('hide');
	    		$('#remarkAct').addClass('hide');
    		}else{
	    		$('#renameAct').removeClass('hide');
	    		$('#remarkAct').removeClass('hide');
    		}
    	}
    }	

    //显示或者隐藏重命名和评论
    var checkFoldAct = function(){
    	var l = $('.table-files .fdclick:checked').length;
    	// $('#fileList .fclick:checked').each(function(){
    	// 	$(this).attr('checked',false);
    	// });   	
    	if(l==0){
			$('.tool-zone').removeClass('hide');
			$('.file-act-zone').addClass('hide');
    	}else{
	    	$('#fileActZone .sharefile').hide();
	    	$('#fileActZone .downfile').hide();
	    	$('#fileActZone .collfile').hide();    		
	    	$('#fileActZone .copyfile').hide(); 
			$('.tool-zone').addClass('hide');
			$('.file-act-zone').removeClass('hide');
    		if(l>1){
	    		$('#renameAct').addClass('hide');
	    		$('#remarkAct').addClass('hide');
    		}else{
	    		$('#renameAct').removeClass('hide');
	    		$('#remarkAct').removeClass('hide');
    		}
    	}
    }  

    //删除文件和文件夹
    function deleteObj(){
    	var fid = {},
    		fdid = {};
		$('.table-files .fclick:checked').each(function(e){
			var id = $(this).val();
			fid[id] = $('.fdname'+id).text();
		});    	
		$('.table-files .fdclick:checked').each(function(e){
			var id = $(this).val();
			fdid[id] = $('.fdname'+id).text();
		});		
		handerObj.triggerHandler('file:del',{
			fl : fid,
			fd : fdid
		});
    }

    //重命名文件夹或文件
    function renameObj(){
    	if($('.table-files .fclick:checked').length > 0){
    		var id = $('.table-files .fclick:checked').val();
    		handerObj.triggerHandler('file:edit',{
    			id : id,
    			name : $('.fdname'+id).text()
    		});
    	}else{
    		var id = $('.table-files .fdclick:checked').val();
    		handerObj.triggerHandler('fold:edit',{
    			id : id,
    			name : $('.fdname'+id).text()
    		});
    	}
    }

    //批量操作按钮
    $('#fileActZone').bind('click',function(e){
		var target = $(e.target),
			cmd = target.attr('cmd');
		switch(cmd){	
			case 'rename':
				renameObj();
				break;
			case 'togroup':
				break;
			case 'toother':
				break;	
			case 'todep':
				break;	
			case 'move':
				break;
			case 'copy':
				break;
			case 'del':
				deleteObj();
				break;
			case 'cancel':
				$('.tool-zone').removeClass('hide');
				$('.file-act-zone').addClass('hide');				
				$('.table-files input:checked').each(function(){
					$(this).attr('checked',false);
				});
				break;
		}			
    });

    $('#tableTit').bind('click',function(e){
    	var target = $(e.target),
    		cmd = target.attr('cmd');
    	if(cmd == 'selectall'){
			if(target[0].checked){
				$('#fileList .liclick:not(:checked)').each(function(){
					$(this)[0].checked = true;
				});
			}else{
				$('#fileList .liclick:checked').each(function(){
					$(this).attr('checked',false);
				});
			}
			checkAct();    		
    	}
    })

	$('.table-files').click(function(e){
		var t = $(e.target),
			type = t.attr("data-type");
		if(!type){
			return;
		}
		if(type == 'file'){
			checkAct();
		}else{
			checkFoldAct();
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
			tag = 0,
			file = 0,
			cmd = target.attr('cmd');

		if(target.parents('.table-list').hasClass('table-files')){
			file = 1;
		}

		switch(cmd){
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
			default :
				if(file){
					if(!target.hasClass('liclick') && !target.hasClass('name-edit') && !target.hasClass('share-file')){
						var p = target.parents("tr");
						p.find('.liclick').click();										
					}
				}
				break;
		}
	});

	$('.page-div').bind('click',function(e){
		var target = $(e.target),
			cmd = target.attr('cmd');
		if(cmd){
			handerObj.triggerHandler('page:next');
		}
	});

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