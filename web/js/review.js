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
      obj.type = data.resource.type;
      obj.name = data.name;
      obj.id = data._id;
      return obj;
    }

    function render(data){
      //图片
      var view = new View({
        target : $('#reviewDiv'),
        tplid : 'review',
        after : function(){
          if(data.type == 2){
              $('#documentViewer').FlexPaperViewer(
                { config : {
                    SWFFile : encodeURIComponent(config.cgi.filereview+'?fileId='+data.id),
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
          }else if(data.type == 3 || data.type == 4){
            console.log(data);
          }
        },
        data : {
          data : data
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
      var opt = {
        cgi : config.cgi.fileinfo,
        data : {
          fileId : id
        }
      }
      var success = function(d){
        if(d.err == 0){
          var finfo = convent(d.result.data);
          if(finfo.type == 8){
            $.get(config.cgi.filereview,{fileId:id},function(d){
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
    getFile(id);
   
  });
})();