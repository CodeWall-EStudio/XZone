define(['config','model.nav','helper/view'],function(config,modelNav,View){

	var	handerObj = $(Schhandler),
		navTarget = $('#pageNav'),
		userasideTarget = $('#userAside'),
		navView = new View(),
		myView = new View();

	function init(){
		modelNav.triggerHandler('nav:init',1);
	}


	function navLoad(e,d){
		var opt = {
			target : navTarget,
			tplid : 'nav',
			data : d,
			handlers : {
				'a.layout' : {
					click : function(e){
						window.location = config.cgi.logout;
					}
				}
			}
		}
		navView.expand(opt);
		navView.createPanel();		


		var opt = {
			target : userasideTarget,
			tplid : 'my.aside',
			data : d
		}
		navView.expand(opt);
		navView.createPanel();	

		var view = new View({
			target : $('#userInfoAside'),
			tplid : 'my.info',
			data : d
		});
		view.createPanel();
		

		handerObj.triggerHandler('site:start');
	}

	var handlers = {
		'nav:load' : navLoad
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}

	return {
		init : init
	}
});