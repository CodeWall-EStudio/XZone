;(function() {

  requirejs.config({
    baseUrl: 'js/manage',
    paths: {
      jquery: '../lib/jquery'
    }    
  });

  require(['config','helper/router','helper/util','view.manage'], function(config,router,util,manage) {

    var handerObj = $(Schhandler);

    
    if(!util.getCookie('skey')){
      window.location = config.cgi.gotologin;
      return;
    }

    //manage.init(); 
   
  });
})();