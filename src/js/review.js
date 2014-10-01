;(function() {

  requirejs.config({
    baseUrl: 'js/school',
    paths: {
      jquery: '../lib/jquery'
    }    
  });

  require(['config','helper/util','helper/request','helper/view','model.review','msg'], function(config,util,request,View,Review) {

    var handerObj = $(Schhandler);
    var nowType = null;
    
    if(!util.getCookie('skey')){
      window.location = config.cgi.gotologin;
      return;
    }

    function convent(data){
      var obj = {};
      obj.fid = data.resource._id;
      obj.type = data.resource.type || data.type;
      obj.name = data.name;
      obj.id = data._id;
      obj.mail = mail;
      return obj;
    }

    function render(data){
      //图片
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
// 　　　　angle:0,  //起始角度
// 　　　　　animateTo:180,  //结束的角度
// 　　　　　duration:500， //转动时间               
            $('.to-left').bind('click',function(){
              $('#reviewImg').rotate({
                angle: (num)*90,
                animateTo: (num-1)*90,
              });
              num--;              

            });
            $('.to-right').bind('click',function(){
            
              $('#reviewImg').rotate({                          
                    angle: num*90,
                    animateTo: (num+1)*90,
                  });
              num++;              
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

    function getReview(id,data){
      var opt = {
        cgi : config.cgi.filereview,
        data : {
          fileId : id
        }
      } 
      var success = function(d){
        if(d.err == 0){
          $.extend(data,d.result);
          render(data);
        }else{
          handerObj.triggerHandler('msg:error',d.err);
        }
      }
      request.get(opt,success);            
    }

    function getFile(id){
      var obj = {}
          url = config.cgi.fileinfo;
      if(mail){
        obj.messageId = id;
        url = config.cgi.msgone;
      }else{
        obj.fileId = id;
      }
      var opt = {
        cgi : url,
        data : obj
      }
      var success = function(d){
        if(d.err == 0){
          var finfo = convent(d.result.data);
          if(finfo.type == 8){
            var to = {};
            if(mail){
              to.messageId = id;
            }else{
              to.fileId = id;
            }
            $.get(config.cgi.filereview,to,function(d){
              finfo.text = d;
              render(finfo);
            },'text');
          }else{
            render(finfo);
          }
          //getReview(id,finfo);
          //render(finfo);
        }else{
          handerObj.triggerHandler('msg:error',d.err);
        }
      }
      request.get(opt,success); 
    }

    var total = 0;
    var id = util.getParam('id');
    var mail = util.getParam('mail');
    var cate = util.getParam('cate');
    var coll = util.getParam('coll');
    var gid = util.getParam('gid');
    var fdid = util.getParam('fdid');
    var page = parseInt(util.getParam('page')) || 0;
    var key = util.getParam('key');
    var ods = util.getParam('ods');
    var isMove = false; //切换预览
    var isInit = false; //是否已经初始化
    if(page){
      page -=1;
    }
    var oldpage = page;
    var isLoad = false;   //加载中

    function next(i){
      var t = $('#reviewFileList');
      var rw = t.parent()[0].clientWidth;
      var tw = t.width();
      var nl = i*48+48;
      var tl = t[0].offsetLeft - 36;
      if(tw-rw>0){
        if((tw-rw)%nl === 0 && (tw-rw)%480 === 0){
          tl -=rw;
          t.css('marginLeft',tl+'px');
        }
      }
    }

    function prev(i){
      var t = $('#reviewFileList');
      var rw = t.parent()[0].clientWidth;
      var tl = t[0].offsetLeft - 36; 
      if(i === 0 || i === 10){
          tl += rw;
          if(tl>0){
            tl = 0;
          }
          t.css('marginLeft',tl+'px');
      }   
    }

    //节流
    function lookMove(){
      isMove = true;
      setTimeout(function(){
        isMove = false;
      },500);
    }

    //console.log(mail,coll,gid,fdid,page);
    function renderBlock(list,id){
      var tplid = 'review.block';
      var target = $("#reviewBlock");
      if(page !== oldpage){
        tplid = 'review.list';
        target = $('#reviewFileList');
      }
      var obj = {
        target : target,
        tplid : tplid,
        data : {
          list : list,
          page : page,
          id : id
        },
        after : function(){
          var l = $('#reviewFileList li').length;
          $('#reviewFileList').width(48*l); 
        }      
      };

      if(!isInit){
        isInit = true;
        obj.handlers = {
          'li' : {
            'click': function(e){
              if(isMove){
                return;
              }
              lookMove();
              var t = $(this);
              var id = t.attr('data-id');
              if(id){
                $("#reviewBlock li").removeClass('selected');
                t.addClass('selected');
                getFile(id);
              }
            }
          },
          '.ar-arrow' : {
            'click' : function(){
              if(isMove){
                return;
              }
              lookMove();
              var t = $("#reviewBlock li");
              var l = $("#reviewBlock li").length;
              var idx = 0;
              $("#reviewBlock li").each(function(i){
                if($(this).hasClass('selected')){
                  idx = i;
                }
              });
              next(idx);
              if(idx<l-1){
                  $("#reviewBlock li").removeClass('selected');
                  var nt = $("#reviewBlock li").eq(idx+1);
                  var id = nt.attr('data-id');
                  nt.addClass('selected');  
                  if(id){
                    getFile(id);
                  }
              }else{
                if($("#reviewBlock li").length < total){
                  page++;
                  loadFile();
                }else{
                  handerObj.triggerHandler('msg:show',{
                    type: 'error',
                    msg : '已经是最后一个文件了!'
                  });
                }
              }
            }
          },
          '.al-arrow' : {
            'click' : function(){
              if(isMove){
                return;
              }
              lookMove();              
              var t = $("#reviewBlock li");
              var l = $("#reviewBlock li").length;
              var idx = 0;
              $("#reviewBlock li").each(function(i){
                if($(this).hasClass('selected')){
                  idx = i;
                }
              });
              prev(idx);
              if(idx>0){
                  $("#reviewBlock li").removeClass('selected');
                  var nt = $("#reviewBlock li").eq(idx-1);
                  var id = nt.attr('data-id');
                  nt.addClass('selected');  
                  if(id){
                    getFile(id);
                  }              
              }else{
                if(page>0){
                  page--;
                  loadFile();
                }else{
                  handerObj.triggerHandler('msg:show',{
                    type: 'error',
                    msg : '已经是第一个文件了!'
                  });
                }
              }
            }
          }
        }        
      }

      var view = new View(obj);
      if(page === oldpage){
        view.createPanel();  
      }else if(page < oldpage){
        view.beginPanel();
        var tl = target[0].offsetLeft - 36; 
        var rw = target.parent()[0].clientWidth;
        target.css('marginLeft',tl-rw+"px");
        $('.al-arrow').click();
      }else{
        view.appendPanel();
        $('.ar-arrow').click();
      }
      oldpage = page;
    }

    function fileLoad(d){
      isLoad = false;
      total = d.total;
      renderBlock(d.list,id);
    }

    function mailLoad(d){
      isLoad = false;
      total = d.total;
      renderBlock(d.list,id);
    }

    function collLoad(d){
      isLoad = false;
      total = d.total;
      renderBlock(d.list,id);
    }    

    //拉文件列表
    function loadFile(){
      if(isLoad){
        return;
      }
      isLoad = true;
      if(fdid){
        Review.getfile({
          page : page,
          pageNum : 10,
          folderId : fdid,
          order : ods,
          key : key,
        },fileLoad);
      }else if(mail){
        Review.getmailfile({
          page : page,
          pageNum : 10,
          order : ods,
          key : key,          
          cate : cate,
          order : ods
        },mailLoad);
      }else if(coll){
        Review.getcollfile({
          page : page,
          pageNum : 10,
          order : ods,
          key : key,          
          cate : cate,
          order : ods
        },collLoad);
      }      
    }
    
    loadFile();
    getFile(id);
   
  });
})();