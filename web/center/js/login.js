;(function() {

  requirejs.config({
    baseUrl: 'js',
    paths: {
      jquery: '../lib/jquery'
    }    
  });

  require(['config'], function(config){

 	var cgi = config.cgi;

	$(function(){

		$('#loginBtn').bind('click',function(){

			var name = $.trim($("#userName").val());
			var pwd = $.trim($('#passWord').val());

			if(name !== '' && pwd !== ''){
				var param = {
					name : name,
					pwd : pwd,
					json : true
				}

				$.post(cgi.login,param,function(d){
					console.log(d);
					if(d.ec === 0){
						window.location = 'manage.html'
					}else{
						alert('出错拉!ec:'+d.ec);
					}
				});
			}

		});
	});
  });
})();