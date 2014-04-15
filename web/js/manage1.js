;(function() {

  requirejs.config({
    baseUrl: 'js/manage',
    paths: {
      jquery: '../lib/jquery'
    }    
  });

  require(['config','helper/router','helper/util','view.manage'], function(config,router,util,manage) {

    var handerObj = $(Schhandler);

    
    // if(!util.getCookie('skey')){
    //   window.location = config.cgi.gotologin;
    //   return;
    // }

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
          switch(cmd){
            case 'group':
              break;
            case 'dep':
              break;
            case 'prep':
              break;
          }
    });
   
  });
})();