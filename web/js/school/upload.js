define(['config'],function(config){
	var	handerObj = $(Schhandler);

	$('.btn-upload').bind('click',function(){
		$('#uploadFile').slideDown(400);
		$('body').append('<div class="modal-backdrop fade in"></div>');
	});

	$('#uploadFile').bind('click',function(e){
		var t = $(e.target),
			cmd = t.attr("cmd");
		switch(cmd){
			case 'close':
				if($('#uploader_filelist .plupload_delete').length > 0){
					$('#uploadFile .modal-body').slideUp(400,function(){
						//window.location.reload();
					});
				}else if($('#uploader_filelist .plupload_uploading').length > 0){
					alert('还有文件正在上传,请等待文件上传完成再关闭上传窗口');
					return;
				}else{
					$('#uploadFile').slideUp(400);
					$('#uploader_filelist').html('');
				};
				$('.modal-backdrop').remove();
				break;
			case 'min':
				$('#uploadFile .modal-body').slideToggle(400,function(e){
					if(t.text() == '-'){
						t.text('o');
						$('.modal-backdrop').remove();
					}else{
						t.text('-');	
						$('body').append('<div class="modal-backdrop fade in"></div>');
						//plupload_uploading
					}
				});

				break;
		}
	});
	//'/cgi/gupload?gid='+nowGroupId+'&csrf_test_name='+$.cookie('csrf_cookie_name'),

	//console.log(upload_url);
    var upload_settings = {
        // General settings
        runtimes : 'html5,flash,silverlight,html4',
        url : config.cgi.upload,
        rename : true,
        dragdrop: true,

        file_data_name: 'file',

        flash_swf_url : '../../js/lib/moxie.swf',
        silverlight_xap_url : '../../js/lib/moxie.xap'
    };

    // if (upload_chunk == 1) {
    //     upload_settings.chunk_size = '1mb';
    // }

	//$.pluploadQueue.changeUrl('dddddd');

    function paramChange(e,d){
    	var url = config.cgi.upload+'?';
    	if(d.gid){
    		url += 'groupId='+d.gid+'&';
    	}	
    	if(d.fdid){
    		url += 'folderId='+d.fdid;
    	}

    	upload_settings.url = url;
    	

	    $("#uploader").pluploadQueue(upload_settings).unbind('allcompleta').bind('allcomplete',function(){
	    	console.log($('.plupload_failed').length);
	    	if($('.plupload_failed').length == 0){
	    		//window.location.reload();	
	    		//$('#uploadFile').modal('hide');
	    		$('#uploadFile .close-upload').click();
	    	}
			//
		});
    }

	handerObj.bind('upload:param',paramChange);
	
})