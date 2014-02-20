;(function() {

  requirejs.config({
    baseUrl: 'js/school',
    paths: {
      jquery: '../lib/jquery'
    }    
  });

  require(['config','helper/util','helper/request','msg'], function(config,util,request) {

    var handerObj = $(Schhandler);

    
    if(!util.getCookie('skey')){
      window.location = config.cgi.gotologin;
      return;
    }

    function getFile(id){
      var opt = {
        cgi : config.cgi.fileinfo,
        data : {
          fileId : id
        }
      }
      var success = function(d){
        console.log(d)
        if(d.err == 0){

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