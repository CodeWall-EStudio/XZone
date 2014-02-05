define([],function(){
	var templateManager = {}
	//模版列表
	var templateList = {},
		tmplPath = './tmpl/',
		tmplName = '.html';

	function checkTpl(tmp){
		return tmp.indexOf('<html>')>=0?true:false;
	}

	var get = function(tplid,callback){
		//tplid = tplid.replace(/\./g,'-');
		var template = templateList[tplid];
		if(template){
			if(callback && typeof callback == 'function'){
				callback(template);
			}else{
				return template;
			}
		}else{
			template = $('#'+tplid).html();
			if(template){
				templateList[tplid] = template;
				return template;
			}
			var startTime = new Date().getTime();
			template = $.ajax({
				url: tmplPath+tplid+tmplName,
				async: false,
				error : function(data){
					//Report.monitor(337658);		
					return false;
				}
			}).responseText;

			var endTime = new Date().getTime();
			//Report.isd(7832,9,2,[0,endTime-startTime]);

			/*
			if(checkTpl(template)){
				Report.monitor(337658);
				return '';
			}
			*/

			templateList[tplid] = template;
			if(callback && typeof callback == 'function'){
				callback(template);
			}else{
				return template;
			}			
		}
	}

	templateManager.get = get;

	return templateManager;
});