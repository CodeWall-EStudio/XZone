
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
			msgcreate : CGI_PATH+'message/create'+EXT,
			msgsearch : CGI_PATH+'message/search'+EXT,

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
			mappfile : CGI_PATH+'manage/approveFile'+EXT

		},
		grade : {
			1 : '一年级',
			2 : '二年级',
			3 : '三年级',
			4 : '四年级',
			5 : '五年级',
			6 : '六年级',						
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
			9 : '信息技术',
		},
		msg : {
			0 : '操作成功!',
			77 : '参数不能为空',
			100 : '后台出错拉!',
			101 : '出错拉',
			1001 : '您还没有登录!',
			1004 : '没有找到资源!',
			1010 : '您没有查看该资源的权限!',
			1011 : '参数出错拉!',
			1013 : '出错拉',
			1014 : '同名拉!',
			1015 : '出错拉',
			1016 : '该资源不能删除'
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
define('helper/util',['../config'], function($, config) {

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

		return d.getFullYear(d)+'-'+(d.getMonth()+1)+'-'+d.getDate() + ' ' + d.getHours()+':'+d.getMinutes();
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
		var f_x = parseFloat(x);  
		if (isNaN(f_x))  
		{  
		//alert('function:changeTwoDecimal->parameter error');  
			return 0;  
		}  
		var f_x = Math.round(x*100)/100;  
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

	return util;

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
			foldstatus : CGI_PATH + 'folder/batchStatistics',


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
			40 : '你选择的文件夹中还有文件或文件夹,清先删除子文件夹和文件再操作!',
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
			1017 : '该目录下还有其他文件，无法删除!'
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
define('../school/cache',['config'],function(config){

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
define('../school/helper/view',['helper/util','helper/templateManager'],function($u,$tm){

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
/**
 * 常用公用方法
 */
define('../school/helper/util',['../config'], function(config) {

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

define('view.manage',['../school/config','../school/cache','../school/helper/view','../school/helper/util'],function(config,Cache,View,Util){
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
;(function() {

  requirejs.config({
    baseUrl: 'js/school',
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

    manage.init(); 
   
  });
})();
define("../manage", function(){});
