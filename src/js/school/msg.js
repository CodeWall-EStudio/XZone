define(['config','cache','helper/view'],function(config,Cache,View){
	var	handerObj = $(Schhandler);
	var msg = config.msg;

	Messenger().options = {
	    extraClasses: 'messenger-fixed messenger-on-bottom',
	    theme: 'flat'
	}

	var at = 0;

	function showConfig(e,d){
		if(typeof d === 'undefined'){
			return;
		}
		var obj = {
			message : d.msg,
			actions : {
				sub : {
					label : d.act.sub.label || '确定',
					action : function(){
						d.act.sub.action();
						msg.hide();
					}
				},
				cancel : {
					label : d.act.canel.label || '取消',
					action : function(){
						msg.hide();
					}
				}
			}
		}
		var msg = Messenger().post(obj);
	}

	function showErr(e,d){
		if(d == 1001){
			//window.location = config.cgi.gotologin;
			handerObj.triggerHandler('nav:showlogin');
			return;
		}

		var obj = {
			'message' : msg[d]
		}
		if(parseInt(d)){
			obj.type = 'error'
		}

		Messenger().post(obj);	
	}

	function showMsg(e,d){
		var obj = {
			'message' : d.msg
		}
		obj.type = d.type;

		Messenger().post(obj);		
	}

	var handlers = {
		'msg:error' : showErr,
		'msg:show' : showMsg,
		'msg:config' : showConfig
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}	
});