var loginUrl = '/index.html';
function getParameter(name) { 	
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
} 

var cookie = function(name, value, options) {
		if (typeof value != 'undefined') {
			options = options || {};
			if (value === null) {
				value = '';
				options.expires = -1;
			}
			var expires = '';
			if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
				var date;
				if (typeof options.expires == 'number') {
					date = new Date();
					date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
				} else {
					date = options.expires;
				}
				expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
			}
			var path = options.path ? '; path=' + (options.path) : '';
			var domain = options.domain ? '; domain=' + (options.domain) : '';
			var secure = options.secure ? '; secure' : '';
			document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
		} else {
			var cookieValue = null;
			if (document.cookie && document.cookie != '') {
				var cookies = document.cookie.split(';');
				for (var i = 0; i < cookies.length; i++) {
					var cookie = jQuery.trim(cookies[i]);
					if (cookie.substring(0, name.length + 1) == (name + '=')) {
						cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
						break;
					}
				}
			}
			return cookieValue;
		}
	}

var jump = getParameter('jump_url');
if(jump){
	loginUrl = jump;
	$("#titleBlock").attr('class','nr act-tit');
}

$('#submit').on('click',function(){
	var name = $("#name").val();
	var pwd = $("#pwd").val();
	if(name !== '' && pwd !== ''){
		var param = {
			name : name,
			pwd : pwd,
			json: true
		};

		var success = function(data){
			if(data.err === 0){
				cookie('uid',data.result.name,{domain:'hylc-edu.cn'});
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