;(function() {

  requirejs.config({
    baseUrl: 'js/school',
    paths: {
      jquery: '../lib/jquery'
    }    
  });

  require(['config','helper/util','helper/request','helper/view','msg'], function(config,util,request,View) {

    var handerObj = $(Schhandler);

    
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


    var id = util.getParam('id');
    var mail = util.getParam('mail');
    getFile(id);
   
  });
})();