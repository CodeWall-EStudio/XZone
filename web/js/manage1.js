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
        $('#'+cmd).show();
    });
    $('.navbar-nav').bind('mouseout'),function(){
      console.log(123456);
      $('.manage-menus').hide();
    }
    //manage.init(); 
   
  });
})();