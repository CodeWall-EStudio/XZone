;(function() {

  requirejs.config({
    baseUrl: 'js/manage',
    paths: {
      jquery: '../lib/jquery'
    }    
  });

  require(['config','helper/router','helper/util','view.group','view.user','view.manage','model.manage','msg','model.group'], function(config,router,util,group,user,manage,mModel) {

    var handerObj = $(Schhandler);
    var prepload = false;
    var sgload = false;
   
    if(!util.getCookie('skey')){
      window.location = config.cgi.gotologin;
      return;
    }

    handerObj.bind('manage:preploaded',function(e,d){
      prepload = true;
      if(sgload && prepload){
        $('.manage-loading').remove();
        init();
      }
    });

    handerObj.bind('manage:slistload',function(e,d){
      sgload = true;
      if(sgload && prepload){
        $('.manage-loading').remove();
        init();
      }
    }); 

    handerObj.bind('manage:userLoaded',function(e,d){
      if(d.auth == 15){
          handerObj.triggerHandler('group:loadprep');
          handerObj.triggerHandler('manage:sgrouplist');  
          $('#userInfo').html(d.nick+' <a href="/">返回</a>');
      }else{
        window.location = '/';
      }
    });

    handerObj.triggerHandler('manage:userinfo');
    var headers  = $.ajax({async:false}).getAllResponseHeaders();
    util.getServerTime(headers);

    mModel.getKey('grade');
    mModel.getKey('subject');

    function init(){
      $('.navbar-nav li').bind('mouseenter',function(){
          var cmd = $(this).attr('cmd');
          $('.manage-menus').show();
          $('.manage-nav').hide();
          //$('.manage-section').addClass('hide');
          //console.log(cmd);
          $('#'+cmd).show();
      });
      $('.navbar-nav').bind('mouseout'),function(){
        $('.manage-menus').hide();
      }
      //manage.init(); 

      $('.manage-menus a').bind('click',function(){
        var t = $(this),
            cmd = t.attr('cmd');
        $('.manage-menus a').removeClass('selected');
        t.addClass('selected');
        $('.manage-section').addClass('hide');
            switch(cmd){
              case 'group':
              case 'dep':
              case 'prep':
              case 'school':
              case 'pschool':
                group.init(cmd);
                break;
              case 'user':
              case 'userdep':
                user.init(cmd);
                break;

              case 'data':
              case 'log':
              case 'manage':
              case 'size':
              case 'grade':
                manage.init(cmd);
                break;
            }
      });   

      manage.init('data');
      // var opt = {
      //   cgi : config.cgi.getinfo,
      //   data : {}
      // }

      // var success = function(d){
      //   if(d.err == 0){
      //     console.log(d.result);
      //   }else{
      //     handerObj.triggerHandler('msg:error',d.err);
      //   }
      // }
      // request.get(opt,success);      
    }




   
  });
})();