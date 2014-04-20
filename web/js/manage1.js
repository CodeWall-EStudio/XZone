;(function() {

  requirejs.config({
    baseUrl: 'js/manage',
    paths: {
      jquery: '../lib/jquery'
    }    
  });

  require(['config','../school/helper/router','../school/helper/util','view.group','view.user','view.manage','model.manage','msg','model.group'], function(config,router,util,group,user,manage,mModel) {

    var handerObj = $(Schhandler);

    
    if(!util.getCookie('skey')){
      window.location = config.cgi.gotologin;
      return;
    }



    handerObj.bind('manage:preploaded',function(e,d){
      $('.manage-loading').remove();
      init();
    });

    handerObj.triggerHandler('group:loadprep');

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
                group.init(cmd);
                break;
              case 'user':
              case 'userdep':
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
    }




   
  });
})();