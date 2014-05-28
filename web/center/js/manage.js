;(function() {

  requirejs.config({
    baseUrl: 'js',
    paths: {
      jquery: '../lib/jquery'
    }    
  });

  require(['config'], function(config){

 	var cgi = config.cgi;

    function init(){
      $('.navbar-nav li').bind('mouseenter',function(){
          var cmd = $(this).attr('cmd');
          $('.manage-menus').show();
          $('.manage-nav').hide();
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
            }
      });   
    }

    manage.init();

	});

})();