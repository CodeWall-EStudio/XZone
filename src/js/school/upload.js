define(['config','cache'],function(config,Cache){
	var	handerObj = $(Schhandler)
		setting = 0;

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

    // var userAgent = navigator.userAgent; 
    // if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !(userAgent.indexOf("Opera") > -1)){
    // 	upload_settings.runtimes = 'flash';
    // } 
    if (!$.support.leadingWhitespace) {
	//if ($.browser.msie) {    	
    	upload_settings.runtimes = 'flash';
    }

    // if (upload_chunk == 1) {
    //     upload_settings.chunk_size = '1mb';
    // }

	var myinfo = Cache.get('myinfo');

    function paramChange(e,d){
    	var url = config.cgi.upload+'?';
    	if(d.gid){
    		url += 'groupId='+d.gid+'&';
    	}	
    	if(d.fdid){
    		url += 'folderId='+d.fdid;
    	}

    	upload_settings.url = url;
    	
    	if(!setting){
		    $("#uploader").pluploadQueue(upload_settings).unbind('allcompleta').bind('allcomplete',function(){
		    	if($('.plupload_failed').length == 0){
		    		$('#uploadFile .close-upload').click();
		    	}
			});
		}else{
			handerObj.triggerHandler('plup:changeSet',url);
		}
		handerObj.triggerHandler('plup:sizechange',d);
		setting = 1;
    }

	handerObj.bind('upload:param',paramChange);
	
})