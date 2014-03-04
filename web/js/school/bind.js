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
			 	var isopen = 0;
			 	var isread = 0;
			 	if($('#newFold .check-open:checked').length > 0){
			 		isopen = 1;
			 	}
			 	if($('#newFold .check-read:checked').length > 0){
			 		isread = $('#newFold .check-read:checked').val();
			 	}

			 	var obj = {
			 		name : value,
			 		isOpen : isopen,
			 		isReadonly : isread
			 	}
			 	handerObj.triggerHandler('fold:create',obj);  
			 	$("#newFold .close").click();      	
                return false;
            }
    });		


	/***********************************/
	$('#newFold .check-open').bind('click',function(){
		if($(this)[0].checked){
			$('#newFold .read-fold').removeClass('hide');
		}else{
			$('#newFold .read-fold').addClass('hide');
		}
	})

	//收藏文件
	function coll(id,target){
		if(typeof id != 'object'){
			id = [id];
			target = [target];
		}
		handerObj.triggerHandler('file:tocoll',{fileId:id,target:target});

	}
	//取消收藏文件
	function uncoll(id,favid,target){
		if(typeof id != 'object'){
			id = [id];
			favid = [favid];
			target = [target];
		}
		handerObj.triggerHandler('file:touncoll',{id:id,favId:favid,target:target});
	}

	//下载文件
	function down(id){

	}

	//分享文件
	function shareFile(type,obj){
		//单个文件
		if(obj){
			handerObj.triggerHandler('file:share',{target:type,fl: [obj] });
		//批量
		}else{
			if($('.table-files .fclick:checked').length>0){
				var fl  = [];
				$('.table-files .fclick:checked').each(function(){
					var id = $(this).val(),
						name = $('.fdname'+id).text();
					fl.push({
						id : id,
						name : name
					})
				})

				handerObj.triggerHandler('file:share',{target:type,fl:fl});
			}
			
		}
	}

	//复制文件到目录
	function moveFile(){
			if($('.table-files .fclick:checked').length>0){
				var fl  = [];
				$('.table-files .fclick:checked').each(function(){
					var id = $(this).val(),
						fid = $(this).attr('data-fid'),
						name = $('.fdname'+id).text();
					fl.push({
						id : id,
						fid : fid,
						name : name
					})
				})

				handerObj.triggerHandler('file:move',{fl:fl});
			}
	}

	//移动文件到备课
	function copyFile(){
			if($('.table-files .fclick:checked').length>0){
				var fl  = [];
				$('.table-files .fclick:checked').each(function(){
					var id = $(this).val(),
						fid = $(this).attr('data-fid'),
						name = $('.fdname'+id).text();
					fl.push({
						id : id,
						fid : fid,
						name : name
					})
				})

				handerObj.triggerHandler('file:copy',{fl:fl});
			}
	}

	//批量下载
	function downFile(){
     	$('#downloadForm').html('');
     	var ids = [];
     	$('.fclick:checked').each(function(){
     		var flid = $(this).val();
     		ids.push(flid);
     		$('#downloadForm').append('<input name="fileId[]" type="checkbox" checked value="'+flid+'" />');
     	});
     	if(ids.length>1){
     		$('#downloadForm').submit();
     	}else{
     		if(ids[0]){
     			window.open('/api/file/download?fileId='+ids[0]);	
     		}
     	}		
	}

	//修改备注
	function editMark(id,mark,type,target){
		handerObj.triggerHandler(type+':editmark',{folderId:id,target:target,mark:mark});
	}
	/***********************************/

	//搜索
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

	$('.btn-newfold').bind('click',function(e){
		handerObj.triggerHandler('fold:createfold');
	});

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
    	}else if(cmd == 'select'){
			var tag = target.attr('data-tag');
			if(tag == 'folds'){	
				$('#fileList .fdclick').each(function(){
					$(this)[0].checked = true;
				});
				$('#fileList .fclick').each(function(){
					$(this)[0].checked = false;
				});	
				checkFoldAct();
			}else if(tag == 'files'){
				$('#fileList .fdclick').each(function(){
					$(this)[0].checked = false;
				});
				$('#fileList .fclick').each(function(){
					$(this)[0].checked = true;
				});	
				checkAct();	
			}
			    	
    	}
    })	

    //显示或者隐藏重命名和评论
    var checkAct = function(){
    	var l = $('.table-files .fclick:checked').length;
    	var n = $('.table-files .fdclick:checked').length;

    	// $('#fileList .fdclick:checked').each(function(){
    	// 	$(this).attr('checked',false);
    	// });
		if(n == 0){
	    	$('#fileActZone .sharefile').show();
	    	$('#fileActZone .downfile').show();
	    	$('#fileActZone .collfile').show();    		
	    	$('#fileActZone .copyfile').show();  
	    	$('#fileActZone .movefile').show();    	
	    }
    	if(l==0 && n == 0){
			$('.tool-zone').removeClass('hide');
			$('.file-act-zone').addClass('hide');
    	}else{
			$('.tool-zone').addClass('hide');
			$('.file-act-zone').removeClass('hide');
    		if(l>0 && n> 0){
	    		$('#renameAct').addClass('hide');
	    		$('#remarkAct').addClass('hide');
    		}else{
				if(l>1 || n> 1){
					$('#renameAct').addClass('hide');
					$('#remarkAct').addClass('hide');
				}else{
					$('#renameAct').removeClass('hide');
					$('#remarkAct').removeClass('hide');
				}
    		}
    	}
    }	

    //显示或者隐藏重命名和评论
    var checkFoldAct = function(){
    	var l = $('.table-files .fclick:checked').length;
    	var n = $('.table-files .fdclick:checked').length;
    	// $('#fileList .fclick:checked').each(function(){
    	// 	$(this).attr('checked',false);
    	// });   	
    	if(l==0 && n == 0){
			$('.tool-zone').removeClass('hide');
			$('.file-act-zone').addClass('hide');
    	}else{
    		if(n>0){
		    	$('#fileActZone .sharefile').hide();
		    	$('#fileActZone .downfile').hide();
		    	$('#fileActZone .collfile').hide();    		
		    	$('#fileActZone .copyfile').hide(); 
		    	$('#fileActZone .movefile').hide();  
	    	}else{
		    	$('#fileActZone .sharefile').show();
		    	$('#fileActZone .downfile').show();
		    	$('#fileActZone .collfile').show();    		
		    	$('#fileActZone .copyfile').show(); 
		    	$('#fileActZone .movefile').show(); 	    		
	    	} 
			$('.tool-zone').addClass('hide');
			$('.file-act-zone').removeClass('hide');
    		if(l>0 && n > 0){
	    		$('#renameAct').addClass('hide');
	    		$('#remarkAct').addClass('hide');
    		}else{
				if(l>1 || n> 1){
					$('#renameAct').addClass('hide');
					$('#remarkAct').addClass('hide');
				}else{
					$('#renameAct').removeClass('hide');
					$('#remarkAct').removeClass('hide');
				}
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
    		handerObj.triggerHandler('file:viewedit',{
    			id : id,
    			name : $('.fdname'+id).text()
    		});
    	}else{
    		var id = $('.table-files .fdclick:checked').val();
    		handerObj.triggerHandler('fold:viewedit',{
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
			case 'group':
			case 'other':
			case 'dep':
			case 'school':
				shareFile(cmd);
				break;	
			case 'downfile':
				downFile();
				break;
			case 'move':
				moveFile();
				break;
			case 'copy':
				copyFile();
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

    //title 事件绑定
    $('#sectionTit').bind('click',function(e){
    	var target = $(e.target),
    		cmd = target.attr('cmd');
    	switch(cmd){
    		case 'tree':
				if($("#foldList").attr('show')){
					$("#foldList").hide().removeAttr('show');
					$('#fileList').css('float','none').css('width','100%');
				}else{
					$("#foldList").show().css('float','left').css('width','20%').attr('show',1);
					$('#fileList').css('float','left').css('width','80%');
				}   		
    			break;
    	}
    });


    //文件和文件夹选择
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

	//文件和文件夹列表的事件代理
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
			case 'other':
			case 'group':
			case 'dep':
			case 'school':
				var id = target.attr('data-id'),
					name = target.attr('data-name'),
					obj = {
						id : id,
						name : name
					};
				shareFile(cmd,obj);
				break;	
			case 'ref': //恢复文件
				var id = target.attr('data-id');
				handerObj.triggerHandler('recy:ref',{id:[id]});
				break; 
			case 'delcomp': //从回收站彻底删除
				var id = target.attr('data-id'),
					size = target.attr('data-size');
				handerObj.triggerHandler('recy:del',{id:[id],size:[size]});
				break;				
			case 'coll':
				var id = target.attr('data-id');
				coll(id,target);
				break;
			case 'uncoll':
				var id = target.attr('data-id');
				var favid = target.attr('data-favid');
				uncoll(id,favid,target);
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
			case 'save':
				var id = target.attr('data-id');
				handerObj.triggerHandler('mail:save',id);
			case 'down':
				down(e);
				break;
			case 'pass':
				var id = target.attr('data-id'),
					name = target.attr('data-name');
				var obj = {
					id : id,
					name : name,
					status : 1
				}					
				handerObj.triggerHandler('school:showapv',obj);
				break;
			case 'notpass':
				var id = target.attr('data-id'),
					name = target.attr('data-name');
				var obj = {
					id : id,
					name : name,
					status : 0
				}
				handerObj.triggerHandler('school:showapv',obj);
				break;
			default :
				if(!target.hasClass('name-edit')){
					$('.editmark').hide();
					$('.f-mark').show();
				}
				if(file){
					if(!target.hasClass('liclick') && !target.hasClass('name-edit') && !target.hasClass('share-file') && !target.hasClass('no-act')){
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
    $('#foldList').height(wHeight-220);

    function pageChange(e,d){
    	// nowPage = d;
    	// console.log(nowPage);
		$("#foldList").hide().removeAttr('show');
		$('#fileList').css('float','none').css('width','100%');    	
    }

    var handlers = {
    	'page:change' : pageChange,
    }

    for(var i in handlers){
    	handerObj.bind(i,handlers[i]);
    }
});
