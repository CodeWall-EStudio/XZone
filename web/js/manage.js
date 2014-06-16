
define('config',[],function() {
	var CGI_PATH = '/api/',
		EXT = '';//'.php';

	return {
		pagenum : 10,
		filetype : {
			0 : '全部类型',
			1 : '图片',
			2 : '文档',
			3 : '音乐',
			4 : '视频',
			5 : '应用',
			6 : '压缩包',
			7 : '其他',
			8 : 'txt文档'
		},
		cgi : {
			//个人资料
			getinfo : CGI_PATH+'user/',
			info : CGI_PATH+'user/login'+EXT,
			gotologin : CGI_PATH+'user/gotoLogin'+EXT,
			//login : CGI_PATH+'user/gotoLogin'+EXT,
			varify : CGI_PATH+'user/verify'+EXT,
			logout : CGI_PATH+'user/logoff'+EXT,
			userlist : CGI_PATH+'user/search'+EXT,
			usearch : CGI_PATH+'user/search'+EXT,
			departments : CGI_PATH+'user/departments'+EXT,
			info : CGI_PATH + 'user/info',
			umodify : CGI_PATH + 'user/modify',
			login : CGI_PATH + 'user/login',
			logout : CGI_PATH + 'user/logoff',
			valid : CGI_PATH + 'user/validate',

			create : CGI_PATH + 'manage/createUser',
			modify : CGI_PATH + 'manage/modifyUser',
			resetpwd : CGI_PATH + 'manage/resetUserPwd',

			orglist : CGI_PATH + 'organization/tree',
			createorgan : CGI_PATH + 'organization/create',
			adduser : CGI_PATH + 'organization/addUser',
			removeuser : CGI_PATH + 'organization/removeUser',
			orgdelete : CGI_PATH + 'organization/delete',
			organmodify : CGI_PATH + 'organization/modify',			

			//文件操作
			upload : '/upload'+EXT,
			filelist : CGI_PATH+'file/list'+EXT,
			filesearch : CGI_PATH+'file/search'+EXT,
			fileinfo : CGI_PATH+'file'+EXT,
			filedown : CGI_PATH+'file/download'+EXT,
			filemodify : CGI_PATH+'file/modify'+EXT,
			filecopy : CGI_PATH+'file/copy'+EXT,
			filemove : CGI_PATH+'file/move'+EXT,
			filedel : CGI_PATH+'file/delete'+EXT,
			fileshare : CGI_PATH+'file/share'+EXT,
			filesave : CGI_PATH+'file/save'+EXT,
			filereview : CGI_PATH+'file/preview'+EXT,	
			filequery : CGI_PATH+'file/query'+EXT,//order page pageNum type 1 查询我分享给小组的  groupid
			filestatus : CGI_PATH+'file/statistics'+EXT,
			//batchDownload


			//文件夹
			foldinfo : CGI_PATH+'folder'+EXT,
			foldcreate : CGI_PATH+'folder/create'+EXT,
			foldmodify : CGI_PATH+'folder/modify'+EXT,
			foldlist : CGI_PATH+'folder/list'+EXT,
			foldsearch : CGI_PATH+'folder/search'+EXT,
			folddel : CGI_PATH+'folder/delete'+EXT,


			//文件收藏
			favcreate : CGI_PATH+'fav/create'+EXT,
			favlist : CGI_PATH+'fav/list'+EXT,
			favdel : CGI_PATH+'fav/delete'+EXT,
			favsearch : CGI_PATH+'fav/search'+EXT,

			//回收站
			reclist : CGI_PATH+'recycle/list'+EXT,
			recrev : CGI_PATH+'recycle/revert'+EXT,
			recdel : CGI_PATH+'recycle/delete'+EXT,
			recsearch : CGI_PATH+'recycle/search'+EXT,

			//小组&部门
			groupcreate : CGI_PATH+'group/create'+EXT,
			groupmodify : CGI_PATH+'group/modify'+EXT,
			groupinfo : CGI_PATH+'group'+EXT,
			groupverify : CGI_PATH+'group/verify'+EXT,
			groupverlist : CGI_PATH+'group/verify/list'+EXT,

			//消息
			msgone : CGI_PATH+'message'+EXT,
			msgcreate : CGI_PATH+'message/create'+EXT,
			msgsearch : CGI_PATH+'message/search'+EXT,

			//空间组
			addsgroup : CGI_PATH+'sizegroup/create'+EXT,
			modifysgroup : CGI_PATH+'sizegroup/modify'+EXT,
			delsgroup : CGI_PATH+'sizegroup/delete'+EXT,
			sgrouplist : CGI_PATH+'sizegroup/search'+EXT,

			//留言板
			boardcreate : CGI_PATH+'board/create'+EXT,
			boardlist : CGI_PATH+'board/search'+EXT,
			boarddel : CGI_PATH+'board/delete'+EXT,
			boardverify : CGI_PATH+'board/verify'+EXT,

			//管理相关
			mlistgroup : CGI_PATH+'manage/listGroups'+EXT,
			mappgroup :　CGI_PATH+'manage/approveGroup'+EXT,
			mpreplist : CGI_PATH+'manage/listPrepares'+EXT,
			mnewgroup : CGI_PATH+'manage/createGroup'+EXT,
			mappfile : CGI_PATH+'manage/approveFile'+EXT,
			mstatic : CGI_PATH+'manage/statistics'+EXT,

			//用户 
			usersearch : CGI_PATH+'user/search'+EXT,
			usermodify : CGI_PATH+'manage/modifyUser'+EXT,

			//日志
			logsearch : CGI_PATH+'log/search'+EXT,
			

			//存储
			getstorge : CGI_PATH+'storage'+EXT,
			setstorge : CGI_PATH+'storage/set'+EXT

		},
		grade : {
			1 : '一年级',
			2 : '二年级',
			3 : '三年级',
			4 : '四年级',
			5 : '五年级',
			6 : '六年级'					
		},
		tag : {
			1 : '语文',
			2 : '数学',
			3 : '英语',
			4 : '体育',
			5 : '音乐',
			6 : '美术',
			7 : '科学',
			8 : '综合实践',
			9 : '信息技术'
		},
		msg : {
			0 : '操作成功!',
			10: '排序序号必须填写',
			11 : '组织名称必须填写',
			20 : '新密码和重复密码必须一致',
			21 : '请填写用户名和密码!',
			50 : '你要上传的文件已经超过你的剩余空间!',
			60 : '你还没有选择要共享的目录',
			75 : '序号只能在1~99之间',
			76 : '名称不能少于2个字',
			77 : '参数不能为空',
			78 : '对不起，网络超时了，请稍后再试',
			79 : '已经有同名的项目了',
			100 : '对不起，您没有这个操作权限!',//后台出错啦!
			101 : '出错啦',
			1001 : '您还没有登录!',
			1004 : '没有找到资源!',
			1010 : '您没有查看该资源的权限!',
			1011 : '参数出错啦!',
			1013 : '出错啦',
			1014 : '同名啦,请修改名称!',
			1015 : '已经归档啦!',
			1016 : '该资源不能删除',
			1017 : '该目录下还有其他文件，无法删除!',
			1041 : '用户名或密码错误!'
		}
	}
// module.exports = exports = {
//     SERVER_ERROR: 100,
//     NOT_SUPPORT: 101,

//     NOT_LOGIN: 1001,
//     TICKET_ERROR: 1002,
//     SKEY_EXPIRE: 1003,

//     NOT_FOUND: 1004,

//     NOT_AUTH: 1010,
//     PARAM_ERROR: 1011,
    
//     SPACE_FULL: 1013,
//     DUPLICATE: 1014,
//     NOT_MATCH: 1015,


//     SUCCESS: 0
// }
	
});
define('helper/router',[],function(){
	//取hash值 作废
    var getHash = function(name){
        try{
            var reg = new RegExp("(^|&|\\#)" + name + "=(.*?)(?=(&|$))", "g");
            var r = window.location.hash.match(reg);
            r = r[0].match(/\=.*?$/);
            return r[0].replace('=','');
        }catch(e){
            return false;
        }
    };	

	var Router = function(options){
		options || (options = {});
		if(options.routes) {
			this.routes = options.routes;
		}
		this._routes = {};
		this._bind();
	};

	var optionalParam = /\((.*?)\)/g;
	var namedParam    = /(\(\?)?:\w+/g;
	var splatParam    = /\*\w+/g;
	var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;	


	Router.prototype.start = function(){
		var router = this;
		this.checkUrl();
		$(window).on('hashchange',function(){
			router.checkUrl()
		});
	}

	Router.prototype.checkUrl = function(e){
		var hash = this.getHash();
		for(var i in this.routes){
			var r = this._routes[i];
			if(r.test(hash)){
				//var args = r.exec(hash).slice(1);
				var obj = {};
				var p = hash.split('&');
				for(var j = 0,l = p.length;j<l;j++){
					var tp = p[j].split('=');
					obj[tp[0]] = tp[1];
				}
				this[this.routes[i]].apply(this, [obj]);
				return;
			};
		}
	}

    Router.prototype.getHash = function(window) {
      var match = location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    }	
	//扩展
	Router.prototype.extend = function(opt){
		for(var i in opt){
			this[i] = opt[i];
		}
		this._bind();
	}
	//绑定
	Router.prototype._bind = function(){
		if(!this.routes){
			return;
		}
		for(var i in this.routes){
			this._routes[i] = this.route(i,this.routes[i]);
			//this._routeToRegExp(i);//
		}
	};
	Router.prototype.route = function(route,name,callback){
		if(!callback){
			callback = this[name];
		}
		var router = this;
		var r = this._routeToRegExp(route);
		return r;
	}
	//
	Router.prototype._routeToRegExp = function(route){		
      route = route.replace(escapeRegExp, '\\$&')
                   .replace(optionalParam, '(?:$1)?')
                   .replace(namedParam, function(match, optional){
                     return optional ? match : '([^\/]+)';
                   })
                   .replace(splatParam, '(.*?)');
      return new RegExp('^' + route + '$');		
	};

	Router.prototype._extractParameters = function(route, fragment) {
      var params = route.exec(fragment).slice(1);
      return _.map(params, function(param) {
        return param ? decodeURIComponent(param) : null;
      });
    }


	return Router;
});
/**
 * 常用公用方法
 */
define('helper/util',['../config'], function(config) {

	var util = {};

	/**
	 * 将一个函数绑定到对应环境变量上
	 * @param  {Function} fn      欲绑定的函数
	 * @param  {Object}   context 上下文环境变量
	 */
	var bind = function(fn, context) {
		return function() {
			return fn.apply(context, arguments);
		};
	};

    var lenReg = function(str){
    　　return str.replace(/[^x00-xFF]/g,'**').length;
    };

    var sub_str = function(str, num){//按字节截取
        if(num){
            var len = 0, subStr = "";
            str = str.split("");
            for(var i = 0;i < str.length;i ++){
                subStr += str[i];
                if(/[^x00-xFF]/.test(str[i])){
                    len += 2;
                    if(len == num + 1) return subStr;
                }else{
                    len ++;
                }
                if(len == num){
                    return subStr;
                }
            }
        }
    };


	/**
	 * 转义html标签
	 * @param {String} str 需要转义的字符
	 */
	var encodeHTML = function(str){
		sStr = str + '';
		sStr = sStr.replace(/\\r/g,'');
		sStr = sStr.replace(/\\n/g,'');
		sStr = sStr.replace(/&/g, "&amp;");
		sStr = sStr.replace(/ /g, "&nbsp;");
		sStr = sStr.replace(/>/g, "&gt;");
		sStr = sStr.replace(/</g, "&lt;");
		sStr = sStr.replace(/\"/g, "&quot;");
		sStr = sStr.replace(/\'/g, "&#39;");
		return sStr;
	}

	/**
	**/
	var transStr = function(str){
		sStr = str + '';
		sStr = sStr.replace(/&/g, "&amp;");
		sStr = sStr.replace(/ /g, "&nbsp;");
		sStr = sStr.replace(/>/g, "&gt;");
		sStr = sStr.replace(/</g, "&lt;");
		sStr = sStr.replace(/\"/g, "&quot;");
		sStr = sStr.replace(/\'/g, "&#39;");		
		var string = sStr;
		string=string.replace(/\t/g,"&nbsp;&nbsp;&nbsp;&nbsp;");
		string=string.replace(/\r\n/g,"<BR>");
		string=string.replace(/\n/g,"<BR>");  
		return string;
	}

	/**
	 * 转义html标签
	 * @param {String} str 需要转义的字符
	 */
	var decodeHTML = function(str){
		sStr = str + '';
		sStr = sStr.replace(/&amp;/g, '&');
		sStr = sStr.replace(/&nbsp;/g, ' ');
		sStr = sStr.replace(/&gt;/g, '>');
		sStr = sStr.replace(/&lt;/g, '<');
		sStr = sStr.replace(/&quot;/g, '\"');
		sStr = sStr.replace(/&#39;/g, '\'');
		return sStr;
	}

	/**
	 * 转义attribute 
	 * @param {String} str 需要转义的字符
	 */
	var encodeAttr = function(str){
		sStr = str;
		sStr += '';
		sStr = sStr.replace(/&/g,"&amp;");
		sStr = sStr.replace(/>/g,"&gt;");
		sStr = sStr.replace(/</g,"&lt;");
		sStr = sStr.replace(/"/g,"&quot;");
		sStr = sStr.replace(/'/g,"&#39;");
		sStr = sStr.replace(/=/g,"&#61;");
		sStr = sStr.replace(/`/g,"&#96;");
		return sStr;		
	}	

	/**
	 * 模版
	 * @param  {String} text    模版字符串
	 * @param  {Object} data    数据
	 * @param  {Object} setting 配置
	 * @copyright http://underscorejs.org/
	 * @description 使用方法具体参见http://underscorejs.org/的template
	 */
	var template = function(text, data, setting) {
		var templateSettings = {
				evaluate: /<%([\s\S]+?)%>/g,
    			interpolate: /<%=([\s\S]+?)%>/g,
    			escapeattr: /<%\+([\s\S]+?)%>/g,
    			transstr : /<%\*([\s\S]+?)%>/g,
    			escape: /<%-([\s\S]+?)%>/g
			},
			escapes = {
    			"'":      "'",
    			'\\':     '\\',
    			'\r':     'r',
    			'\n':     'n',
    			'\t':     't',
    			'\u2028': 'u2028',
    			'\u2029': 'u2029'
  			},
			noMatch = /(.)^/,
			escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

		var _template = function(text, data, setting) {
			var render,
				index = 0,
				source = "__p+='";

			setting = setting || templateSettings;

			var matcher = new RegExp([
      			(setting.escape || noMatch).source,
      			(setting.escapeattr || noMatch).source,
      			(setting.transstr || noMatch).source,
      			(setting.interpolate || noMatch).source,
      			(setting.evaluate || noMatch).source
    		].join('|') + '|$', 'g');

    		text.replace(matcher, function(match, escape,escapeattr,transstr,interpolate, evaluate, offset) {
      			source += text.slice(index, offset)
        			.replace(escaper, function(match) {
        				return '\\' + escapes[match]; 
        			});
      			if (escape) {
        			source += "'+\n((__t=(" + escape + "))==null?'':require('helper/util').encodeHTML(__t))+\n'";
      			}
      			if (escapeattr) {
        			source += "'+\n((__t=(" + escapeattr + "))==null?'':require('helper/util').encodeAttr(__t))+\n'";
      			} 
      			if (transstr) {
        			source += "'+\n((__t=(" + transstr + "))==null?'':require('helper/util').transStr(__t))+\n'";
      			}      			     			
      			if (interpolate) {
        			source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      			}
      			if (evaluate) {
        			source += "';\n" + evaluate + "\n__p+='";
      			}
      			index = offset + match.length;
      			return match;
    		});

    		source += "';\n";

    		if (!setting.variable)
    			source = 'with(obj||{}){\n' + source + '}\n';

    		source = "var __t,__p='',__j=Array.prototype.join," +
      			"print=function(){__p+=__j.call(arguments,'');};\n" +
      			source + "return __p;\n";

    		try {
      			render = new Function(setting.variable || 'obj', '_', source);
    		} catch (e) {
      			e.source = source;
      			throw e;
    		}

    		if (data){
    			return render(data);
    		}

    		var __template = function(data) {
      			return render.call(this, data);
    		};

    		__template.source = 'function(' + (setting.variable || 'obj') + '){\n' + source + '}';

    		return __template;
		};

		return _template(text, data, setting);
	};

	/**
	 * 类模型
	 *
	 * @author August
	 * 
	 * @example
	 * //定义Animal类
	 * var Animal = newClass({
	 *     init: function(name) {
	 *         this.name = name;
	 *     },
	 *     getName: function() {
	 *         console.log('Animal\'s name is ' + this.name);
	 *     }
	 * });
	 * //定义Cat类，继承Animal类
	 * var Cat = newClass({
	 *     init: function(name, color) {
	 *         this.color = color;
	 *     },
	 *     extend: Animal,
	 *     getColor: function() {
	 *         console.log('Cat\'s color is ' + this.color);
	 *     },
	 *     changeName: function(name) {
	 *         this.name = name;
	 *     }
	 * });
	 * //示例代码
	 * var littleCat = new Cat('mimi', 'white');
	 * littleCat.changeName('huahua');
	 * littleCat.getName();    //Animal's name is huahua
	 * console.log(littleCat instanceof Animal);    //true
	 * console.log(littleCat instanceof Cat);    //true
	 * 
	 */
	var newClass = function(o) {
		var superClass = o.extend || null;

		var specialKey = {
			'init': true,
			'extend': true
		};

		var object = function(o) {
			function F() {}
			F.prototype = o;
			return new F();
		};

		var inheritPrototype = function(subClass, superClass) {
			var prototype = object(superClass.prototype);
			prototype.constructor = subClass;
			subClass.prototype = prototype;
		};

		var Class = function() {
			superClass && superClass.apply(this, arguments);
			o.init && o.init.apply(this, arguments);
		};

		superClass && inheritPrototype(Class, superClass);
		
		for (var key in o) {
			if (!(key in specialKey)) {
				Class.prototype[key] = o[key];
			};
		};
		
		return Class;
	};

	/**
	 * 获取对应key的cookies值
	 * 没有则返回空字符串
	 * @param  {String} key 要获取的key值
	 */
	var getCookie = function(key) {
		var r = new RegExp('(?:^|;+|\\s+)' + key + '=([^;]*)'),
			m = document.cookie.match(r);
		return (!m ? '' : m[1]);
	};

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

	var formatTime = function(time) {
		var d = new Date(time);

		var m = d.getMonth()+1;
		var day = d.getDate();
		var h =  d.getHours();
		var m1 = d.getMinutes();
		if(m<10){
			m = '0'+m;
		}
		if(day<10){
			day = '0'+day;
		}
		if(h<10){
			h = '0' + h;
		}
		if(m1 < 10){
			m1 = '0' + m1;
		}

		return d.getFullYear(d)+'-'+m+'-'+day + ' ' + h+':'+m1;
	}


    var getParam = function(name){
        try{
            var reg = new RegExp("(^|&|\\?|\\#)+" + name + "=(.*?)(?=(&|$))", "g");
            var r = window.location.href.match(reg);
            r = r[0].match(/\=.*?$/);
            return r[0].replace('=','');
        }catch(e){
            return false;
        }
    };	

    var getNums = function(x){
    	if(x===0){
    		return 0;
    	}
		var f_x = parseFloat(x);  
		if (isNaN(f_x))  
		{  
		//alert('function:changeTwoDecimal->parameter error');  
			return 0;  
		}  
		var f_x = Math.ceil(x*100)/100;  
		var s_x = f_x.toString();  
		var pos_decimal = s_x.indexOf('.');  
		if (pos_decimal < 0)  
		{
			return f_x;
		}  
		while (s_x.length <= pos_decimal + 2)  
		{  
			s_x += '0';  
		} 
		return s_x;      	
    }

    var getSize = function(size){
        var prec = 3;
        var size = Math.round(Math.abs(size));
    	var units = ['B','KB','MB',"GB","TB"];

    	var unit =  Math.min(4, Math.floor(Math.log(size) / Math.log(2) / 10));

        size = size * Math.pow(2, -10 * unit);
        var digi = prec - 1 - Math.floor(Math.log(size) / Math.log(10));
        size = Math.round(size * Math.pow(10, digi)) * Math.pow(10, -digi);


        return getNums(size) + units[unit];    	
    }

    var getStatus = function(status,approve){
    	// /0 已审核 1 审核中  2 已归档 3 已关闭
    	switch(status){
    		case 0:
    			if(approve === 0){
    				return '审核不通过';
    			}else{    		
    				return '已审核';
    			}
    		case 1:
    			if(approve === 0){
    				return '审核不通过';
    			}else{
    				return '审核中';	
    			}
    			
    		case 2:
    			return '已归档';
    		case 3:
    			return '已关闭';
    		case 4:
    			return '已删除';    			
    	}
    }

    var showLogType = function(type){
        //操作类型 1: 上传, 2: 下载, 3: copy, 4: move, 5: modify
        //6: delete 7: 预览 8: 保存, 9: 分享给用户 10: 分享给小组, 
        //11: delete(移动到回收站) 12: 创建文件夹    	
    	switch(type){
    		case 1:
    			return '上传';
    		case 2:
    			return '下载';
    		case 3:
    			return '复制';
    		case 4:
    			return '移动';
    		case 5:
    			return '修改';
    		case 6:
    			return '删除';
    		case 7:
    			return '预览';
    		case 8:
    			return '保存';
    		case 9:
    			return '分享给用户';
    		case 10:
    			return '分享给小组';
    		case 11:
    			return '移动到回收站';
    		case 12:
    			return '创建文件夹';

    	}
    }

    var showNav = function(type){
    	$('#pageNav .nav').removeClass('selected');
    	$('#pageNav .'+type+'space').addClass('selected');
    }

	//expose
	util.bind = bind;
  	util.lenReg = lenReg;
  	util.sub_str = sub_str;
	util.getCookie = getCookie;
	util.encodeHTML = encodeHTML;
	util.encodeAttr = encodeAttr;
	util.transStr = transStr;
	util.template = template;
	util.newClass = newClass;
	util.time = formatTime;
	util.cookie = cookie;
	util.getParam = getParam;
	util.getSize = getSize;
	util.getNums = getNums;
	util.getStatus = getStatus;
	util.logType = showLogType;
	util.showNav = showNav;

	return util;

});

define('cache',['config'],function(config){

	var ls = window.localStorage,
		ss = window.sessionStorage;

	var	handerObj = $(Schhandler);

	var cache = {

	}

	function setCache(e,d){
		if(d.type){
			ls.setItem(d.key,JSON.stringify(d.data));
		}else{
			cache[d.key] = d.data;
		}
	}

	function getCache(d){
		if(cache[d]){
			return cache[d];
		}else{
			return JSON.parse(ls.getItem(d)) || false;	
		}
		
	}

	var handlers = {
		'cache:set' : setCache	
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}

	return {
		get : getCache
	}
});
define('helper/templateManager',[],function(){
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
			//template = $('#'+tplid).html();
			if(template){
				templateList[tplid] = template;
				return template;
			}
			var startTime = new Date().getTime();
			template = $.ajax({
				url: tmplPath+tplid+tmplName,
				async: false,
				error : function(data){
					return false;
				}
			}).responseText;

			var endTime = new Date().getTime();

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
define('helper/view',['helper/util','helper/templateManager'],function($u,$tm){

	var loop = function() {};

	var View = $u.newClass({	
		init : function(options){
			this.before = loop;
			this.after = loop;
			this.handlers = {};
			if(options){
				this.target = options.target || null;
				this.tplid = options.tplid;
				this.data = options.data || {};
				this.handlers = options.handlers || {};
				this.cgiurl = options.cgiurl || null;
				this.param = options.param;
				this.append = options.append || false;

				this.events = options.events || {};

				// 渲染模板前后调用的方法
				this.before = options.before || loop;
				this.after = options.after || loop;
			}
		},
		expand : function(options){
			this.target = options.target || this.target;
			this.tplid = options.tplid || this.tplid;
			this.data = options.data || this.data || {};
			$.extend(this.handlers,options.handlers || {});

			this.cgiurl = options.cgiurl || null;
			this.param = options.param;
			this.append = options.append || false;
		},
		createPanel : function(){
			this.before.call(this);

			var opts = {
				html : $u.encodeHTML,
				attr : $u.encodeAttr
			};
			if(this.data){
				$.extend(this.data,opts);

				renderPanel(this.target,this.tplid,this.data);
				bindHandlers(this.target,this.handlers, this.events);
			}

			this.after.call(this);
		},
		appendPanel : function(){
			this.before.call(this);

			var opts = {
				html : $u.encodeHTML,
				attr : $u.encodeAttr
			};
			if(this.data){
				$.extend(this.data,opts);
				appendPanel(this.target,this.tplid,this.data);
				bindHandlers(this.target,this.handlers, this.events);
			}

			this.after.call(this);
		},
		beginPanel : function(){
			this.before.call(this);

			var opts = {
				html : $u.encodeHTML,
				attr : $u.encodeAttr
			};
			if(this.data){
				$.extend(this.data,opts);
				beginPanel(this.target,this.tplid,this.data);
				bindHandlers(this.target,this.handlers, this.events);
			}

			this.after.call(this);
		},
		beforePanel : function(){
			this.before.call(this);

			var opts = {
				html : $u.encodeHTML,
				attr : $u.encodeAttr
			};
			if(this.data){
				$.extend(this.data,opts);
				beforePanel(this.target,this.tplid,this.data);
				bindHandlers(this.target,this.handlers, this.events);
			}

			this.after.call(this);
		},
		replacePanel : function(){
			this.before.call(this);

			var opts = {
				html : $u.encodeHTML,
				attr : $u.encodeAttr
			};
			if(this.data){
				$.extend(this.data,opts);
				replacePanel(this.target,this.tplid,this.data);
				//bindHandlers(this.target,this.handlers, this.events);
			}

			this.after.call(this);
		},
		getHtml : function(){
			return getHtml(this.tplid,this.data);
		}
	});

	/*
	* 绑定事件
	*
	* @param  {object} target 目标节点
	* @param  {object} handlers 需绑定的事件
	* handlers 说明 
	* //直接绑定整个dom
	* {
	*	event : function
	* }
	* 列如 
	*{
	*	mousedown : function(){}
	*}
	* //绑定指定的dom 
	*{
	*	selecter : {
	*		event : function
	*	}
	*}
	*例如
	*{
	*	'#id' : {
	*		event : function(){}
	*	}
	*}
	*/
	function bindHandlers(target,handlers, events){
		for(var i in handlers){
			if(typeof handlers[i] === 'function'){
				target.off(i);
				target.bind(i,handlers[i]);
			}else{
				var handlerList = handlers[i];
				//target = $(i);
				//target.undelegate();
				for(var j in handlerList){
					target.undelegate(i,j);
					target.delegate(i,j,handlerList[j]);
				}
			}
		}

		for(var i in events){
			var handlerList = events[i];
			target = $(i);
			target.off();
			for(var j in handlerList){
				target.on(i,j,handlerList[j]);
			}
		}
	}

	/*
	* 填充模版
	* 
	* @param {object} target 目标节点
	* @param {string} tplid 模版id
	* @param {object} data 数据
	* handlers 说明 
	* //直接绑定整个dom
	* {
	*	event : function
	* }
	* 列如 
	*{
	*	mousedown : function(){}
	*}
	* //绑定指定的dom 
	*{
	*	selecter : {
	*		event : function
	*	}
	*}
	*例如
	*{
	*	'#id' : {
	*		event : function(){}
	*	}
	*}
	*/	
	function renderPanel(target,tplid,data, append){
		var template = $tm.get(tplid);
		var html = $u.template(template,data);
		if(append) return target.append(html);
		return target.html(html);
	}

	function appendPanel(target,tplid,data){
		var template = $tm.get(tplid);
		var html = $u.template(template,data);	
		return target.append(html);	
	}

	function beginPanel(target,tplid,data){
		var template = $tm.get(tplid);
		var html = $u.template(template,data);	
		return target.prepend(html);	
	}

	function beforePanel(target,tplid,data){
		var template = $tm.get(tplid);
		var html = $u.template(template,data);	
		return target.before(html);	
	}

	function replacePanel(target,tplid,data){
		var template = $tm.get(tplid);
		var html = $u.template(template,data);	
		console.log(target);
		console.log(html);
		return target.replaceAll(html);	
	}

	function getHtml(tplid,data){
		var template = $tm.get(tplid);
		var html = $u.template(template,data);	
		return html;
	}

	// added by jarvisjiang
	// try{
	// 	$.extend(View.prototype, {
	// 		set target(target) {
	// 			this.target = target;
	// 		},
	// 		set tplid(tplid) {
	// 			this.tplid = tplid;
	// 		},
	// 		set data(data) {
	// 			this.data = data;
	// 		},
	// 		set handlers(handlers) {
	// 			this.handlers = handlers;
	// 		},
	// 		set append(append) {
	// 			this.append = append;
	// 		},
	// 		set before(before) {
	// 			this.before = before;
	// 		},
	// 		set after(after) {
	// 			this.after = after || loop;
	// 		}
	// 	});
	// }catch(e){
	// 	alert(e);
	// }

	return View;
});
define('helper/request',[], function() {
  

  var loop = function(d) {

  };

  // 打点计时用
  var ReqTime = function(url) {
    this._start = +new Date();
    // 传递cgi
    this._url = url;
  };
  // try{
  // ReqTime.prototype = {
  //   get url() {
  //     return this._url;
  //   },
  //   get time() {
  //     return +new Date() - this._start;
  //   },
  //   set url(url) {
  //     this._url = url;
  //   },
  //   set start(time) {
  //     this._start = time;
  //   }
  // };
  // }catch(e){
    
  // }

  /*
  * @author: jarvisjiang
  * @date: 2013-08-20
  * @desc: 从cgi拉数据，两种api调用方式，error处理函数不是必须的
  * @params: 
  *   option: {cgi: String[, method: String, type: String, timeout: Int, data: {}, success: Function, error: Function]}
  *   [onSuccess: Function]
  *   [onError: Function]
  * @api: public
  * @example:
  *   request({cgi: 'http://appbox.qq.com/cgi-bin/path', success: function(){}, error: function(){}});
  *   request({cgi: 'http://appbox.qq.com/cgi-bin/path'}, function(){}, function(){});
  */
  var request = function(option, onSuccess, onError, always) {
    var timer = new ReqTime();

    option = option || {};

    var method = option.method ? option.method.toUpperCase() : 'GET',
      cgi = option.cgi,
      data = option.data || {},
      type = option.type || 'json',
      async = option.async == false ? false : true,
      timeout = parseInt(option.timeout, 10) || 10000; // 默认超时设置

    if(!cgi) {
      throw new Error('require cgi');
    }

    if(!onSuccess || typeof onSuccess != 'function') {
      onSuccess = option.success;
      if(!onSuccess || typeof onSuccess != 'function') onSuccess = loop; // throw new Error('require success handler'); // cache不用onsuccess
    }

    if(!onError || typeof onError != 'function') {
      onError = option.error;
      if(!onError || typeof onError != 'function') {
        onError = function(d,e){
          if(e == 'timeout'){
            onSuccess({err:78});
          }
        };
      }
    }

    data._t = Math.random();

    var ajaxOpt = {
      url: cgi,
      type: method,
      async: async,
      timeout: timeout,
      dataType: type,
      data: data
      // 跨域传cookie
      // xhrFields: {
      //   withCredentials: true
      // },
      // beforeSend: function(xhr, settings) {
      //   timer.url = settings.url
      //   timer.start = +new Date();
      // }
    };

    ajaxOpt.success = function(res) {
      return onSuccess(res);
    };

    ajaxOpt.error = function(xhr, err) {
      //report.rc(timer.url, 2, 500, timer.time);

      return onError(xhr, err);
    };
    var xhr = $.ajax(ajaxOpt);
    if('function' == typeof always) xhr.always(always);
  };

  request.get = function(option, onSuccess, onError, always) {
    option.method = 'GET';
    return request(option, onSuccess, onError, always);
  };
  request.post = function(option, onSuccess, onError, always) {
    option.method = 'POST';
    return request(option, onSuccess, onError, always);
  };

  return request;
});
define('model.group',['config','helper/request','helper/util','cache'],function(config,request,util,Cache){
	var handerObj = $(Schhandler);

	function convent(d){
		var list = d.result.list;
		var prep = [];
		var school = 0;
		var pt = 0;
		var g2key = {};
		for(var i in list){
			list[i] = conventGroup(list[i]);
			g2key[list[i].id] = list[i];
		}

		return {
			list : list,
			g2key : g2key,
			total : d.result.total
		}		
	}

	function conventGroup(data){
		data.id = data._id;
		data.pre = util.getNums(data.used/data.size)*100;
		if(data.size){
			data.size = util.getSize(data.size);
		}else{
			data.size = 0;
		}
		if(data.used){
			data.used = util.getSize(data.used);
		}else{
			data.used = 0;
		}		
		data.stname = util.getStatus(data.status,data.validateStatus);
		data.osize = data.size;
		data.oused = data.used;
		data.st = data.startTime;
		//容错	
		if(!data.archivable){
			data.archivable = 0;
		}
		if(!data.memberCount){
			data.memberCount = 1;
		}
		if(!data.folderCount){
			data.folderCount = 1;
		}		
		return data;
	}	

	function conventUid2key(data){
		var list = {};
		for(var i =0,l=data.length;i<l;i++){
			var item = data[i];
			item.id = item._id;
			list[item.id] = item;
		}
		handerObj.triggerHandler('cache:set',{key: 'alluser2key',data: list});
	}		

	function conventMembers(list){
		var ml = [];
		for(var i in list){
			if(list[i]){
			ml.push(list[i]._id);
			}
		}
		return ml;
	}

	function convent2Members(list){
		var ml = {};
		for(var i in list){
			if(list[i]){
			list[i].id = list[i]._id;
			ml[list[i]._id] = list[i];
			}
		}
		return ml;
	}

	//拉小组列表
	function getList(e,d){
		var opt = {
			cgi : config.cgi.mlistgroup,
			data : d
		}		

		// if(d.type == 3){
		// 	var ret = Cache.get('preps');
		// 	handerObj.triggerHandler('group:loaded',ret);
		// 	return;
		// }
		var success = function(d){
			if(d.err == 0){
				handerObj.triggerHandler('group:loaded',convent(d));
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}

		request.get(opt,success);
	}

	//拉小组列表
	function getPlist(e,d){
		d.type = 3;
		var opt = {
			cgi : config.cgi.mlistgroup,
			data : d
		}		

		if(!d.parent){
			var ret = Cache.get('preps');
			handerObj.triggerHandler('group:loaded',ret);
			return;
		}
		var success = function(d){
			if(d.err == 0){
				handerObj.triggerHandler('group:loaded',convent(d));
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}

		request.get(opt,success);
	}	

	function loadPrep(){
		var opt = {
			cgi : config.cgi.mlistgroup,
			data : {
				page : 0,
				pageNum : 0,
				type : 3,
				parent : false
			}
		}		

		var success = function(d){
			if(d.err == 0){
				var ret = convent(d);
				handerObj.triggerHandler('cache:set',{key: 'preps',data: ret,type:1})
				handerObj.triggerHandler('manage:preploaded',ret);
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}

		request.get(opt,success);		
	}	

	//创建小组
	function creatGroup(e,d){

		var opt = {
			cgi : config.cgi.groupcreate,
			data : d
		}

		var success = function(d){
			if(d.err == 0){
				var obj = conventGroup(d.result.data);
				// var g2obj = {};
				// g2obj[obj.id] = obj;
				handerObj.triggerHandler('group:createsuc',obj);
			}
			handerObj.triggerHandler('msg:error',d.err);
		}
		request.post(opt,success);			
	}

	//读组织树
	function loadUser(e,d){
		var departments = Cache.get('departments');
		if(departments){
			handerObj.triggerHandler('group:userloaded',{ type : d.type, ml: d.ml,modify:d.modify, list :departments});
			return;
		}
		var opt = {
			cgi : config.cgi.departments //userlist
		}		
		var success = function(data){
			if(data.err == 0){
				handerObj.triggerHandler('cache:set',{key: 'departments',data: data.result.list,type:1});
				handerObj.triggerHandler('group:userloaded',{ type : d.type, ml: d.ml,modify:d.modify, list :data.result.list});
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);		
	}

	//读取单个小组资料
	function groupInfo(e,d){
		var opt = {
			cgi : config.cgi.groupinfo,
			data : {
				groupId : d
			}
		}
		var success = function(d){
			if(d.err == 0){
				d.result.data.id = d.result.data._id;
				d.result.data.st = d.result.data.startTime || 0;
				d.result.data.mlist = conventMembers(d.result.data.members);
				d.result.data.members = convent2Members(d.result.data.members);
				handerObj.triggerHandler('group:groupinfosuc',d.result.data);
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);	
	}
	//修改群资料
	function groupModify(e,d){
		var opt = {
			cgi : config.cgi.groupmodify,
			data : d
		}	
		var success = function(d){
			if(d.err == 0){
				d.result.data.id = d.result.data._id;
				d.result.data.auth = 1;
				var data = conventGroup(d.result.data);
				handerObj.triggerHandler('msg:error',d.err);
				handerObj.triggerHandler('group:modifysuc',data);
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.post(opt,success);	
	}
	//审核
	function appRove(e,d){
		var opt = {
			cgi : config.cgi.mappgroup,
			data : d
		}
		var id = d.groupId;
		var type = d.validateStatus;
		var success = function(d){
			handerObj.triggerHandler('msg:error',d.err);
			if(d.err == 0){
				handerObj.triggerHandler('group:appsuc',{
					id : id,
					type : type
				});
			}else{

			}
		}
		request.post(opt,success);
	}	

	function folderStatus(e,d){
		var opt = {
			cgi : config.cgi.filestatus,
			data : {
				folderId : d.id
			}
		}	
		var sid = d.sid
		var success = function(d){
			if(d.err == 0){
				d.result.osize = d.result.totalSize;				
				d.result.size = util.getSize(d.result.totalSize);
				d.result.sid = sid;
				handerObj.triggerHandler('group:statusload',d.result);
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}

		request.get(opt,success);			
	}

	var handlers = {
		'group:list' : getList,
		'group:plist' : getPlist,
		'group:loaduser' : loadUser,
		'group:create' : creatGroup,
		'group:one' : groupInfo,
		'group:modify' : groupModify,
		'group:approve' : appRove,
		'group:loadprep' : loadPrep,
		'group:folderstatus' : folderStatus
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}
});
define('view.group',['config','cache','helper/view','helper/util','model.group'],function(config,Cache,View,Util){
	var handerObj = $(Schhandler);
	var isInit = false, //初始化
		isListBind = false, //已经绑定
		isLoading = false,//正在加载
		nowPage = 0,
		pageNum = config.pagenum,
		nowKey = '',
		nowOrder = 0,
		nowOd = 1,
		nowArch = 0;
		nowOn = 'name',
		nowGroup = null,
		nowType = null;

	var actTarget = $('#actWinZone'),
		actWin = $('#actWin');
	var types = {
		'group' : 1,
		'dep' : 2,
		'prep' : 3,
		'school' : 0,
		'pschool' : 3
	}
	var nowList = [],
		now2key = {};

	var groupHandler = {
		//搜索
		'.group-search-key' : {
			'focus' : function(){
				var t = $(this),
					v = t.val(),
					def = t.attr('data-def');
				if(v == def){
					t.val('');
				}
			},
			'blur' : function(){
				var t = $(this),
					v = t.val(),
					def = t.attr('data-def');
				if(v == ''){
					t.val(def);
				}
			}
		},
		'.group-search-btn' : {
			'click' : function(){
				var v = $('.group-search-key').val(),
					def = $('.group-search-key').attr('data-def');
				if(v != '' && v != def){
					nowKey = v;
					reloadGroup();
					var obj = {
						keyword : v,
						type : types[nowType],
						page : 0
					}
					getGroup(obj);
				}
			}
		},
		//添加备课
		'.add-sem' : {
			'click' : function(){
				var slist = Cache.get('sizegroup');
				//d.sglist = slist;
				var view = new View({
					target : $('#groupModifyZone'),
					tplid : 'manage/group.modify.dl',
					after : function(){
						$('.start-time').pickmeup({
    						format  : 'Y-m-d',
    						hide_on_select : true
						});
						$('.end-time').pickmeup({
    						format  : 'Y-m-d',
    						hide_on_select	: true
						});						
					},
					data : {
						type : nowType,
						st : 1,
						prep : false,
						sglist : slist
					}
				});
				view.createPanel();
			}
		},
		'.group-check' : {
			'click' : function(){
				var t = $(this),
					v = t.val();
				if(v){
					$('.group-prep-span').removeClass('hide');
				}else{
					$('.group-prep-span').addClass('hide');
				}
			}
		},
		//添加小组
		'.add-group' : {
			'click' : function(){
				var data = {
					type : nowType,
					archivable : 0,
					st : 0
				}
				var slist = Cache.get('sizegroup');
				data.sglist = slist;
				data.sizegroup = false;				
				if(nowType == 'prep' || nowType == 'pschool'){
					var prep = Cache.get('preps');
					var grade = Cache.get('grade');
					var subject = Cache.get('subject');	
					var ntime = Cache.get('nowtime');
					data.ntime = ntime;
					data.prep = prep.g2key;
					data.grades = grade;
					data .subject = subject;
				}else if(nowType == 'group'){
					var prep = Cache.get('preps');
					data.prep = prep.g2key;
				}
				var view = new View({
					target : $('#groupModifyZone'),
					tplid : 'manage/group.modify.dl',
					data : data,
					after : function(){
						if(nowType == 'pschool'){
							$('.start-time').pickmeup({
								format  : 'Y-m-d',
								hide_on_select : true
							});


							$('.end-time').pickmeup({
								format  : 'Y-m-d',
								hide_on_select	: true
							});			
						}						
					}
				});
				view.createPanel();
			}
		},
		//删除备课
		'.del-prep' : {
			'click' : function(){
				// console.log(nowGroup);
				// console.log('del');
				var obj = {
					groupId : nowGroup.id,
					status : 4
				}
				handerObj.triggerHandler('group:modify',obj);
			}
		},		
		//删除小组
		'.del-group' : {
			'click' : function(){
				// console.log(nowGroup);
				// console.log('del');
				var obj = {
					groupId : nowGroup.id,
					status : 4
				}
				handerObj.triggerHandler('group:modify',obj);
			}
		},
		//审核通过
		'.apv-pass' : {
			'click' : function(){
				var obj = {
					groupId : nowGroup.id,
					status : 0,
					validateText : 'pass',
					validateStatus : 1
				}
				//handerObj.triggerHandler('group:modify',obj);				
				handerObj.triggerHandler('group:approve',{
					groupId:nowGroup.id,
					validateText : 'pass',
					validateStatus : 1
				});				
			}
		},
		//审核不通过
		'.apv-notpass' : {
			'click' : function(){
				var obj = {
					groupId : nowGroup.id,
					status : 1,
					validateText : 'pass',
					validateStatus : 0
				}
				//handerObj.triggerHandler('group:modify',obj);				
				handerObj.triggerHandler('group:approve',obj);
			}
		},
		//保存修改
		'.btn-save' : {
			'click' : function(){
				var modify = $(this).attr('data-modify');
				var name = $('#modifyZone .group-name').val();
				var archivable = $('#modifyZone input[type=radio]:checked').val();
				var sgid = $('.group-size-group').val();
				var status = $('.group-status').val();

				var managelist = [],
					memberlist = [];
				var st = 0,
					et = 0;

				$('#groupManageList i').each(function(){
					managelist.push($(this).attr('data-id'));
				});
				$('#groupMemberList i').each(function(){
					memberlist.push($(this).attr('data-id'));
				});	

				var close = 0;
				if($('.group-status:checked').length){
					close = 1;
				};


				var sem = 0;
				if(nowType == 'prep' || nowType=='pschool'){
					//添加学年
					if($('.start-time').length){
						sem = 1;
						st = $('.start-time').pickmeup('get_date').getTime();
						et = $('.end-time').pickmeup('get_date').getTime();
						et += 3600*24000;
						et -= 1000;
						if(st >= et){
							alert('结束时间不能早于开始时间')
						}
						
						if(name == ''){
							alert('你还没有填写学年名称');
							return;
						}

					//添加科目
					}else{
						var pid = $('#prepPrep').val();
						var gid = $('#gradePrep').val();
						var sid = $('#subjectPrep').val();
						name = checkPrep(pid,gid,sid);
						if(!name){
							alert('该学年下已有同名备课目录');
						}
						if(memberlist.length ==0){
							alert('你还没选择小组成员');
							return;
						}
					}

				}else{
					if(name == ''){
						alert('你还没有填写分组名');
						return;
					}
					if(nowType != 'pschool' && managelist.length == 0 && memberlist.length ==0){
						alert('你还没选择成员或者管理员');
						return;
					}
				}


				var obj = {
					name : name,
					content : '',
					status : 0,
					type : types[nowType]
				}

				if(memberlist.length){
					obj.members = memberlist;
				}
				if(managelist.length){
					obj.managers = managelist;
				}

				if(nowType == 'group'){
					obj.archivable = archivable;
					if(parseInt(archivable)){
						var preps = Cache.get('preps'),
							prepobj = preps.g2key;
						obj.grade = $('.group-prep').val();
						obj.startTime = prepobj[obj.grade].startTime;
						obj.endTime = prepobj[obj.grade].endTime;
					}
					obj.sizegroupId = sgid;
				}else if(nowType == 'dep'){
					var order = $('.group-no').val();
					obj.order = order;
					obj.sizegroupId = sgid;
				}else if(nowType == 'prep' || nowType == 'pschool'){
					if(sem){
						obj.startTime = st;
						obj.endTime = et;
					}else{
						obj.parentId = pid;
						obj.grade = gid;
						obj.tag = sid;						
					}
				}

				if(modify){
					id = $('#modifyZone .group-name').attr('data-id');
					obj.groupId = id;
					if(close){
						obj.status = 3;
					}else{
						obj.status = 0;
					}
					if(obj.name == nowGroup.name){
						delete obj.name;
					}
					handerObj.triggerHandler('group:modify',obj);	
				}else{
					handerObj.triggerHandler('group:create',obj);	
				}
				
			}
		},
		//取消修改
		'.btn-reset' : {
			'click' : function(){
				var id = $(this).attr('data-id');
				if(id){
					$('.group-tr'+id).click();
				}else{
					$('#groupModifyZone').hide();
				}
			}
		},
		//设置管理员
		'.btn-set-manage' : {
			'click' : function(){
				var modify = $(this).attr('data-modify');
				if(!isLoading){
					isLoading = true;
					handerObj.triggerHandler('group:loaduser',{type : 1,modify:modify});
				}
			}
		},
		//设置成员
		'.btn-set-member' : {
			'click' : function(){
				var modify = $(this).attr('data-modify');
				if(!isLoading){
					isLoading = true;
					handerObj.triggerHandler('group:loaduser',{type : 0,modify:modify});
				}
			}
		},
		//删除用户
		'.del-share-user' : {
			'click' : function(){
				var t = $(this),
					id = t.attr('data-id');
				delShareUser({_id:id});				
			}
		},
		//排序
		'.group-order' : {
			'click' : function(){
				var t = $(this),
					on = t.attr('data-on'),
					od = t.attr('data-od');
				if(on != nowOd || od != nowOd){
					nowOd = od;
					nowOn = on;
					reloadGroup();
					nowOrder = 0;
					getGroup({
						page : 0,
						order : '{'+nowOn+':'+nowOd+'}'
					});
				}

			}
		},
		//更多
		'.next-group-page' : {
			'click' : function(){
				var t = $(this),
					next = t.attr('data-next');
				if(next){
					var order = '{'+nowOn+':'+nowOd+'}';
					if(nowOrder){
						order = nowOrder;
					}

					getGroup({
						order : order,
						keyword : nowKey,
						page : nowPage
					});
				}
			}
		}
	}

	//验证备课目录是否已经存在同名的.
	function checkPrep(pid,gid,sid){
		var p = Cache.get('preps'),
			prep = p.g2key,
			grade = Cache.get('grade'),
			subject = Cache.get('subject');
		var item = prep[pid];
		if(!item){
			return false;
		}
		if(item.grade == gid && item.tag == sid){
			return false;
		}
		if(grade[gid] && subject[sid]){
			return grade[gid]+subject[sid];
		}else{
			return false;
		}
		
	}


	function bind(){
		$('#groupTable').on('click','.group-tr',function(e){
			var t = $(this),
				id = t.attr('data-id'),
				status = t.attr('data-status'),
				arch = t.attr('data-arch');
			var t1 = $(e.target),
				fid = t1.attr('data-fid'),
				sid = t1.attr('data-sid');
			//显示统计
			if(fid){
				if(!isLoading){
					handerObj.triggerHandler('group:folderstatus',{
						id: fid,
						sid : sid || 0
					});
				}
				return;
			}

			$('#groupTable .group-tr').removeClass('group-tr-selected');
			t.addClass('group-tr-selected');
			if(id){
				if(!isLoading){
					nowArch = arch;
					isLoading = true;
					handerObj.triggerHandler('group:one',id);
				}
			}
		})
	}


	function init(type){
		nowPage = 0;
		nowKey = '';
		var obj = {
			target : $('#groupMa'),
			tplid : 'manage/group',
			data : {
				type : type
			},
			after : function(){
				$('#groupMa').removeClass('hide');
				isInit = true;
				//清空缓存
				nowList = [];
				now2key = {};

				bind();

				var view = new View({
					target : $('#modifyZone'),
					tplid : 'manage/group.modify',
					data : {
						type : type
					}
				});
				view.createPanel();

				if(!isLoading){
					var obj = {
						page : nowPage,
						pageNum : pageNum,
						type : types[type]
					}

					obj.order = '{"'+nowOn+'":'+nowOd+'}';
					if(type == 'dep'){
						nowOrder = '{"status":1,"order":1}';
						obj.order = nowOrder;
					}
					if(nowType == 'pschool'){
						obj.parent = false;
					}else if(nowType == 'prep'){
						obj.parent = true;
					}


					isLoading = true;	
					if(type=='pschool' || type=='prep'){
						handerObj.triggerHandler('group:plist',obj);
					}else{
						handerObj.triggerHandler('group:list',obj);	
					}
					
				}


				if(objTit){
					objTit.target = $('#tableTit');
					var view = new View(objTit);
					view.createPanel();
				}
			}
		};
		if(!isInit){
			obj.handlers = groupHandler;
		}

		if(type != nowType){
			nowType = type;
			var objTit = {
				tplid : 'manage/group.tit',
				data : {
					type : type,
					od : nowOd,
					on : nowOn
				}
			}
		}

		nowType = type;

		var view = new View(obj);
		view.createPanel();
	}


	function getGroup(obj){
		if(!isLoading){
			obj.pageNum = pageNum;
			obj.type = types[nowType];
			isLoading = true;	
			if(nowType == 'prep'){
				obj.parent = true;
				handerObj.triggerHandler('group:plist',obj);
			}else{
				handerObj.triggerHandler('group:list',obj);	
			}
			
		}
	}

	function resetKey(){
		nowKey = '';
	}

	//重新加载
	function reloadGroup(){
		var objTit = {
			tplid : 'manage/group.tit',
			data : {
				type : nowType,
				od : nowOd,
				on : nowOn,
				keyword : nowKey
			}
		}		
		objTit.target = $('#tableTit');
		nowPage = 0;
		nowArch = 0;
		nowGroup = null;
		isLoading = false;
		if(nowType === 'dep'){
			nowOrder = '{"status":1,"order":1}';			
		}

		var view = new View(objTit);
		view.createPanel();		
		$("#tableBody").html('');
	}

	//单个小组加载完成
	function groupInfo(e,d){
		isLoading = false;
		d.archivable = nowArch;
		nowGroup = d;
		//if(nowType == 'group'){
			d.prep = Cache.get('preps').g2key;
		//}
		if(nowType == 'prep' || nowType == 'pschool'){
			d.subject = Cache.get('subject');;
			d.grades = Cache.get('grade');
		}
		var slist = Cache.get('sizegroup');
		d.sglist = slist;
		d.type = nowType;

		//console.log(d,nowType);
		var view = new View({
			target : $('#groupModifyZone'),
			tplid : 'manage/group.modify.dl',
			data : d,
			after : function(){
				if(nowType == 'pschool'){
					var st = new Date(d.startTime);
					var et = new Date(d.endTime);
					// $('.start-time').datetimepicker({
					// 	timepicker:false,
					// 	value:st,
					// 	format:'Y-m-d',
					// 	lang:'ch'
					// });
					// $('.end-time').datetimepicker({
					// 	timepicker:false,
					// 	value:et,
					// 	format:'Y-m-d',
					// 	lang:'ch'
					// });	
					$('.start-time').pickmeup({
						format  : 'Y-m-d',
						hide_on_select : true
					}).val(Util.time(st));

					$('.start-time').pickmeup('set_date', st);

					$('.end-time').pickmeup({
						format  : 'Y-m-d',
						hide_on_select	: true
					}).val(Util.time(et));		
					$('.end-time').pickmeup('set_date', et);				
				}
			}		
		});
		view.createPanel();
		if(d.status == 1){
			$('.group-action-btn button').removeClass('active').prop({
				'disabled' : false
			});
			
		}else{
			$('.group-action-btn button.apv-pass').addClass('active').prop({
				'disabled' : true
			});
			$('.group-action-btn button.apv-notpass').addClass('active').prop({
				'disabled' : true
			});						
			if(d.status != 4){
				$('.group-action-btn button.del-group').removeClass('active').prop({
					'disabled' : false
				});
			}else{
				$('.group-action-btn button.del-group').removeClass('active').prop({
					'disabled' : true
				});				
			}
			$('.group-action-btn button.del-prep').removeClass('active').prop({
				'disabled' : false
			});						
		}
	}

	//小组列表加载完成
	function groupLoad(e,d){
		//status : 0 已审核 1 审核中  2 已归档 3 已关闭
		isLoading = false;
		d.type = nowType;
		var prep = Cache.get('preps').g2key;
		var grade = Cache.get('grade');
		var subject = Cache.get('subject');		

		d.glist = grade;
		d.subject = subject;
		d.prep = prep;

		var view = new View({
			target : $('#tableBody'),
			tplid : 'manage/group.list',
			data : d
		});
		view.appendPanel();
		if(nowType == 'pschool'){
			$('.next-group-page').removeAttr('data-next').text('已经全部加载完了');
			return;	
		}
		if($('#tableBody tr').length < d.total){
			nowPage++;
			$('.next-group-page').attr('data-next',1);
		}else{
			$('.next-group-page').removeAttr('data-next').text('已经全部加载完了');
		}
	}

	//用户选择处理
	function getUList(id,list){
		for(var i = 0,l=list.length;i<l;i++){
			var item = list[i];
			if(item._id == id){
				return item;
			}
			if(item.children){
				var ret = getUList(id,item.children);
				if(ret){
					return ret;
				}
			}
		}
		return null;
	}

	//添加
	function addShareUser(obj,type){
		//console.log(obj);
		var id = 'memberUser';
		//管理员
		if(type){
			id = 'manageUser';
		}
		obj.tid = id;
		if($('.'+id+obj._id).length==0){
			var view = new View({
				target : $('#shareToUser'),
				tplid : 'manage/share.user.span',
				data : obj
			});
			view.appendPanel();
		}
	}
	//删除
	function delShareUser(obj,type){
		var id = 'memberUser';
		//管理员
		if(type){
			id = 'manageUser';
		}

		$('.'+ 	id+obj._id).remove();
		$('.userClick'+obj._id).prop({
			'checked':false
		}).parents('ul.child').prevAll('.dep-click').prop({
			'checked':false
		});
	}

	//分享的用户列表
	function userList(list,target){

		var selected = target.find('.dep-click:checked').length;
		var view = new View({
			target : target,
			tplid : 'share.user.li',
			data : {
				list : list.children,
				ulist : list.users,
				selected : selected
			},
			after : function(){
				target.find('.plus').unbind().bind('click',function(e){
						var target = $(e.target),
							id = target.attr('data-id');
						var p = target.parent('li');
						if(p.find('ul').length > 0){
							var ul = p.find('ul')[0];
							if(target.hasClass("minus")){
								target.removeClass('minus');
								p.find('ul').hide();
							}else{
								target.addClass('minus');
								p.find('ul').show();
							}
							return;
						}else{	
							target.addClass('minus');
							var p = target.parent('li');
							userList(getUList(id,list.children),p);
						}
				});
			}			
		});
		view.appendPanel();
	}

	//用户列表加载完成
	function userLoaded(e,d){
		isLoading = false;
		var data = {
			list : d.list
		}
		if(d.modify){
			data.members = nowGroup.members;
			data.type = d.type;
		}
		var view = new View({
			target : actTarget,
			tplid : 'manage/user',	
			data : data,
			after : function(){
				$("#actWin").modal('show');
			},
			handlers : {
				'.del-share-user' : {
					'click' : function(){
						var t = $(this),
							id = t.attr('data-id');
						delShareUser({_id:id});
					}
				},
				'.user-click' : {
					'click' : function(){
						var t = $(this),
							id = t.val(),
							nick = t.attr('data-val');
						if(t.prop('checked')){
							addShareUser({
								_id : id,
								nick : nick
							});
						}else{
							delShareUser({_id:id});	
						}

					}
				},
				'.plus' : {
					'click' : function(){
						var target = $(this),
							id = target.attr('data-id');
						var p = target.parent('li');
						if(p.find('ul').length > 0){
							var ul = p.find('ul')[0];
							if(target.hasClass("minus")){
								target.removeClass('minus');
								p.find('ul').hide();
							}else{
								target.addClass('minus');
								p.find('ul').show();
							}
							return;
						}else{	
							target.addClass('minus');
							var p = target.parent('li');
							userList(getUList(id,d.list),p);
						}						
					}
				},
				'.list-link' : {
					'click' : function(){
						var t = $(this),
							p = t.parent('li');
						p.find('input').click();
					}
				},
				'.dep-click' : {
					'click' : function(){
						var t = $(this),
							v = t.val(),
							p = t.parent('li');
						var check = t.prop('checked');
						p.find('ul input').prop({'checked':check});
						var list = getUList(v,d.list);
						if(list.users){
							var ul = list.users;
							for(var i=0,l=ul.length;i<l;i++){
								var item = ul[i];
								if(check){
									addShareUser(item,d.type);
								}else{
									delShareUser(item,d.type);
								}
							}
						}

					}
				},
				'.btn-share' : {
					'click' : function(){
						var fls = [];						
						var li = [];
						for(var i in d.files){
							fls.push(d.files[i].id);
						}
						actTarget.find('input:checked').each(function(){
							li.push($(this).val());
						});
						if(li.length===0){
							return;
						}
						//管理员
						if(d.type){
							$('#groupManageList').html($('#shareToUser').html());
						//成员
						}else{
							$('#groupMemberList').html($('#shareToUser').html());
						}
					}
				}
			}			
		});
		view.createPanel();		
	}

	function statusLoad(e,d){
		isLoading = false;
		var sglist = Cache.get('sizegroup');
		if(d.sid){
			d.allsize = sglist[d.sid].size;
			d.pre = Math.round(Util.getNums(d.osize/d.allsize)*100);			
		}

		var view = new View({
			target : $("#groupModifyZone"),
			tplid : 'manage/status',
			data : d,
			after : function(){
				if(!d.totalCount){
					return;
				}
				var list = [],
					clist = [];
				var filetype = config.filetype;
				for(var i in d.list){
					var item = d.list[i];
					list.push([filetype[item.type],item.size,item.count]);
					clist.push([filetype[item.type],item.count]);
				}
				
				var plot2 = jQuery.jqplot ('preImg', [list],{
					seriesDefaults: {
						renderer: jQuery.jqplot.PieRenderer, 
						rendererOptions: {
							padding: 20, 
							// Turn off filling of slices.
							fill: true,
							showDataLabels: true, 
							// Add a margin to seperate the slices.
							sliceMargin: 4, 
							// stroke the slices with a little thicker line.
							lineWidth: 5
							}
						}, 
						legend: { 
							show:true, 
							location: 'e' 
						},
						cursor : {
							show: true,              //是否显示光标  
							showTooltip: true,      // 是否显示提示信息栏  
							followMouse: false,
						}
					}
				);

				var plot3 = jQuery.jqplot ('preImg1', [clist],{
					seriesDefaults: {
						renderer: jQuery.jqplot.PieRenderer, 
						rendererOptions: {
							padding: 20, 
							// Turn off filling of slices.
							fill: true,
							showDataLabels: true, 
							// Add a margin to seperate the slices.
							sliceMargin: 4, 
							// stroke the slices with a little thicker line.
							lineWidth: 5
							}
						}, 
						legend: { 
							show:true, 
							location: 'e' 
						},
						cursor : {
							show: true,              //是否显示光标  
							showTooltip: true,      // 是否显示提示信息栏  
							followMouse: false,
						}
					}
				);	
				$('#preImg1').hide();
			},
			handlers : {
				'.status-size' : {
					'click' : function(){
						$(this).addClass('selected');
						$('.status-count').removeClass('selected');
						$('.preimg-zone').hide();
						$('#preImg').show();
					}
				},
				'.status-count' : {
					'click' : function(){
						$(this).addClass('selected');
						$('.status-size').removeClass('selected');
						$('.preimg-zone').hide();
						$('#preImg1').show();
					}
				},				
			}
		});
		view.createPanel();
	}

	function createSuc(e,d){
		d.type = nowType;
		
		var target = $('<tr data-id="'+d.id+'" class="group-tr group-tr'+d.id+'"></tr>');

		if(nowType == 'prep'){
			//d.g2key = Cache.get('preps').g2key;
			var tg2key = Cache.get('preps').g2key;
			$.extend(tg2key,d.g2key);
			d.g2key = tg2key;
			d.glist = Cache.get('grade');
			d.subject = Cache.get('subject');	
		}else if(nowType == 'group'){
			var tg2key = Cache.get('preps').g2key;
			d.prep = tg2key;
		}
		var view = new View({
			target : target,
			tplid : 'manage/group.list.one',
			data : d
		});
		view.createPanel();		
		$('#tableBody').append(target);
	}

	function modifySuc(e,d){
		if(nowType == 'prep'){
			var tg2key = Cache.get('preps').g2key;
			$.extend(tg2key,d.g2key);
			d.g2key = tg2key;
			d.glist = Cache.get('grade');
			d.subject = Cache.get('subject');	
		}else if(nowType == 'group'){
			var tg2key = Cache.get('preps').g2key;
			d.prep = tg2key;
		}		
		var id = d.id;
		var view = new View({
			target : $('.group-tr'+id),
			tplid : 'manage/group.list.one',
			data : d
		})
		view.createPanel();
	}

	function appSuc(e,d){
		if(d.type == 1){
			$('.group-tr'+d.id+' .td-status').html('已审核');
		}else{
			$('.group-tr'+d.id+' .td-status').html('审核不通过');
		}		
	}

	var handlers = {
		'group:loaded' : groupLoad,
		'group:createsuc' : createSuc,
		'group:userloaded' : userLoaded,
		'group:modifysuc' : modifySuc,
		'group:groupinfosuc' : groupInfo,
		'group:appsuc' : appSuc,
		'group:statusload' : statusLoad
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}

	return {
		init : init
	}
});
define('model.user',['config','helper/request','helper/util','cache'],function(config,request,util,Cache){
	var handerObj = $(Schhandler);

	function convent(obj){
		var list = {};
		for(var i in obj){
			var item = obj[i];
			item.id = item._id;
			item.pre = Math.round(util.getNums(item.used/item.size)*100);
			if(item.size){
				item.size = util.getSize(item.size);
			}else{
				item.size = 0;
			}
			
			if(item.used){
				item.used = util.getSize(item.used);
			}else{
				item.used = 0;
			}

			item.osize = item.size;
			item.oused = item.used;	
			list[item.id] = item;
			//list.push(item);
		}
		return list;
	}

	function userSearch(e,d){
		var opt = {
			cgi : config.cgi.usersearch,
			data : d
		}

		var success = function(d){
			if(d.err == 0){
				var list = convent(d.result.list);
				var total = d.result.total;
				handerObj.triggerHandler('user:listload',{
					list : list,
					total : total
				});
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);			
	}

	function userModify(e,d){
		var opt = {
			cgi : config.cgi.usermodify,
			data : d
		}

		var success = function(data){
			if(data.err == 0){
				handerObj.triggerHandler('user:modifysuc',d);
				// var list = convent(d.result);
				// handerObj.triggerHandler('user:modifysuc',{
				// 	list : list,
				// 	total : total
				// });
			}
			handerObj.triggerHandler('msg:error',data.err);
		}
		request.post(opt,success);			
	}

	function folderStatus(e,d){
		var opt = {
			cgi : config.cgi.filestatus,
			data : {
				folderId : d.id
			}
		}	
		var sid = d.sid;
		var success = function(d){
			if(d.err == 0){
				d.result.osize = d.result.totalSize;
				d.result.size = util.getSize(d.result.totalSize);
				d.result.sid = sid;

				handerObj.triggerHandler('user:statusload',d.result);
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}

		request.get(opt,success);			
	}	

	//读组织树
	function loadUser(e,d){
		var departments = Cache.get('departments');
		if(departments){
			handerObj.triggerHandler('user:depsload',{ list :departments});
			return;
		}
		var opt = {
			cgi : config.cgi.departments //userlist
		}		
		var success = function(data){
			if(data.err == 0){
				handerObj.triggerHandler('cache:set',{key: 'departments',data: data.result.list,type:1});
				handerObj.triggerHandler('user:depsload',{ list :data.result.list});
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);		
	}

	//读目录
	function getFolder(e,d){
		console.log(d);
		var opt = {
			cgi : config.cgi.foldlist,
			data : {
				folderId : d
			}
		}
		var success = function(data){
			handerObj.triggerHandler('user:foldload',data.result);
		}
		request.get(opt,success);
	}

	var handlers = {
		'user:search' : userSearch,
		'user:modify' : userModify,
		'user:folderstatus' : folderStatus,
		'user:getfolder' : getFolder,
		'user:deps' : loadUser
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}

});
define('view.user',['config','cache','helper/view','helper/util','model.user'],function(config,Cache,View,Util){
	var handerObj = $(Schhandler);
	var isInit = {}, //初始化
		userList = {},
		isLoading = false;
		nowUin = 0,
		nowPage = 0,
		nowOrder = '{name:1}',
		nowOd = 1,
		nowOn = 'name',
		nowKey = '',
		pageNum = config.pagenum;

	//组织树初始化
	function despInit(){

	}

	function getUser(obj){
		obj.pageNum = pageNum;
		obj.order = nowOrder;
		handerObj.triggerHandler('user:search',obj);
	}

	//修改用户
	function modifyUser(uin){
		if(userList[uin]){
			var sglist = Cache.get('sizegroup');

			var view = new View({
				target : $('#userModifyBlock'),
				tplid : 'manage/modify.user',
				data : {
					data : userList[uin],
					sglist : sglist
				}
			});
			view.createPanel();
		}
	}

	//清空默认数据
	function reloadUser(){
		nowUin = 0;
		nowPage = 0;
		nowKey = '';
		isLoading = false;
		userList = {};
		$('#userList').html('');
	}

	//用户列表加载完成
	function userLoad(e,d){
		$.extend(userList,d.list);

		if(nowOd == 1){
			$('th.order-'+nowOn).attr('data-od',-1);
			$('th.order-'+nowOn+' i').attr('class','au');
		}else{
			$('th.order-'+nowOn).attr('data-od',1);
			$('th.order-'+nowOn+' i').attr('class','ad');
		}

		var view = new View({
			target : $('#userList'),
			tplid : 'manage/search.user.list',
			data : d
		});
		view.appendPanel();
		if($('#tableBody tr').length < d.total){
			nowPage++;
			$('#userMa .next-group-page').attr('data-next',1);
		}else{
			$('#userMa .next-group-page').removeAttr('data-next').text('已经全部加载完了');
		}		
	}

	function userModifySuc(e,d){
		$('.btn-user-colse').prop({'disabled':true});
		$('.btn-user-open').prop({'disabled':true});

		$.extend(userList[d.userId],d);
		var sglist = Cache.get('sizegroup');

		if(d.sizegroupId){
			userList[d.userId].size = sglist[d.sizegroupId].size;
			userList[d.userId].sizegroup.$id = d.sizegroupId;
			userList[d.userId].pre = Util.getNums(userList[d.userId].used/userList[d.userId].size)*100;
			if(userList[d.userId].size){
				userList[d.userId].size = Util.getSize(userList[d.userId].size);
			}else{
				userList[d.userId].size = 0;
			}			
		}
		if(typeof d.status != 'undefined'){
			$('#tr-user'+d.userId).attr('data-status',d.status);
		}
		var view = new View({
			target : $('#tr-user'+d.userId),
			tplid : 'manage/search.user.list.one',
			data : {
				item : userList[d.userId]
			}
		});
		view.createPanel();
	}

	//用户列表初始化
	function userInit(){
		if(isInit.user){
			nowPage = 0;
			$('#userMa').removeClass('hide');
		}else{
			$('#userMa').removeClass('hide');
			var view = new View({
				target : $('#userMa'),
				tplid : 'manage/search.user',
				data : {
					on : nowOn,
					od : nowOd
				},
				after : function(){
					isInit.user = true;
					getUser({
						page : 0
					});
				},
				handlers : {
					'.next-group-page' : {
						'click' : function(){
							var t = $(this),
								next = t.attr('data-next');
							if(next){
								getUser({
									keyword : nowKey,
									page : nowPage
								});
							}							
						}
					},
					'.user-fold' : {
						'click' : function(){
							var id = $(this).attr('data-id');
							handerObj.triggerHandler('user:getfolder',id);
						}
					},
					'.user-order' : {
						'click' : function(){
							var on = $(this).attr('data-on'),
								od = $(this).attr('data-od');
							nowOn = on;
							nowOd = od;
							nowOrder = '{"'+on+'":'+od+'}';
							reloadUser();
							var obj = {
								page : 0
							}
							getUser(obj);							
						}
					},
					'.user-data' : {
						'click' : function(){
							var id = $(this).attr('data-id');
							var sid = $(this).attr('data-sid');
							handerObj.triggerHandler('user:folderstatus',{
								id : id,
								sid : sid
							});
						}
					},
					'.user-search-key' : {
						'focus' : function(){
							var t = $(this),
								v = t.val(),
								def = t.attr('data-def');
							if(v == def){
								t.val('');
							}
						},
						'blur' : function(){
							var t = $(this),
								v = t.val(),
								def = t.attr('data-def');
							if(v == ''){
								t.val(def);
							}
						}
					},	
					'.tr-user' : {
						'click' : function(e){
							if($(e.target).hasClass('user-data') || $(e.target).hasClass('user-fold')){
								return;
							}
							//$('.btn-user-colse').prop({'disabled':false});
							nowUin = $(this).attr('data-id');
							var status = parseInt($(this).attr('data-status'));

							if(status){
								$('#userMa .btn-user-open').prop({'disabled':false});
								$('#userMa .btn-user-colse').prop({'disabled':true});
							}else{
								$('#userMa .btn-user-open').prop({'disabled':true});
								$('#userMa .btn-user-colse').prop({'disabled':false});
							}

							$('.tr-user').removeClass('group-tr-selected');
							$(this).addClass('group-tr-selected');
							modifyUser(nowUin);
						}
					},
					'.btn-user-open' : {
						'click' : function(){
							var obj = {
								userId : nowUin,
								status : 0
							}
							handerObj.triggerHandler('user:modify',obj);
						}
					},
					'.btn-user-colse' : {
						'click' : function(){
							var obj = {
								userId : nowUin,
								status : 1
							}
							handerObj.triggerHandler('user:modify',obj);
						}
					},
					'.btn-user-save' : {
						'click' : function(){
							var sizeid = $('.user-size-group').val();
							var obj = {
								userId : nowUin,
								sizegroupId : sizeid
							}
							handerObj.triggerHandler('user:modify',obj);
						}
					},
					'.btn-reset' : {
						'click' : function(){
							var id = $(this).attr('data-id');
							if(id){
								$('.tr-user'+id).click();
							}else{
								$('#userModifyBlock').html('');
							}
						}
					},
					'.user-search-btn' : {
						'click' : function(){
							var v = $('.user-search-key').val(),
								def = $('.user-search-key').attr('data-def');
							if(v != '' && v != def){
								nowKey = v;
								reloadUser();
								var obj = {
									keyword : v,
									page : 0
								}
								getUser(obj);
							}
						}
					}

				}
			});
			view.createPanel();
		}
	}

	function statusLoad(e,d){
		isLoading = false;
		var sglist = Cache.get('sizegroup');
		d.allsize = sglist[d.sid].size;
		d.pre = Math.round(Util.getNums(d.osize/d.allsize)*100);
		var view = new View({
			target : $("#userModifyBlock"),
			tplid : 'manage/status.user',
			data : d,
			after : function(){
				if(!d.totalCount){
					return;
				}
				var list = [],
					clist = [];
				var filetype = config.filetype;
				for(var i in d.list){
					var item = d.list[i];
					list.push([filetype[item.type],item.size,item.count]);
					clist.push([filetype[item.type],item.count]);
				}
				
				var plot2 = jQuery.jqplot ('userPreImg', [list],{
					seriesDefaults: {
						renderer: jQuery.jqplot.PieRenderer, 
						rendererOptions: {
							padding: 20, 
							// Turn off filling of slices.
							fill: true,
							showDataLabels: true, 
							// Add a margin to seperate the slices.
							sliceMargin: 4, 
							// stroke the slices with a little thicker line.
							lineWidth: 5
							}
						}, 
						legend: { 
							show:true, 
							location: 'e' 
						},
						cursor : {
							show: true,              //是否显示光标  
							showTooltip: true,      // 是否显示提示信息栏  
							followMouse: false,
						}
					}
				);

				var plot3 = jQuery.jqplot ('userPreImg1', [clist],{
					seriesDefaults: {
						renderer: jQuery.jqplot.PieRenderer, 
						rendererOptions: {
							padding: 20, 
							// Turn off filling of slices.
							fill: true,
							showDataLabels: true, 
							// Add a margin to seperate the slices.
							sliceMargin: 4, 
							// stroke the slices with a little thicker line.
							lineWidth: 5
							}
						}, 
						legend: { 
							show:true, 
							location: 'e' 
						},
						cursor : {
							show: true,              //是否显示光标  
							showTooltip: true,      // 是否显示提示信息栏  
							followMouse: false,
						}
					}
				);	
				$('#userPreImg1').hide();
			},
			handlers : {
				'.status-size' : {
					'click' : function(){
						$(this).addClass('selected');
						$('.status-count').removeClass('selected');
						$('.preimg-zone').hide();
						$('#userPreImg').show();
					}
				},
				'.status-count' : {
					'click' : function(){
						$(this).addClass('selected');
						$('.status-size').removeClass('selected');
						$('.preimg-zone').hide();
						$('#userPreImg1').show();
					}
				},				
			}
		});
		view.createPanel();		
	}

	//部门树
	function depsInit(){
		if(isInit.deps){
			$('#deptreeMa').removeClass('hide');
		}else{
			handerObj.triggerHandler('user:deps');
		}		
	}

	//用户选择处理
	function getUList(id,list){
		for(var i = 0,l=list.length;i<l;i++){
			var item = list[i];
			if(item._id == id){
				return item;
			}
			if(item.children){
				var ret = getUList(id,item.children);
				if(ret){
					return ret;
				}
			}
		}
		return null;
	}		

	//用户列表
	function getuserList(list,target){

		var selected = target.find('.dep-click:checked').length;
		var view = new View({
			target : target,
			tplid : 'manage/deps.user.li',
			data : {
				list : list.children,
				ulist : list.users,
				selected : selected
			},
			after : function(){
				// target.find('.plus').unbind().bind('click',function(e){
				// 		var target = $(e.target),
				// 			id = target.attr('data-id');
				// 		var p = target.parent('li');
				// 		if(p.find('ul').length > 0){
				// 			var ul = p.find('ul')[0];
				// 			if(target.hasClass("minus")){
				// 				target.removeClass('minus');
				// 				p.find('ul').hide();
				// 			}else{
				// 				target.addClass('minus');
				// 				p.find('ul').show();
				// 			}
				// 			return;
				// 		}else{	
				// 			target.addClass('minus');
				// 			var p = target.parent('li');
				// 			getuserList(getUList(id,list.children),p);
				// 		}
				// });
			}			
		});
		view.appendPanel();
	}	

	function depsLoad(e,d){
		var view = new View({
			target : $('#deptreeMa'),
			tplid : 'manage/deps',
			after : function(){
				$('#deptreeMa').removeClass('hide');
				isInit.deps = true;
			},
			data : {
				list : d.list
			},
			handlers : {
				'.plus' : {
					'click' : function(e){
						var target = $(this),
							id = target.attr('data-id');
						var p = target.parent('li');
						if(p.find('ul').length > 0){
							//var ul = p.find('ul')[0];
							//console.log(target.attr('class'),target.hasClass("minus"));
							if(target.hasClass("minus")){
								target.removeClass('minus');
								p.find('ul').hide();
							}else{
								target.addClass('minus');
								p.find('ul').show();
							}
							return;
						}else{	
							target.addClass('minus');
							var p = target.parent('li');
							getuserList(getUList(id,d.list),p);
						}						
					}
				}				
			}
		});
		view.appendPanel();
	}

	function foldLoad(e,d){
		var view = new View({
			target : $('#userModifyBlock'),
			tplid : 'manage/user.fold',
			data : d
		});
		view.createPanel();
	}

	function init(type){
		
		if(type == 'user'){
			userInit();	
		}else{
			depsInit();
		}	
	}

	var handlers = {
		'user:listload' : userLoad,
		'user:modifysuc' : userModifySuc,
		'user:statusload' : statusLoad,
		'user:depsload' : depsLoad,
		'user:foldload' : foldLoad
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}

	return {
		init : init
	}
});
define('view.manage',['config','cache','helper/view','helper/util'],function(config,Cache,View,Util){
	var handerObj = $(Schhandler);
	var isInit = {}, //初始化
		nowSizeGroupId = 0,
		isListBind = false, //已经绑定
		isLoading = false,//正在加载
		nowPage = 0,
		nowDate = new Date().getTime(),
		pageNum = config.pagenum,
		logType = 0,
		logSt = 0,
		logEt = 0,
		nowTYpe = null;

	var manageHandler = {};

	function getObjlength(obj){
		if(!obj){
			return 0;
		}
		var i = 0;
		for(var l in obj){
			i++;
		}
		return i;
	}
	//是否有重名
	function checkObj(n,idx,type){
		var grade = Cache.get('grade');
		var subject = Cache.get('subject');		
		if(type == 'grade'){
			for(var i in grade){
				if(idx != i && grade[i] == n){
					return true;
				}
			}
		}else{
			for(var i in subject){
				if(idx != i && subject[i] == n){
					return true;
				}
			}
		}
		return false;
	}

	function gradeInit(){
		$('.manage-tabs').hide();	
		var grade = Cache.get('grade');
		var subject = Cache.get('subject');

		if(isInit['grade']){
			$('#gradeMange').show();
		}else{
			var view = new View({
				target : $('#manageMa'),
				tplid : 'manage/grade',
				data : {
					grade : grade,
					subject : subject
				},
				after : function(){
					isInit.grade = true;
				},
				handlers : {
					'.grade-tr' : {
						'click' : function(){
							var t = $(this),
								id = t.attr('data-id'),
								type = t.attr('data-type');

							if(type == 'grade'){
								var grade = Cache.get('grade');
								$('#addGrade').removeClass('hide');
								$('#addSubject').addClass('hide');
								$('#gradeNo').val(id).attr('data-old',id);
								$('#gradeName').val(grade[id]);
								$('.btn-save-grade').attr('data-modify',1);
								$('.btn-del-grade').removeClass('hide');	
							}else{
								var subject = Cache.get('subject');
								$('#addSubject').removeClass('hide');
								$('#addGrade').addClass('hide');
								$('#subjectNo').val(id).attr('data-old',id);
								$('#subjectName').val(subject[id]);
								$('.btn-save-sub').attr('data-modify',1);
								$('.btn-del-sub').removeClass('hide');	
							}
						}
					},
					'.add-grade' : {
						'click' : function(){
							$('#addGrade').removeClass('hide');
							$('#addSubject').addClass('hide');
							$('#addGrade input').val('');
							$('.btn-save-grade').removeAttr('data-modify');
							$('.btn-del-grade').addClass('hide');						
						}
					},
					'.add-subject' : {
						'click' : function(){
							$('#addGrade').addClass('hide');
							$('#addSubject').removeClass('hide');
							$('#addSubject input').val('');
							$('.btn-save-sub').removeAttr('data-modify');	
							$('.btn-del-sub').addClass('hide');
						}
					},
					'.btn-del-grade' : {
						'click' : function(){
							var n = $.trim($('#gradeNo').val());
							delete grade[n];
							handerObj.triggerHandler('manage:setkey',{
								key : 'grade',
								value : grade
							});							
						}
					},
					'.btn-del-sub' : {
						'click' : function(){
							var n = $.trim($('#subjectNo').val());
							delete subject[n];
							handerObj.triggerHandler('manage:setkey',{
								key : 'subject',
								value : subject
							});							
						}	
					},					
					'.btn-save-grade' : {
						'click' : function(){
							var v = $.trim($('#gradeName').val());
							var n = $.trim($('#gradeNo').val());
							var on = $('#gradeNo').attr('data-old');
							var modify = $(this).attr('data-modify');							
							if(v == '' || n == ''){
								handerObj.triggerHandler('msg:error',77);
								return;
							}
							if(parseInt(n) == 0 || parseInt(n) > 99){
								handerObj.triggerHandler('msg:error',75);
								return;
							}
							if(grade){
								if(modify){
									//没有重名
									if(checkObj(v,n,'grade') || (grade[n] && n!=on)){
										handerObj.triggerHandler('msg:error',79);
										return;										
									}else{
										delete grade[on];
										grade[n] = v;										
									}
								}else{
									if(!grade[n] && !checkObj(v,n,'grade')){
										grade[n] = v;
									}else{
										handerObj.triggerHandler('msg:error',79);
										return;
									}
								}
							}else{
								grade = {};
								grade[n] = v;
							}
							//return;
							handerObj.triggerHandler('manage:setkey',{
								key : 'grade',
								value : grade
							});
						}
					},
					'.btn-save-sub' : {
						'click' : function(){
							var v = $.trim($('#subjectName').val());
							var n = $.trim($('#subjectNo').val());
							var on = $('#gradeNo').attr('data-old');
							var modify = $(this).attr('data-modify');
							if(v == '' || n == ''){
								handerObj.triggerHandler('msg:error',77);
								return;
							}
							if(parseInt(n) == 0 || parseInt(n) > 99){
								handerObj.triggerHandler('msg:error',75);
								return;
							}
							if(subject){
								if(modify){
									if(checkObj(v,n,'subject') || (subject[n] && n!=on)){
										handerObj.triggerHandler('msg:error',79);
										return;										
									}else{
										delete subject[on];
										subject[n] = v;										
									}
								}else{
									if(!subject[n] && !checkObj(v,n,'subject')){
										subject[n] = v;
									}else{
										handerObj.triggerHandler('msg:error',79);
										return;
									}
								}
							}else{
								subject = {};
								subject[n] = v;
							}
							//return;
							handerObj.triggerHandler('manage:setkey',{
								key : 'subject',
								value : subject
							})														
						}
					}
				}
			});
			view.appendPanel();
		}
	}

	function resetSize(){
		$('#sizeGroupName').val('');
		$('#defSizeGroup').prop({'checked':false});
		$('input[name=stype]').eq(0).prop({'checked':true});
		$('.size-group-val').val('');
		$('.size-type').val(1);		
	}

	function sizeInit(){
		$('.manage-tabs').hide();	
		var grade = Cache.get('grade');
		var subject = Cache.get('subject');

		
		if(isInit.size){
			$('#sizeManage').show();
		}else{		
			var view = new View({
				target : $('#manageMa'),
				tplid : 'manage/size',
				after : function(){
					isInit.size = true;
					var list = Cache.get('sizegroup');
					if(list){
						handerObj.triggerHandler('manage:slistload',{
							list : list	
						})
					}else{
						isLoading = true;
						handerObj.triggerHandler('manage:sgrouplist');
					}

					$('.manage-tabs').hide();	
					$('#sizeManage').show();
				},
				data : {
					list : false
				},
				handlers : {
					'.add-size-group' : {
						'click' : function(e){
							nowSizeGroupId = 0;
							$('.del-size-group').prop({'disabled':true});
							$("#addSize").removeClass('hide');
							$(".btn-save-size").removeClass('hide').removeAttr('data-modify').removeAttr('data-id');
							resetSize();
						}
					},
					'.del-size-group' : {
						'click' : function(e){
							if(nowSizeGroupId){
								if(!isLoading){
									isLoading = true;
									handerObj.triggerHandler("manage:delsgroup",{
										sizegroupId : nowSizeGroupId
									})
								}
							}
						}
					},
					'.btn-save-size' : {
						'click' : function(e){
							var modify = $(this).attr('data-modify');
							if(modify){
								id = $(this).attr('data-id');
							}
							var name = $.trim($('#sizeGroupName').val());
							var type = $('input[name=stype]:checked').val();
							var size = $('.size-group-val').val();
							var st = parseInt($('.size-type').val());
							var def = false;
							if($('#defSizeGroup:checked').length){
								def = true;
							}
							switch(st){
								case 1:
									size = size * 1024;
									break;
								case 2:
									size = size * 1024 * 1024;
									break;
								case 3:
									size = size * 1024 * 1024 * 1024;
									break;
								case 4:
									size = size * 1024 * 1024 * 1024 * 1024;
									break;									
							}
							if(name != '' && st){

							}else{
								alert('分组名和空间大小必填!');
							}
							var obj = {
								name : name,
								type : type,
								size : size,
								isDefault : def
							}
							if(modify){
								obj.sizegroupId = id;
							}
							if(!isLoading){
								isLoading = true;
								if(modify){
									handerObj.triggerHandler('manage:modifysgroup',obj);
								}else{
									handerObj.triggerHandler('manage:addsgroup',obj);
								}
							}
						}
					},
					'.size-group' : {
						'click' : function(e){
							$('.del-size-group').prop({'disabled':false});
							$('.size-group').removeClass('group-tr-selected');
							$(this).addClass('group-tr-selected');
							var id = $(this).attr('data-id');
							nowSizeGroupId = id;
							var list = Cache.get('sizegroup');

							var obj = list[id];

							if(obj){
								$('#defSizeGroup').prop('checked',obj.isDefault);
								$('#sizeGroupName').val(obj.name);
								if(obj.type == 0){
									$('input[name=stype]').eq(0).prop({'checked':true});
								}else{
									$('input[name=stype]').eq(1).prop({'checked':true});
								}
								if(obj.isDefault){
									$('#defSizeGroup').prop({
										'checked':true
									});
								}
								if(obj.size/1024<1024){
									$('.size-group-val').val(obj.size/1024);
									$('.size-type').val(1);
								}else if(obj.size/(1024*1024)<1024){
									$('.size-group-val').val(obj.size/(1024*1024));
									$('.size-type').val(2);
								}else{
									$('.size-group-val').val(obj.size/(1024*1024*1024));
									$('.size-type').val(3);
								}
								$('#addSize').removeClass('hide');
								$('.btn-save-size').attr('data-modify',1).attr('data-id',obj.id);
							}
						}
					}
 				}
			});
			view.appendPanel();
		}
	};

	function logInit(){
		$('.manage-tabs').hide();
		if(isInit['log']){
			$('#logManage').show();
		}else{
			var view = new View({
				target : $('#manageMa'),
				tplid : 'manage/log',
				after : function(){
					isInit.log = true;
					$('.log-start-time').pickmeup({
						format  : 'Y-m-d',
						date : nowDate,
						hide_on_select : true
					});

					$('.log-end-time').pickmeup({
						format  : 'Y-m-d',
						date : nowDate,
						hide_on_select	: true
					});	

					handerObj.triggerHandler('manage:log',{
						page : 0,
						pageNum : pageNum
					});
				},
				handlers : {
					'.next-log-page' : {
						'click' : function(){
							//console.log(1234);
							var t = $(this),
								next = t.attr('data-next');
							if(next){
								var obj = {
									page : nowPage,
									pageNum : pageNum
								}; 
								if(logType){
									obj.type = [logType];
								}
								if(logSt){
									obj.startTime = logSt;
								}
								if(logEt){
									obj.endTime = logEt;
								}								
								handerObj.triggerHandler('manage:log',obj);
							}							
						}
					},
					'.dropdown-menu li' : {
						'click' : function(){
							$('#logType').attr('data-type',$(this).attr('data-type')).text($(this).text());
						}
					},
					'.btn-log-search' : {
						'click' : function(){
							st = $('.log-start-time').pickmeup('get_date').getTime();
							et = $('.log-end-time').pickmeup('get_date').getTime();
							var type = parseInt($('#logType').attr('data-type'));
							if(st == nowDate){
								st = 0;
							}
							if(et == nowDate){
								et = 0;
							}							
							if(st > et){
								alert('开始时间不能小于结束时间!');
								return;
							}
							if(st && st == et){
								alert('开始时间不能小于结束时间!');
								return;								
							}
							if(type || st || et){
								$('#logList').html('');
								$('.next-log-page').removeAttr('data-next');
								var obj = {
									page : 0,
									pageNum : pageNum									
								};
								if(type){
									obj.type = [type];
									logType = type;
								}
								if(st){
									obj.startTime = st;
									logSt = st;
								}
								if(et){
									obj.endTime = et;
									logEt = et;
								}
								handerObj.triggerHandler('manage:log',obj);																
							}else{
								return;
							}

						}
					}
				}
			});
			view.appendPanel();		
		}
	}

	function logLoad(e,d){
		var view = new View({
			target : $('#logList'),
			tplid : 'manage/log.list',
			data : {
				list : d.list,
				logType : Util.logType,
				time : Util.time
			}
		});
		view.appendPanel();
		if($('#logList tr').length < d.total){
			nowPage++;
			$('.next-log-page').attr('data-next',1);
		}else{
			$('.next-log-page').removeAttr('data-next').text('已经全部加载完了');
		}		
	}


	function dataInit(){
		$('.manage-tabs').hide();
		if(isInit.data){
			$('#allStatusBlock').show();
		}else{
			isLoading = true;
			handerObj.triggerHandler('manage:allstatic');
		}
	}

	function allStatic(e,d){
		isLoading = false;
		isInit.data = true;
		d.filetype = config.filetype;

		var view = new View({
			target : $('#manageMa'),
			tplid : 'manage/data',
			data : d,
			after : function(){
				var list = [],
					clist = [];
				var filetype = config.filetype;
				for(var i in d.fileStatistics){
					var item = d.fileStatistics[i];
					list.push([filetype[item.type],item.size,item.count]);
					clist.push([filetype[item.type],item.count]);
				}	
				var plot2 = jQuery.jqplot ('allFilePre', [list],{
					seriesDefaults: {
						renderer: jQuery.jqplot.PieRenderer, 
						rendererOptions: {
							padding: 20, 
							fill: true,
							showDataLabels: true, 
							sliceMargin: 4, 
							lineWidth: 5
							}
						}, 
						legend: { 
							show:true, 
							location: 'e' 
						},
						cursor : {
							show: true,              //是否显示光标  
							showTooltip: true,      // 是否显示提示信息栏  
							followMouse: false,
						}
					}
				);

				var plot3 = jQuery.jqplot ('allFilePre1', [clist],{
					seriesDefaults: {
						renderer: jQuery.jqplot.PieRenderer, 
						rendererOptions: {
							padding: 20, 
							fill: true,
							showDataLabels: true, 
							sliceMargin: 4, 
							lineWidth: 5
							}
						}, 
						legend: { 
							show:true, 
							location: 'e' 
						},
						cursor : {
							show: true,              //是否显示光标  
							showTooltip: true,      // 是否显示提示信息栏  
							followMouse: false,
						}
					}
				);									
			}
		});
		view.appendPanel();
	}

	function init(type){
		$('#manageMa').removeClass('hide');
		switch(type){
			case 'data':
				dataInit();
				break;
			case 'log':
				logInit();
				break;
			case 'grade':
				gradeInit();
				break;
			case 'size':
				sizeInit();
				break;								
			case 'manage':
				break;					
		}
	}

	//空间组加载完成
	function sizeLoad(e,d){
		isLoading = false;
		if(d){
			var view = new View({
				target : $('#sizeGroupList'),
				tplid : 'manage/size.list',
				data : d
			});
			view.createPanel();
		}
	}

	//添加
	function addSizeGroup(e,d){
		isLoading = false;
		if(d){
			var view = new View({
				target : $('#sizeGroupList'),
				tplid : 'manage/size.list',
				data : {
					list : [d]
				}
			});
			view.appendPanel();
		}		
	}

	//修改
	function modifySizeGroup(e,d){
		isLoading = false;
		var view = new View({
			target : $('.size-group'+d.id),
			tplid : 'manage/size.list.one',
			data : d
		});
		view.createPanel();
	}

	function delSizeGroup(e,d){
		isLoading = false;
		//resizeSize();
		$("#addSize").addClass('hide');
		$('.size-group'+d).remove();

	}

	//设置年级成功
	function setSuc(e,d){
		var obj = {
			tplid : 'manage/grade.list',
			data : {
				list : d.value,
				key : d.key
			}
		}

		$('#addGrade').addClass('hide');
		$('#addSubject').addClass('hide');

		if(d.key == 'grade'){
			obj.target = $('.grade-list-grade');
		}else{
			obj.target = $('.grade-list-subject');
		}
		var view = new View(obj);
		view.createPanel();

		$('#addGrade input').val('');
		$('#addSubject input').val('');
		$('.btn-save-grade').removeAttr('data-modify');
		$('.btn-save-sub').removeAttr('data-modify');
	}

	var handlers = {
		'manage:setsuc' : setSuc,
		'manage:slistload' : sizeLoad,
		'manage:sizegroupadded' : addSizeGroup,
		'manage:sizegroupmodifyed' : modifySizeGroup,
		'manage:sizegroupdeled' : delSizeGroup,
		'manage:logload' : logLoad,
		'manage:staticload' : allStatic
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}	

	return {
		init : init
	}
});
define('model.manage',['config','helper/request','helper/util','cache'],function(config,request,util,Cache){
	var handerObj = $(Schhandler);


	function convent(data){

		var o = {};
		o.id = data.user._id;
		o.nick = data.user.nick;
		o.pre = util.getNums(data.user.used/data.user.size)*100;
		if(!o.pre && !data.user.used){
			o.pre = 0;
		}
		if(o.pre >= 0 && o.pre < 0.001){
			o.pre = 0.1;
		}

		o.name = data.user.name;
		if(data.user.size){
			o.size = util.getSize(data.user.size);
		}else{
			o.size = 0;
		}
		if(data.user.used){
			o.used = util.getSize(data.user.used);
		}else{
			o.used = 0;
		}
		o.oused = data.user.used;
		o.osize = data.user.size;
		o.auth = data.user.auth;
		o.mailnum = data.user.mailnum;
		o.group = [];
		o.dep = [];
		o.prep = [];
		o.school = 0;
		o.group2key = {};
		o.dep2key = {};
		o.prep2key = {};

		o.rootFolder = data.user.rootFolder;
		o.rootFolder.id = data.user.rootFolder['$id'];

		//学校
		if(data.school){
			o.school = data.school;
			o.school.id = o.school._id;
			o.school.auth = data.school.auth || 0;
			if(data.school.rootFolder){
				o.school.rootFolder.id = data.school.rootFolder.$id || 0;
			}
			o.group2key[o.school.id] = o.school;
		}else{
			o.school = false;
		}
		
		for(var i =0,l=data.departments.length;i<l;i++){
			var item = data.departments[i];
				item.id = item._id;
				item.pt = item.pt || 0;
				item.auth = item.auth || 0;
			if(item.rootFolder){
				item.rootFolder.id = item.rootFolder._id || item.rootFolder.$id;
			}				
			o.dep.push(item);
			o.dep2key[item.id] = item;
			o.group2key[item.id] = item;				
		}

		for(var i=0,l=data.prepares.length;i<l;i++){
			var item = data.prepares[i];
				item.id = item._id;
				item.pt = item.pt || 0;
			if(item.rootFolder){
				item.rootFolder.id = item.rootFolder._id || item.rootFolder.$id;
			}				
			item.isMember = true;	
			o.prep.push(item);
			o.prep2key[item.id] = item;
			o.group2key[item.id] = item;
		}

		for(var i =0,l=data.groups.length;i<l;i++){
			var item = data.groups[i];
			if(!item){
				continue;
			}
			item.id = item._id;
			item.pt = item.pt || 0;
			if(item.rootFolder){
				item.rootFolder.id = item.rootFolder._id || item.rootFolder.$id;
			}
			item.isMember = true;
			o.group2key[item.id] = item;
			item.pt = item.pt || 0;
			o.group.push(item);
			// switch(item.type){
			// 	case 0: //学校
			// 		o.school = item;
			// 		break;
			// 	case 1: //小组
					
			// 		break;
			// 	case 2: //部门
			// 		item.isMember = item.isMember || 1;
			// 		o.dep.push(item);
			// 		o.dep2key[item.id] = item;
			// 		break;
			// 	case 3: //备课
			// 		o.prep.push(item);
			// 		o.prep2key[item.id] = item;
			// 		break;
			// }

		}
		return o;
	}


	function convertSize(obj){
		var list = {};
		for(var i = 0,l=obj.length;i<l;i++){
			var item = obj[i];
			item.id = item._id;
			item.nsize = util.getSize(item.size);
			list[item.id] = item;
		}
		return list;
	}

	function convertSizeOne(obj){
		obj.id = obj._id;
		obj.nsize = util.getSize(obj.size);
		return obj;
	}	

	function getKey(key){
		var opt = {
			cgi : config.cgi.getstorge,
			data : {
				key : key
			}
		}

		var success = function(d){
			if(d.err==0){
				d = d.result.data;

				if(d){
					var v = JSON.parse(d.value);
					handerObj.triggerHandler('cache:set',{key: d.key ,data: v,type:1});
				}
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);
	}

	function setKey(e,d){
		var obj = {
			key : d.key,
			value : JSON.stringify(d.value)
		}
		var opt = {
			cgi : config.cgi.setstorge,
			data : obj
		}

		var success = function(data){
			if(data.err==0){
				handerObj.triggerHandler('cache:set',{key: d.key ,data: d.value,type:1});
				handerObj.triggerHandler('manage:setsuc',d);
			}else{
				handerObj.triggerHandler('msg:error',data.err);
			}
		}
		request.post(opt,success);		
	}

	//加载空间组
	function sGroup(e,d){
		var opt = {
			cgi : config.cgi.sgrouplist,
			data : {
				page : 0,
				pageNum : 0
			}
		}

		var success = function(data){
			if(data.err==0){
				list = convertSize(data.result.list);
				handerObj.triggerHandler('cache:set',{key: 'sizegroup' ,data: list,type:1});
				handerObj.triggerHandler('manage:slistload',{
					list : list
				});
			}else{
				handerObj.triggerHandler('msg:error',data.err);
			}
		}
		request.get(opt,success);	
	}

	//增加空间组
	function addSizeGroup(e,d){
		var opt = {
			cgi : config.cgi.addsgroup,
			data : d
		}

		var success = function(data){
			if(data.err==0){
				var list = Cache.get('sizegroup');
				var obj = convertSizeOne(data.result.data);
				//更新缓存
				list[obj.id] = obj;
				handerObj.triggerHandler('cache:set',{key: 'sizegroup' ,data: list,type:1});
				// handerObj.triggerHandler('cache:set',{key: 'sizegroup' ,data: list,type:1});
				handerObj.triggerHandler('manage:sizegroupadded', obj);
			}
			handerObj.triggerHandler('msg:error',data.err);
		}
		request.post(opt,success);			
	}

	//修改空间组
	function modifySizeGroup(e,d){
		var opt = {
			cgi : config.cgi.modifysgroup,
			data : d
		}

		var success = function(data){
			if(data.err==0){
				var list = Cache.get('sizegroup');
				var obj = convertSizeOne(data.result.data);
				list[obj.id] = obj;
				//更新缓存
				//list.push(obj);
				handerObj.triggerHandler('cache:set',{key: 'sizegroup' ,data: list,type:1});
				// handerObj.triggerHandler('cache:set',{key: 'sizegroup' ,data: list,type:1});
				handerObj.triggerHandler('manage:sizegroupmodifyed', obj);
			}
			handerObj.triggerHandler('msg:error',data.err);
		}
		request.post(opt,success);
	}

	//删除空间组
	function delSizeGroup(e,d){
		var opt = {
			cgi : config.cgi.delsgroup,
			data : d
		}

		var success = function(data){
			if(data.err==0){
				var list = Cache.get('sizegroup');
				delete list[d.sizegroupId];
				handerObj.triggerHandler('cache:set',{key: 'sizegroup' ,data: list,type:1});
				handerObj.triggerHandler('manage:sizegroupdeled', d.sizegroupId);
			}
			handerObj.triggerHandler('msg:error',data.err);
		}
		request.post(opt,success);
	}		

	function Log(e,d){
		var opt = {
			cgi : config.cgi.logsearch,
			data : d
		}		
		var success = function(data){
			if(data.err==0){
				handerObj.triggerHandler('manage:logload', data.result);
			}else{
				handerObj.triggerHandler('msg:error',data.err);
			}
		}
		request.get(opt,success);		
	}

	function conventStatic(obj){
		obj.allsize = util.getSize(obj.totalSize) || 0;
		for(var i in obj.fileStatistics){
			obj.fileStatistics[i].nsize = util.getSize(obj.fileStatistics[i].size); 
		}
		return obj;
	}

	//汇总
	function allStatic(e,d){
		var opt = {
			cgi : config.cgi.mstatic,
			data : d
		}		
		var success = function(data){
			if(data.err==0){
				handerObj.triggerHandler('manage:staticload', conventStatic(data.result));
			}else{
				handerObj.triggerHandler('msg:error',data.err);
			}
		}
		request.get(opt,success);		
	}	

	function userLoad(e,d){

		var info = Cache.get('myinfo');
		if(info){
			handerObj.triggerHandler('manage:userLoaded',info);
		}

		var opt = {
			cgi : config.cgi.getinfo,
			data : {}
		}

		var success = function(d){
			if(d.err == 0){
				var obj = convent(d.result);
				handerObj.triggerHandler('cache:set',{key: 'myinfo',data: obj});
				handerObj.triggerHandler('manage:userLoaded',obj);
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);
	}

	var handlers = {
		'manage:setkey' : setKey,
		'manage:sgrouplist' : sGroup,
		'manage:addsgroup' : addSizeGroup,
		'manage:modifysgroup' : modifySizeGroup,
		'manage:delsgroup' : delSizeGroup,
		'manage:log' : Log,
		'manage:allstatic' : allStatic,
		'manage:userinfo' : userLoad
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}

	return {
		getKey : getKey
	}
});
define('../school/config',[],function() {
	var CGI_PATH = '/api/',
		EXT = '';//'.php';

	return {
		pagenum : 10,
		filetype : {
			0 : '全部类型',
			1 : '图片',
			2 : '文档',
			3 : '音乐',
			4 : '视频',
			5 : '应用',
			6 : '压缩包',
			7 : '其他',
			8 : 'txt文档'
		},
		cgi : {
			//个人资料
			getinfo : CGI_PATH+'user/',
			info : CGI_PATH+'user/login'+EXT,
			gotologin : CGI_PATH+'user/gotoLogin'+EXT,
			//login : CGI_PATH+'user/gotoLogin'+EXT,
			varify : CGI_PATH+'user/verify'+EXT,
			logout : CGI_PATH+'user/logoff'+EXT,
			userlist : CGI_PATH+'user/search'+EXT,
			usearch : CGI_PATH+'user/search'+EXT,
			departments : CGI_PATH+'user/departments'+EXT,
			info : CGI_PATH + 'user/info',
			umodify : CGI_PATH + 'user/modify',
			login : CGI_PATH + 'user/login',
			logout : CGI_PATH + 'user/logoff',
			valid : CGI_PATH + 'user/validate',

			create : CGI_PATH + 'manage/createUser',
			modify : CGI_PATH + 'manage/modifyUser',
			resetpwd : CGI_PATH + 'manage/resetUserPwd',

			orglist : CGI_PATH + 'organization/tree',
			createorgan : CGI_PATH + 'organization/create',
			adduser : CGI_PATH + 'organization/addUser',
			removeuser : CGI_PATH + 'organization/removeUser',
			orgdelete : CGI_PATH + 'organization/delete',
			organmodify : CGI_PATH + 'organization/modify',			

			//文件操作
			upload : '/upload'+EXT,
			filelist : CGI_PATH+'file/list'+EXT,
			filesearch : CGI_PATH+'file/search'+EXT,
			fileinfo : CGI_PATH+'file'+EXT,
			filedown : CGI_PATH+'file/download'+EXT,
			filemodify : CGI_PATH+'file/modify'+EXT,
			filecopy : CGI_PATH+'file/copy'+EXT,
			filemove : CGI_PATH+'file/move'+EXT,
			filedel : CGI_PATH+'file/delete'+EXT,
			fileshare : CGI_PATH+'file/share'+EXT,
			filesave : CGI_PATH+'file/save'+EXT,
			filereview : CGI_PATH+'file/preview'+EXT,	
			filequery : CGI_PATH+'file/query'+EXT,//order page pageNum type 1 查询我分享给小组的  groupid
			filestatus : CGI_PATH+'file/statistics'+EXT,
			//batchDownload


			//文件夹
			foldinfo : CGI_PATH+'folder'+EXT,
			foldcreate : CGI_PATH+'folder/create'+EXT,
			foldmodify : CGI_PATH+'folder/modify'+EXT,
			foldlist : CGI_PATH+'folder/list'+EXT,
			foldsearch : CGI_PATH+'folder/search'+EXT,
			folddel : CGI_PATH+'folder/delete'+EXT,


			//文件收藏
			favcreate : CGI_PATH+'fav/create'+EXT,
			favlist : CGI_PATH+'fav/list'+EXT,
			favdel : CGI_PATH+'fav/delete'+EXT,
			favsearch : CGI_PATH+'fav/search'+EXT,

			//回收站
			reclist : CGI_PATH+'recycle/list'+EXT,
			recrev : CGI_PATH+'recycle/revert'+EXT,
			recdel : CGI_PATH+'recycle/delete'+EXT,
			recsearch : CGI_PATH+'recycle/search'+EXT,

			//小组&部门
			groupcreate : CGI_PATH+'group/create'+EXT,
			groupmodify : CGI_PATH+'group/modify'+EXT,
			groupinfo : CGI_PATH+'group'+EXT,
			groupverify : CGI_PATH+'group/verify'+EXT,
			groupverlist : CGI_PATH+'group/verify/list'+EXT,

			//消息
			msgone : CGI_PATH+'message'+EXT,
			msgcreate : CGI_PATH+'message/create'+EXT,
			msgsearch : CGI_PATH+'message/search'+EXT,

			//空间组
			addsgroup : CGI_PATH+'sizegroup/create'+EXT,
			modifysgroup : CGI_PATH+'sizegroup/modify'+EXT,
			delsgroup : CGI_PATH+'sizegroup/delete'+EXT,
			sgrouplist : CGI_PATH+'sizegroup/search'+EXT,

			//留言板
			boardcreate : CGI_PATH+'board/create'+EXT,
			boardlist : CGI_PATH+'board/search'+EXT,
			boarddel : CGI_PATH+'board/delete'+EXT,
			boardverify : CGI_PATH+'board/verify'+EXT,

			//管理相关
			mlistgroup : CGI_PATH+'manage/listGroups'+EXT,
			mappgroup :　CGI_PATH+'manage/approveGroup'+EXT,
			mpreplist : CGI_PATH+'manage/listPrepares'+EXT,
			mnewgroup : CGI_PATH+'manage/createGroup'+EXT,
			mappfile : CGI_PATH+'manage/approveFile'+EXT,
			mstatic : CGI_PATH+'manage/statistics'+EXT,

			//用户 
			usersearch : CGI_PATH+'user/search'+EXT,
			usermodify : CGI_PATH+'manage/modifyUser'+EXT,

			//日志
			logsearch : CGI_PATH+'log/search'+EXT,
			

			//存储
			getstorge : CGI_PATH+'storage'+EXT,
			setstorge : CGI_PATH+'storage/set'+EXT

		},
		grade : {
			1 : '一年级',
			2 : '二年级',
			3 : '三年级',
			4 : '四年级',
			5 : '五年级',
			6 : '六年级'					
		},
		tag : {
			1 : '语文',
			2 : '数学',
			3 : '英语',
			4 : '体育',
			5 : '音乐',
			6 : '美术',
			7 : '科学',
			8 : '综合实践',
			9 : '信息技术'
		},
		msg : {
			0 : '操作成功!',
			10: '排序序号必须填写',
			11 : '组织名称必须填写',
			20 : '新密码和重复密码必须一致',
			21 : '请填写用户名和密码!',
			50 : '你要上传的文件已经超过你的剩余空间!',
			60 : '你还没有选择要共享的目录',
			75 : '序号只能在1~99之间',
			76 : '名称不能少于2个字',
			77 : '参数不能为空',
			78 : '对不起，网络超时了，请稍后再试',
			79 : '已经有同名的项目了',
			100 : '对不起，您没有这个操作权限!',//后台出错啦!
			101 : '出错啦',
			1001 : '您还没有登录!',
			1004 : '没有找到资源!',
			1010 : '您没有查看该资源的权限!',
			1011 : '参数出错啦!',
			1013 : '出错啦',
			1014 : '同名啦,请修改名称!',
			1015 : '已经归档啦!',
			1016 : '该资源不能删除',
			1017 : '该目录下还有其他文件，无法删除!',
			1041 : '用户名或密码错误!'
		}
	}
// module.exports = exports = {
//     SERVER_ERROR: 100,
//     NOT_SUPPORT: 101,

//     NOT_LOGIN: 1001,
//     TICKET_ERROR: 1002,
//     SKEY_EXPIRE: 1003,

//     NOT_FOUND: 1004,

//     NOT_AUTH: 1010,
//     PARAM_ERROR: 1011,
    
//     SPACE_FULL: 1013,
//     DUPLICATE: 1014,
//     NOT_MATCH: 1015,


//     SUCCESS: 0
// }
	
});
define('msg',['../school/config','cache','helper/view'],function(config,Cache,View){
	var	handerObj = $(Schhandler);
	var msg = config.msg;

	Messenger().options = {
	    extraClasses: 'messenger-fixed messenger-on-bottom',
	    theme: 'flat'
	}

	var at = 0;

	function showErr(e,d){
		if(d == 1001){
			window.location = config.cgi.gotologin;
			return;
		}

		var obj = {
			'message' : msg[d]
		}
		if(parseInt(d)){
			obj.type = 'error'
		}

		Messenger().post(obj);
		// clearTimeout(at);

		// var alertDiv = $('<div class="alert alert-success alert-msg fade in"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><span></span></div>');


		// alertDiv.removeClass('alert-danger');
		// if(parseInt(d)){
		// 	alertDiv.addClass('alert-danger');
		// }
		// $('body').append(alertDiv);
		
		// alertDiv.find('span').html(msg[d]);
		// alertDiv.alert();
		// at = setTimeout(function(){
		// 	alertDiv.alert('close');
		// },2000);		
	}

	var handlers = {
		'msg:error' : showErr
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}	
});
;(function() {

  requirejs.config({
    baseUrl: 'js/manage',
    paths: {
      jquery: '../lib/jquery'
    }    
  });

  require(['config','helper/router','helper/util','view.group','view.user','view.manage','model.manage','msg','model.group'], function(config,router,util,group,user,manage,mModel) {

    var handerObj = $(Schhandler);
    var prepload = false;
    var sgload = false;
   
    if(!util.getCookie('skey')){
      window.location = config.cgi.gotologin;
      return;
    }

    handerObj.bind('manage:preploaded',function(e,d){
      prepload = true;
      if(sgload && prepload){
        $('.manage-loading').remove();
        init();
      }
    });

    handerObj.bind('manage:slistload',function(e,d){
      sgload = true;
      if(sgload && prepload){
        $('.manage-loading').remove();
        init();
      }
    }); 

    handerObj.bind('manage:userLoaded',function(e,d){
      if(d.auth == 15){
          handerObj.triggerHandler('group:loadprep');
          handerObj.triggerHandler('manage:sgrouplist');  
          $('#userInfo').html(d.nick+' <a href="/">返回</a>');
      }else{
        window.location = '/';
      }
    });

    handerObj.triggerHandler('manage:userinfo');
    var headers  = $.ajax({async:false}).getAllResponseHeaders();
    util.getServerTime(headers);

    mModel.getKey('grade');
    mModel.getKey('subject');

    function init(){
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

              case 'data':
              case 'log':
              case 'manage':
              case 'size':
              case 'grade':
                manage.init(cmd);
                break;
            }
      });   

      manage.init('data');
      // var opt = {
      //   cgi : config.cgi.getinfo,
      //   data : {}
      // }

      // var success = function(d){
      //   if(d.err == 0){
      //     console.log(d.result);
      //   }else{
      //     handerObj.triggerHandler('msg:error',d.err);
      //   }
      // }
      // request.get(opt,success);      
    }




   
  });
})();
define("../manage", function(){});
