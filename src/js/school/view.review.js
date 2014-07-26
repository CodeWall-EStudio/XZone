require(['config','helper/util','helper/request','helper/view','model.review','msg'], function(config,util,request,View,Review) {

	var handerObj = $(Schhandler);
	var nowType = null;
	var isInit = false,
		isShow = false;
    var isMove = false; //切换预览
    var isInit = false; //是否已经初始化		
	var nowId = null;
	var nowTotal = 0,
		nowPage = 0,
		isLoading = false,
		nowLength = 0;
	var nowType = null;
	var mail = null,
		cate = null,
		coll = null;

	var nowList = {};

	var bgsTarget = $("#reviewBgs"),
		revTarget = $('#reviewWin'),
		blockTarget = null,
		listTarget = null;

    //节流
    function lockMove(){
      isMove = true;
      setTimeout(function(){
        isMove = false;
      },500);
    }


	function showTarget(){
		//revTarget.html('');
		bgsTarget.show();
		revTarget.show();
	}

	function hideTarget(){
		isShow = false;
		bgsTarget.hide();
		revTarget.hide();		
	}

	function show(e,d){
		//console.log(d);
		nowId = d.id;
		nowPage = 0;
		mail = false;
		cate = false;
		coll = false;
		if(d.type){
			switch(d.type){
				case 'mail':
					mail = true;
					break;
				case 'cate':
					cate = true;
					break;
				case 'coll':
					coll = true;
					break;
			}
			nowType = d.type;
		}else{
			nowType = 'file';
		}
		nowList = {};
		showTarget();

		handerObj.triggerHandler(nowType+':getlist');
	}

	function getIdx(){
          var t = $("#reviewBlock li");
          var l = $("#reviewBlock li").length;
          var idx = 0;
          $("#reviewBlock li").each(function(i){
            if($(this).hasClass('selected')){
              idx = i;
            }
          });		
          return idx;
	}

	function getNextId(){
		var idx = getIdx();
		var list = $("#reviewBlock li");
		var l = list.length;
		if(idx < l-1){
			idx++;
			return list.eq(idx).attr('data-id');
		}else{
			return 0;
		}
	}

	function getPrevId(){
		var idx = getIdx();
		var list = $("#reviewBlock li");
		var l = list.length;
		if(idx > 0){
			idx--;
			return list.eq(idx).attr('data-id');
		}else{
			return 0;
		}
	}


    function getFile(id){
    	var item = nowList[id];
    	nowId = id;
		if(item.type === 8){
			//getFile(nowId);
	        var to = {};
	        if(mail){
	          to.messageId = id;
	        }else{
	          to.fileId = id;
	        }						
	        $.get(config.cgi.filereview,to,function(d){
	          item.text = d;
	          render(item);
	        },'text');						
		}else{
			render(item);			
		}
		if(!isShow){
			renderList();	
			isShow = true;
		}
    }	

    //从各个模块拿到数据了.
	function listLoad(e,d){
		isLoading = false;
		nowList = d.list;   //文件列表
		nowTotal = d.total; //文件总数
		nowPage = d.page;  //当前在第几页了.
		if(isInit){
			render(nowList[nowId]);
			renderList();
			isShow = true;
		}else{
			var view = new View({
				target : revTarget,
				tplid : 'review.div',
				after : function(){
					blockTarget = $('#reviewDiv');
					listTarget = $('#reviewBlock');
				
					$('body').bind('keyup',function(e){
						if(e.keyCode===27){
							hideTarget();
						}
					});				

					getFile(nowId);
				},
				handlers : {
					'.review-close' : {
						'click' : function(){
							hideTarget();
						}
					},
			          '.ar-arrow' : {
			          	'click' : function(){
			              if(isMove){
			                return;
			              }
			              lockMove();
			              var id = getNextId();
			              if(id){
			              	getFile(id);
			              	$("#reviewBlock li").removeClass('selected');
			              	$('#review'+id).addClass('selected');
			              }else{
			                  	handerObj.triggerHandler('msg:show',{
				                    type: 'error',
				                    msg : '已经是最后文件了!'
				                });	              		
			              }

			          	}
			          },
			          '.al-arrow' : {
			          	'click' : function(){
			              if(isMove){
			                return;
			              }
			              lockMove();
			              var id = getPrevId();
			              if(id){
			              	getFile(id);
			              	$("#reviewBlock li").removeClass('selected');
			              	$('#review'+id).addClass('selected');
			              }else{
			                  	handerObj.triggerHandler('msg:show',{
				                    type: 'error',
				                    msg : '已经是第一个文件了!'
				                });
			              }	              
			          	}
			          },
			        '.al-arrow-p' : {
			        	'click' : function(){
			              if(isMove){
			                return;
			              }
			              lockMove();
			              prevPage();
			        	}
			        },
			        '.ar-arrow-p' : {
			        	'click' : function(){
			              if(isMove){
			                return;
			              }
			              lockMove();
			              nextPage();			        		
			        	}
			        }
				}
			});
			view.createPanel();
		}
	}

	//下一个文件
	function nextPage(){
		if(isLoading){
          	handerObj.triggerHandler('msg:show',{
                type: 'error',
                msg : '正在努力加载中,请稍等!'
            });	  			
			return;
		}
		//还有下一页数据
		if(nowLength < nowTotal){
			isLoading = true;
			handerObj.triggerHandler(nowType+':getlist',true);
		//已经有全部数据了.
		}else{
			var t = $('#reviewFileList');
			var w = $('.review-list-block').width();

			var tn = Math.ceil(w/48);

			var rw = t.width();
			var ml = t.css('marginLeft');
			ml = parseInt(ml.replace('px',''));
			if(w<rw){
				if(ml <= 0 && Math.abs(ml-tn*48)<rw){
					t.css('marginLeft',ml-tn*48+'px');
				}else{

				}
			}

		}
	}

	//上一个文件
	function prevPage(){
		console.log('prev');
		var t = $('#reviewFileList');
		var w = $('.review-list-block').width();
		var rw = t.width();
		var ml = t.css('marginLeft');
		ml = parseInt(ml.replace('px',''));
		if(w<rw){
			var t = $('#reviewFileList');
			var w = $('.review-list-block').width();

			var tn = Math.ceil(w/48);

			var rw = t.width();
			var ml = t.css('marginLeft');
			ml = parseInt(ml.replace('px',''));
			console.log(ml,Math.abs(ml-tn*48)<rw);
			if(ml < -tn*48){
				t.css('marginLeft',ml+tn*48+'px');
			}else{
				t.css('marginLeft','0px');
			}

		}
	}

	//计算是否有下一页等等
	function checkPage(){
		var w = $('.review-list-block').width();
		//var nowFileLength = $('#reviewFileList li').length;
		//if(w>=48*nowLength){
			var idx = getIdx();
			if(idx*48>w){

			}else{
				$('.al-arrow-p').attr('disable','disable');
				$('.ar-arrow-p').attr('disable','disable');				
			}
		// }else{
		// 	$('.al-arrow-p').attr('disable','disable');
		// 	$('.ar-arrow-p').attr('disable','disable');
		// }
	}

	//生成缩略图列表
	function renderList(){
		var handlers = {};
		if(!isInit){
			isInit = true;
			handlers = {
	          'li' : {
	            'click': function(e){
	              if(isMove){
	                return;
	              }
	              lockMove();
	              var t = $(this);
	              var id = t.attr('data-id');
	              if(id){
	                $("#reviewBlock li").removeClass('selected');
	                t.addClass('selected');
	                t.attr('class','selected');
	                getFile(id);
	              }
	            }
	          }
			}
		}

		var view = new View({
	        tplid : 'review.list',
	        target : $('#reviewBlock'),
	        after : function(){
	          nowLength = $('#reviewFileList li').length;
	          $('#reviewFileList').width(48*nowLength); 
	          checkPage();	        	
	        },
	        data : {
	          list : nowList,
	          id : nowId,
	          mail : mail  	
	        },
	        handlers : handlers
		});
		view.createPanel();
	}

	function change(num){
		//0 横,1竖
		var w = $('#reviewImg').width();
		var h = $('#reviewImg').height();
		// if(num){
		// 	$('#reviewImg').width(h);
		// }else{

		// }
		// console.log(num%2,$('#reviewImg').width(),$('#reviewImg').height());
	}

    function render(data){
      //图片
      data.mail = mail;
      var view = new View({
        target : $('#reviewDiv'),
        tplid : 'review',
        after : function(){
          if(data.type == 2){
              var purl = encodeURIComponent(config.cgi.filereview+'?fileId='+data.id);
              if(mail){
                purl = encodeURIComponent(config.cgi.filereview+'?messageId='+data.id)
              }
              $('#documentViewer').FlexPaperViewer(
                { config : {
                    SWFFile : purl,
                    jsDirectory : '/js/lib/flex/',
                    Scale : 0.8,
                    ZoomTransition : 'easeOut',
                    ZoomTime : 0.5,
                    ZoomInterval : 0.2,
                    FitPageOnLoad : true,
                    FitWidthOnLoad : false,
                    FullScreenAsMaxWindow : false,
                    ProgressiveLoading : false,
                    MinZoomSize : 0.2,
                    MaxZoomSize : 5,
                    SearchMatchAll : false,
                    InitViewMode : 'Portrait',
                    RenderingOrder : 'flash',
                    StartAtPage : '',
                    ViewModeToolsVisible : true,
                    ZoomToolsVisible : true,
                    NavToolsVisible : true,
                    CursorToolsVisible : true,
                    SearchToolsVisible : true,
                    WMode : 'window',
                    localeChain: 'zh_CN'
                }}
              );            
          }else if(data.type == 1){
               var num = 0;   

			$('#reviewImg').load(function(e){
				var obj = e.target;
				var w = $('body').width(),
					h = $('body').height();
				if(obj.width > w){
					if(obj.width/obj.height > w/h){
						obj.style.width = '90%';
					}else{
						obj.style.height = '90%';
					}
				}else if(obj.height > h){
					if(obj.width/obj.height > w/h){
						obj.style.width = '90%';
					}else{
						obj.style.height = '90%';
					}
				}else{
					obj.style.marginTop = (h-obj.height)/2+'px';
				}
				// if(obj.width >= obj.height){
				// 	if(obj.width>640){
				// 		obj.width= 640;
				// 	}     
				// 		obj.style.marginTop = (640-obj.height)/2+'px';
				// }else{
				// 	if(obj.height>640){
				// 		obj.height= 640;
				// 	}   
				// //obj.style.marginTop = (640-obj.width)/2+'px';
				// }
			});
            $('.to-left').bind('click',function(){
              $('#reviewImg').rotate({
                angle: (num)*90,
                animateTo: (num-1)*90,
              });
              num--;
              change(num);
            });
            $('.to-right').bind('click',function(){
            
              $('#reviewImg').rotate({                          
                    angle: num*90,
                    animateTo: (num+1)*90,
                  });
              num++;   
              change(num);  
            }); 
            $('.zoom-in').bind('click',function(){
              $('#reviewImg').css('width',function(i,v){
                var nv = parseInt(v,10);
                return nv*0.8;
              }); 
            });
            $('.zoom-out').bind('click',function(){
              $('#reviewImg').css('width',function(i,v){
                var nv = parseInt(v,10);
                return nv*1.2;
              }); 
            }); 
          }
        },
        data : {
          data : data,
          url : config.cgi.filereview
        }
      });
      view.createPanel();
    }

	var handlers = {
		'review:show' : show,
		'review:return' : listLoad
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}


});