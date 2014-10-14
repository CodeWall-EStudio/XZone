var loginUrl = '/index.html';
function getParameter(name) { 	
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
} 

var jump = getParameter('jump_url');
if(jump){
	loginUrl = jump;
	$("#titleBlock").attr('class','nr act-tit');
}

$('#submit').on('click',function(){
	var name = $("#name").val();
	var pwd = $("#name").val();
	if(name !== '' && pwd !== ''){
		var param = {
			name : name,
			pwd : pwd,
			json: true
		};

		var success = function(data){
			if(data.err === 0){
				window.location.href= loginUrl;
			}else{
				$('#error').show();
			}
			//handerObj.triggerHandler('msg:error',data.err);
		}
		$.post('/api/user/login',param,success,'json');
		//request.post(opt,success);		
	}
});