
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
define('model.nav',['config','helper/request','cache','helper/util'],function(config,request,cache,util){

	var	handerObj = $(Schhandler);

	function convent(data){

		var o = {};
		o.id = data.user._id;
		o.nick = data.user.nick;
		o.pre = Math.ceil(util.getNums(data.user.used/data.user.size)*100);
		
		if(!o.pre && !data.user.used){
			o.pre = 0;
		}
		if(o.pre > 0 && o.pre < 0.001){
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

		var normal = [],
			over = [];
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
			if(item.status === 2){
				over.push(item);
			}else{
				normal.push(item);
			}
		}
		o.group = normal.concat(over);
		return o;
	}

	function init(e,d){

		var opt = {
			cgi : config.cgi.getinfo,
			data : {}
		}

		var success = function(d){
			if(d.err == 0){
				var obj = convent(d.result);
				handerObj.triggerHandler('cache:set',{key: 'myinfo',data: obj});
				handerObj.triggerHandler('nav:load',obj);
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);
	}

	var handlers = {
		'nav:init' : init,

	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}

	return handerObj;
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
				url: tmplPath+tplid+tmplName+'?t='+Math.random(),
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
define('model.manage.nav',['config','helper/request','cache'],function(config,request,Cache){

	var	handerObj = $(Schhandler);

	function convent(data){
		var list = [];
		for(var i =0,l=data.length;i<l;i++){
			var item = data[i];
			item.id = item._id;
			list.push(item);
		}
		return list;
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

	function conventGroup(data){
		data.id = data._id;
		return data;
	}

	function getDepUser(e,d){
		var departments = Cache.get('departments');
		if(departments){
			handerObj.triggerHandler('nav:userload',{ type : d.type,data:d.data,files: d.files, list :departments});
			return;
		}
		var opt = {
			cgi : config.cgi.departments //userlist
		}
		
		var success = function(data){
			if(data.err == 0){
				handerObj.triggerHandler('cache:set',{key: 'departments',data: data.result.list});
				handerObj.triggerHandler('nav:userload',{ type : d.type,data:d.data,list :data.result.list});
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);		
	}

	function getUser(e,d){
		var type = d.type,
			data = d.data
		var ul = Cache.get('alluser');
		if(ul){
			if(type != 'prep'){
				handerObj.triggerHandler('nav:userload',{list:ul,type:type,data:data});
			}else{
				handerObj.triggerHandler('groupprep:userload',{list:ul,type:type,data:data});
			}
			return;
		}

		var opt = {
			cgi : config.cgi.usearch,//userlist,
			data : {}
		}

		var success = function(d){
			if(d.err == 0){
				var obj = convent(d.result.list);
				conventUid2key(d.result.list);
				handerObj.triggerHandler('cache:set',{key: 'alluser',data: obj});
				if(type != 'prep'){
					handerObj.triggerHandler('nav:userload',{list:obj,type:type,data:data});
				}else{
					handerObj.triggerHandler('groupprep:userload');
				}
			}
		}
		request.get(opt,success);		
	}

	function newGroup(e,d){
		var opt = {
			cgi : config.cgi.groupcreate,
			data : d
		}

		var success = function(d){
			if(d.err == 0){
				d.result.data.auth = 1;
				d.result.data.rootFolder.id = d.result.data.rootFolder['$id'];
				var obj = conventGroup(d.result.data);
				handerObj.triggerHandler('nav:createsuc',{list:obj});
			}
			handerObj.triggerHandler('msg:error',d.err);
		}
		request.post(opt,success);			
	}

	function modifyGroup(e,d){
		var opt = {
			cgi : config.cgi.groupmodify,
			data : d
		}

		var success = function(d){
			if(d.err == 0){
				var obj = conventGroup(d.result.data);
				handerObj.triggerHandler('nav:modifysuc',obj);
			}
			handerObj.triggerHandler('msg:error',d.err);
		}

		request.post(opt,success);		
	}


	var handlers = {
		'nav:getuser' : getUser,
		'nav:getdep' : getDepUser,
		'manage.nav:new' : newGroup,
		'manage.nav:modify' : modifyGroup
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}

	return handerObj;
});	
define('view.nav',['config','model.nav','helper/view','helper/util','cache','model.manage.nav'],function(config,modelNav,View,util,Cache){

	var	handerObj = $(Schhandler),
		navTarget = $('#pageNav'),
		actTarget = $('#actWinZone'),
		actWin = $('#actWin'),		
		userasideTarget = $('#userAside'),
		userlist = null,
		nowGroup = null,
		navView = new View(),
		myView = new View();

	function init(){
		modelNav.triggerHandler('nav:init',util.getParam('ticket'));
	}

	function createSuc(e,d){
		var myinfo = Cache.get('myinfo');

		var normal = [],
			over = [];
		for(var i=0,l=myinfo.group.length;i<l;i++){
			if(myinfo.group[i].status === 2){
				over.push(myinfo.group[i]);
			}else{
				normal.push(myinfo.group[i]);
			}
		}
		over = [d.list].concat(over);
		myinfo.group = normal.concat(over);
		//myinfo.group.push(d.list);
		myinfo.group2key[d.list.id] = d.list;

		handerObj.triggerHandler('cache:set',{key: 'myinfo',data: myinfo});
		handerObj.triggerHandler('nav:load',myinfo);
	}

	function navLoad(e,d){
		var headers  = $.ajax({async:false}).getAllResponseHeaders();
/*
Date: Sat, 07 Jun 2014 15:52:49 GMT
Cache-Control: max-age=0, must-revalidate
Content-Length: 9016
Content-Type: text/html

*/

		var opt = {
			target : navTarget,
			tplid : 'nav',
			data : d,
			handlers : {
				'a.layout' : {
					click : function(e){
						window.location = config.cgi.logout;
					}
				},
				'.manage-one-group' : {
					click : function(e){
						var target = $(e.target),
							id = target.attr('data-id');
						handerObj.triggerHandler('nav:groupmanage',id);
					}
				},
				'.create-new-group' : {
					click : function(e){
						handerObj.triggerHandler('nav:newgroup');
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
			data : d,
			handlers : {
				'a.layout' : {
					click : function(e){
						window.location = config.cgi.logout;
					}
				}
			}			
		});
		view.createPanel();
		

		handerObj.triggerHandler('site:start');
	}

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


	function userList(list,target){
		var selected = target.find('.dep-click:checked').length;
		var data = {
			list : list.children,
			ulist : list.users,
			selected : selected
		}
		if(nowGroup){
			data.ml = nowGroup.ml;
		}
		var view = new View({
			target : target,
			tplid : 'share.user.li',
			data : data//,		
		});
		view.appendPanel();
	}		

	//添加
	function addShareUser(obj){
		//console.log(obj);
		if($('.shareUser'+obj._id).length==0){
			var view = new View({
				target : $('#groupSelectUser'),
				tplid : 'share.user.span',
				data : obj
			});
			view.appendPanel();
		}
	}
	//删除
	function delShareUser(obj){
		$('.shareUser'+obj._id).remove();
		$('.userClick'+obj._id).prop({
			'checked':false
		}).parents('ul.child').prevAll('.dep-click').prop({
			'checked':false
		});
	}

	function userLoad(e,d){
		if(!userlist){
			userlist = d.list;
		}

		var data = {
			list : d.list
		},
		tplid = 'group.new';
		if(d.type == 'modify'){
			data.group = d.data;
			tplid = 'group.manage'
		}
		var view = new View({
			target : actTarget,
			tplid : tplid,
			after : function(){
				actWin.modal('show');	
			},			
			data : data,
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
						p.find('.plus').click();
						var check = t.prop('checked');
						p.find('ul input').prop({'checked':check});
						var list = getUList(v,d.list);
						if(list.users){
							var ul = list.users;
							for(var i=0,l=ul.length;i<l;i++){
								var item = ul[i];
								if(check){
									addShareUser(item);
								}else{
									delShareUser(item);
								}
							}
						}
					}
				},
				'.btn-post' : {
					'click' : function(){
						var name = actTarget.find('.new-group-name').val(),
							desc = actTarget.find('.new-group-desc').val(),
							members = [];
						actTarget.find('.user-click:checked').each(function(){
							members.push($(this).val());
						});
						if(name == ''){
							handerObj.triggerHandler('msg:error',77);
							return;
						}
						if(name.length < 3){
							handerObj.triggerHandler('msg:error',76);
							return;
						}
						var obj = {
							'type' : 1,
							'content' : desc,
							'members' : members
						}
						if(data.group){
						if(name != data.group.name){
							obj.name = name;
						}
						}else{
							obj.name = name;
						}
						if(d.data){
							obj.groupId = d.data.id;
						}
						if(tplid == 'group.new'){
							handerObj.triggerHandler('manage.nav:new',obj);
						}else{
							handerObj.triggerHandler('manage.nav:modify',obj);
						}
					}
				}
			}
		});
		view.createPanel();
	}


	function newGroup(e,d){
		nowGroup = null;
		if(userlist){
			handerObj.triggerHandler('nav:userload',{list:userlist,type:'new'});
		}else{
			handerObj.triggerHandler('nav:getdep',{type:'new'});
		}
	}

	function manageGroup(e,d){

		handerObj.triggerHandler('group:info',{gid:d,type:'nav'});
		
	}

	function infoSuc(e,d){
		nowGroup = d;
		if(userlist){
			handerObj.triggerHandler('nav:userload',{list:userlist,type:'modify',data:d});
		}else{
			handerObj.triggerHandler('nav:getdep',{type:'modify',data: d});
		}
	}	

	function modifySuc(e,d){
		$("#my-m-group"+d.id).text(d.name).attr('title',d.name);
		$('.group-name-tit').text(d.name);
	}

	var handlers = {
		'nav:load' : navLoad,
		'nav:newgroup' : newGroup,
		'nav:groupmanage' : manageGroup,
		'nav:userload' : userLoad,
		'nav:createsuc' : createSuc,
		'nav:infosuc' : infoSuc,
		'nav:modifysuc' : modifySuc
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}

	return {
		init : init
	}
});

define('helper/test',['helper/util','helper/templateManager'],function($u,$tm){

var ret = {
    "resultMsg": "ok",
    "departmentTree": {
        "id": "org_group2",
        "classes": "department",
        "title": "七一小学",
        "children": [
            {
                "id": "040e1585-2fe5-42ff-bfc5-c40679e9b0ed",
                "classes": "department",
                "title": "学生处",
                "children": [
                    {
                        "id": "077ff605-d9e8-43eb-ac73-1d8b8b8e8950",
                        "classes": "department",
                        "title": "1年级",
                        "children": [
                            {
                                "id": "d1aa7c13-8a36-4758-803d-59bc4c8eb05e",
                                "classes": "user",
                                "title": "宋立春"
                            }
                        ]
                    },
                    {
                        "id": "78021c76-f222-4754-a39c-658ea9b99eab",
                        "classes": "department",
                        "title": "3年级"
                    },
                    {
                        "id": "8757ead7-6996-473d-b6ae-b42b5af8beef",
                        "classes": "department",
                        "title": "2年级"
                    },
                    {
                        "id": "4028812c432275cc014322b50a70003c",
                        "classes": "user",
                        "title": "李小平"
                    }
                ]
            },
            {
                "id": "4c7ef62f-cdc4-49ad-88bc-be00b368210b",
                "classes": "department",
                "title": "教务处",
                "children": [
                    {
                        "id": "0354122c-d5eb-4da4-881a-701fb80044c4",
                        "classes": "user",
                        "title": "杜淳厚"
                    },
                    {
                        "id": "0a871aad-0356-4d64-86b5-5ebebfadfb8a",
                        "classes": "user",
                        "title": "司马纳罄"
                    }
                ]
            },
            {
                "id": "a822d51e-7b21-473b-967b-80c7e999b542",
                "classes": "department",
                "title": "校长室",
                "children": [
                    {
                        "id": "bcc4ac9e-344b-4127-b4c9-5c966379ac21",
                        "classes": "department",
                        "title": "助理组",
                        "children": [
                            {
                                "id": "479cbc4f-f586-42f9-838a-746154ec47cd",
                                "classes": "user",
                                "title": "admin"
                            },
                            {
                                "id": "479cbc4f-f586-42f9-838a-746154ec47cd",
                                "classes": "user",
                                "title": "admin"
                            }
                        ]
                    },
                    {
                        "id": "4028812c42bc95f90142c5ece54e0054",
                        "classes": "user",
                        "title": "王冲"
                    },
                    {
                        "id": "4028812c42bc95f90142c5cb803c0040",
                        "classes": "user",
                        "title": "贾琪"
                    },
                    {
                        "id": "eabe8e42-9a0e-42da-9fa3-b44a82fa5ccc",
                        "classes": "user",
                        "title": "席殿"
                    },
                    {
                        "id": "1a7b35f9-2efe-4bdf-92ba-50862a2977be",
                        "classes": "user",
                        "title": "李红欧"
                    },
                    {
                        "id": "fb410942-5648-4705-bd4a-15f128b20d72",
                        "classes": "user",
                        "title": "容漪"
                    }
                ]
            },
            {
                "id": "7d4a402c-19a4-45c9-a718-45afe441b4b8",
                "classes": "department",
                "title": "书记室",
                "children": [
                    {
                        "id": "fa299db2-0cbe-4f33-9a4a-4abaf9e952e9",
                        "classes": "user",
                        "title": "张三"
                    }
                ]
            },
            {
                "id": "f94a76ad-7315-473b-8594-63187eb5a6e7",
                "classes": "department",
                "title": "后勤部",
                "children": [
                    {
                        "id": "d03e85c1-6276-4d3c-ad02-89e7a4070329",
                        "classes": "user",
                        "title": "关平"
                    },
                    {
                        "id": "1cf705ea-6056-4d76-8819-3ad2f1245963",
                        "classes": "user",
                        "title": "张都婷"
                    },
                    {
                        "id": "de59555d-5eab-429e-bd15-3b17d5961ba6",
                        "classes": "user",
                        "title": "雷磊"
                    },
                    {
                        "id": "1de97ae8-b2ce-4701-9583-18091c5a28f9",
                        "classes": "user",
                        "title": "邢冰玄"
                    }
                ]
            }
        ]
    },
    "success": true
}

return ret;
});
define('model.file',['config','helper/request','helper/util','cache','helper/test'],function(config,request,util,Cache,UL){
	var	handerObj = $(Schhandler);

	function convent(data){
		var list = [];
		for(var i=0,l=data.length;i<l;i++){
			var item = data[i];
			var td = {
				id : item._id,
				fid : item.resource._id,
				name : item.name,
				mark : item.mark,
				type : item.resource.type,
				src : item.src || 0,
				nick : item.creator.nick,
				size : util.getSize(item.resource.size),
				time : util.time(item.createTime),
				coll : item.isFav
			}
			list.push(td);
		}
		return list;
	}

	function searchFile(e,d){
		var opt = {
			cgi : config.cgi.filesearch,
			data : d
		}
		var success = function(d){
			if(d.err == 0){
				var list = convent(d.result.list);
				handerObj.triggerHandler('file:load',{
					list : list,
					total : d.result.total,
					next : d.result.next
				});
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);			
	}

	function coll(e,d){
		var id = d.fileId,
			target = d.target,
			gid = d.groupId;
		var obj = {
			fileId : id
		}
		if(gid){
			obj.groupId = gid;
		}
		var opt = {
			method : 'POST',
			cgi : config.cgi.favcreate,
			data : obj
		}			
		var success = function(d){
			handerObj.triggerHandler('msg:error',d.err);
			if(d.err == 0){
				var favid = [];
				for(var i in d.result.list){
					favid.push(d.result.list[i]._id);
				}
				handerObj.triggerHandler('fav:collsuc',{favid:favid,id:id,target:target,gid:gid});
			}else{
				
			}
		}
		request.post(opt,success);	
	}

	function unColl(e,d){
		var favid = d.favId,
			id = d.id,
			target = d.target,
			gid = d.groupId;
		var obj = {
			fileId : id
		}
		if(gid){
			obj.groupId = gid;
		}
		var opt = {
			method : 'POST',
			cgi : config.cgi.favdel,
			data : obj
		}			
		var success = function(d){
			handerObj.triggerHandler('msg:error',d.err);
			if(d.err == 0){
				handerObj.triggerHandler('fav:uncollsuc',{favId:favid,id:id,target:target,gid:gid});
			}else{
				
			}
		}
		request.post(opt,success);	
	}

	function editmark(e,d){

		var data = {
			fileId : d.folderId,
			mark : d.mark
		};
		if(d.groupId){
			data.groupId = d.groupId;
		}
		var target = d.target,
			mark = d.mark;
		var opt = {
			method : 'POST',
			cgi : config.cgi.filemodify,
			data : data
		}	

		var success = function(d){
			handerObj.triggerHandler('msg:error',d.err);
			if(d.err == 0){
				handerObj.triggerHandler('fold:marksuc',{id:d.id,target:target,gid:d.gid,mark:mark});
			}else{
				
			}
		}
		request.post(opt,success);	
	}

	function delFile(e,d){
		var fileId = [];
		for(var i in d){
			fileId.push(i);
		}
		var opt = {
			method : 'POST',
			cgi : config.cgi.filedel,
			data : {
				fileId : fileId
			}
		}
		var success = function(d){
			handerObj.triggerHandler('msg:error',d.err);
			if(d.err == 0){
				handerObj.triggerHandler('file:delsuc',{id: fileId});
			}else{
				
			}
		}
		request.post(opt,success);			
	}

	function fileModify(e,d){
		var opt = {
			method : 'POST',
			cgi : config.cgi.filemodify,
			data : d
		}
		var td = d;
		var success = function(d){
			handerObj.triggerHandler('msg:error',d.err);
			if(d.err == 0){
				handerObj.triggerHandler('file:modifysuc',td);
			}else{
				
			}
		}
		request.post(opt,success);		
	}

	function fileShare(e,d){
			var opt = {
				method : 'POST',
				cgi : config.cgi.fileshare,
				data : d
			};
			var td = d;
		// }else{
		// 	var opt = {
		// 		method : 'POST',
		// 		cgi : config.cgi.fileshare,
		// 		data : {
		// 			fileId : d.fileId,
		// 			toUserId : d.toUserId
		// 		}
		// 	}
		// }
		var success = function(d){
			if(d.err == 0){
				handerObj.triggerHandler('msg:error',d.err);
				handerObj.triggerHandler('file:sharesuc',td);
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}	
		request.post(opt,success);		
	}

	function conventUser(list){

	}

	function getUser(e,d){
		
		// var list = UL.departmentTree.children;
		// handerObj.triggerHandler('file:shareuserload',{ type : d.type,files: d.files, list :list});
		// return;
		var departments = Cache.get('departments');
		if(departments){
			handerObj.triggerHandler('file:shareuserload',{ type : d.type,files: d.files, list :departments});
			return;
		}
		var opt = {
			cgi : config.cgi.departments //userlist
		}
		var success = function(data){
			if(data.err == 0){
				handerObj.triggerHandler('cache:set',{key: 'departments',data: data.result.list});
				handerObj.triggerHandler('file:shareuserload',{ type : d.type,files: d.files, list :data.result.list});
				// var list = [];
				// var myinfo = Cache.get('myinfo');
				// for(var i = 0,l=data.result.list.length;i<l;i++){

				// 	var item = data.result.list[i];
				// 	if(item._id != myinfo.id){
				// 	list.push({
				// 		id : item._id,
				// 		name : item.nick
				// 	});
				// 	}
				// }
				// handerObj.triggerHandler('file:shareload',{ type : d.type,files: d.files, list :list});
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);
	}

	// function getUser(e,d){
		
	// 	// var departments = Cache.get('departments');
	// 	// if(departments){
	// 	// 	handerObj.triggerHandler('file:shareuserload',{ type : d.type,files: d.files, list :departments});
	// 	// 	return;
	// 	// }
	// 	var opt = {
	// 		cgi : config.cgi.userlist
	// 	}
	// 	var success = function(data){
	// 		if(data.err == 0){
	// 			var list = [];
	// 			var myinfo = Cache.get('myinfo');
	// 			for(var i = 0,l=data.result.list.length;i<l;i++){

	// 				var item = data.result.list[i];
	// 				if(item._id != myinfo.id){
	// 				list.push({
	// 					id : item._id,
	// 					name : item.nick
	// 				});
	// 				}
	// 			}
	// 			handerObj.triggerHandler('file:shareload',{ type : d.type,files: d.files, list :list});
	// 		}else{
	// 			handerObj.triggerHandler('msg:error',d.err);
	// 		}
	// 	}
	// 	request.get(opt,success);
	// }	

	function fileMove(e,d){
		var fids = d.fileId;
		var opt = {
			cgi : config.cgi.filemove,
			data : d
		}	
		var success = function(d){
			if(d.err == 0){
				handerObj.triggerHandler('file:movesuc',{ids: fids});
				handerObj.triggerHandler('msg:error',d.err);
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}	
		request.post(opt,success);				
	}

	function fileCopy(e,d){
		var td = d;
		var fids = d.fileId;
		var opt = {
			cgi : config.cgi.filemove,
			data : d
		}	
		var success = function(d){
			if(d.err == 0){
				handerObj.triggerHandler('file:copysuc',td);
				handerObj.triggerHandler('msg:error',d.err);
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}	
		request.post(opt,success);				
	}

	function fileSave(e,d){
		var td = d;
		var fids = d.fileId;
		var opt = {
			cgi : config.cgi.filecopy,
			data : d
		}	
		var success = function(d){
			if(d.err == 0){
				handerObj.triggerHandler('file:savesuc',td);
				handerObj.triggerHandler('msg:error',d.err);
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}	
		request.post(opt,success);				
	}	

	function recyRef(e,d){
		var ids = d.fileId;
		var opt = {
			cgi : config.cgi.recrev,
			data : d
		}	
		var success = function(d){
			if(d.err == 0){
				handerObj.triggerHandler('recy:recysuc',{ids:ids});
				handerObj.triggerHandler('msg:error',d.err);
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}	
		request.post(opt,success);	
	}

	function recyDel(e,d){
		var ids = d.fileId,
			size = d.size;
		var opt = {
			cgi : config.cgi.recdel,
			data : d
		}	
		var success = function(d){
			if(d.err == 0){
				handerObj.triggerHandler('recy:recysuc',{ids:ids,size:size});
				handerObj.triggerHandler('msg:error',d.err);
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}	
		request.post(opt,success);			
	}	

	function checkFold(e,d){
		var opt = {
			cgi : config.cgi.foldstatus,
			data : {
				folderId : d.folderId
			}
		}	
		var fl = d.fl,
			fd = d.fd;
		var success = function(d){
			if(d.err == 0){
				var cl = {};
				var check = false;
				for(var i in d.list){
					var item = d.list[i];
					if(item.fileStat.totalCount>0){
						cl[item.folderId] = true;
						check = true;
					}else{
						cl[item.folderId] = false;
					}
				};
				if(!check){
					handerObj.triggerHandler('fild:checkSuc',{
						check: check,cl: cl,fl:fl,fd:fd
					});
				}else{
					handerObj.triggerHandler('msg:error',40);
				}
			}
			//handerObj.triggerHandler('msg:error',d.err);
		}	
		request.post(opt,success);	
	}

	var handlers = {
		'file:recyref' : recyRef,
		'file:recydel' : recyDel,
		'file:savetomy' : fileSave,
		'file:checkfold' : checkFold,
		//'file:get' : getFile,
		'file:copyto' : fileCopy,
		'file:moveto' : fileMove,
		'file:getuser' : getUser,
		'file:shareto' : fileShare,
		'file:modify' : fileModify,
		'file:delfiles' : delFile,
		'file:search' : searchFile,
		'file:coll' : coll,
		'file:uncoll' : unColl,
		'file:edit' : editmark
	}	

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}

	return {
		checkFold : checkFold
	}	
});
define('view.file',['config','helper/view','cache','helper/util','model.file'],function(config,View,Cache,util,Model){
	var	handerObj = $(Schhandler);

	var nowGid = 0,
		action = 0,
		nowKey = '',
		nowGroup = null,
		isLoading = false;
		nowFd = 0,
		nowOrder  = ['createTime',-1],
		nowOds = '',
		nowUid = 0,
		nowPrep = 0, //当前是否是备课
		rootFd = 0,
		depnum = -1,
		nowTotal = 0,
		nowUid = 0,
		nowGrade = 0,
		nowTag = 0,	
		nowPid = 0,	
		nowType = 0,
		nowSchool = 0,
		nowAuth = 0,
		isMember = {},		
		nextPage = 0;

	var tmpTarget = $("#fileInfoList"),
		actTarget = $('#actWinZone'),
		actWin = $('#actWin'),
		tabletitTarget = $("#tableTit");

	function toColl(e,d){
		if(nowGid){
			d.groupId = nowGid;
		}
		handerObj.triggerHandler('file:coll',d);
	}

	function toUnColl(e,d){
		if(nowGid){
			d.groupId = nowGid;
		}		
		handerObj.triggerHandler('file:uncoll',d);
	}

	function collSuc(e,d){
		var id = d.id,
			favid = d.favid
			gid = d.gid,
			target = d.target;

		//console.log(d);
		for(var i = 0,l= id.length;i<l;i++){
			$('.fav'+id[i]).addClass('s').attr('cmd','uncoll').attr('data-favid',favid[i]);
			//target[i].removeClass('s').attr('cmd','coll').attr('data-favid',favid[i]);
		}
	}

	function uncollSUc(e,d){
		var id = d.id,
			gid = d.gid,
			target = d.target;

		for(var i = 0,l= id.length;i<l;i++){
			$('.fav'+id[i]).removeClass('s').attr('cmd','coll').attr('data-favid',0);
			$('.coll'+id[i]).remove();
			//target[i].removeClass('s').attr('cmd','coll').attr('data-favid',0);
		}
	}

	function marksuc(e,d){
		var target = d.target;
		target.parent('span').prev('span').text(d.mark);
	}

	function fileInit(e,d){
		nowTotal = 0;
		nextPage = 0;
		action = 1;

		if(depnum < 0){
			var myInfo = Cache.get('myinfo');
			depnum = myInfo.dep.length;
			if(!depnum){
				$("#actDropDown .dep").hide();
			}else{
				$("#actDropDown .dep").show();
			}
		}

		if(d){
			nowGid = d.gid || 0;
			nowFd = d.fdid || 0;
			nowType = d.type || 0;
			if(d.order){
				nowOrder = d.order;
			}
			
			nowOds = '{'+nowOrder[0]+':'+nowOrder[1]+'}';
			nowUid = d.uid || 0;
			nowKey = d.key || '';
			nowPrep = d.prep || 0;
			nowGroup = d.info || null;
			nowSchool = d.school || 0;
			nowAuth = d.auth || 0;
			//rootFd = d.rootfdid || 0;
		}

		tmpTarget.find('.file').remove();

		var tpl = 'file.table';
		if(nowPrep){
			tpl = 'prep.table.tit';
		}
		var obj = {
			order : nowOrder,
			gid : nowGid,
			fdid : nowFd,
			uid : nowUid,
			prep : nowPrep,
			auth : nowAuth,
			school : nowSchool			
		}
		if(nowGid){
			obj.ml = nowGroup.mlist;
		}
		// if(!nowFd && rootFd){
		// 	nowFd = rootFd;
		// }
		var view = new View({
			target : tabletitTarget,
			tplid : tpl,
			data : obj		
		});
		view.createPanel();

		var data = {
			keyword : nowKey,
			page:nextPage,
			pageNum : config.pagenum,
			order : nowOds
		}

		if(nowGid){
			data.groupId = nowGid;
		}
		if(nowFd != 0){
			data.folderId = nowFd;
		// }else if(rootFd){
		// 	data.folderId = rootFd;
		}
		data.type = nowType;
		if(nowUid){
			data.creatorId = nowUid;
		}
		if(nowAuth){
			data.status = 1;
		}

		if(nowGroup && nowGroup.isMember){
			$("#fileActZone .renamefile").show();
			$("#fileActZone .delfile").show();
			$("#fileActZone .movefile").show();
		}else if(nowGroup){
			$("#fileActZone .renamefile").hide();
			if(!nowSchool){
				$("#fileActZone .delfile").hide();
			}
			$("#fileActZone .movefile").hide();			
		}
		if(nowUid){
			data.creatorId = nowUid;
		}	
		if(!d.info || nowSchool){
			handerObj.triggerHandler('file:search',data);	
		}else if((d.info && d.info.isMember) || d.open){
			handerObj.triggerHandler('file:search',data);	
		}
	}

	function fileLoad(e,d){
		nowTotal = d.total;
		//nextPage = d.next;
		if($(".file").length < nowTotal){
			nextPage += 1;
		}else{
			nextPage = 0;
		}
		var pr = 0;
		if(nowPrep){
			pr = nowPrep;
		}
		var view = new View({
			target : tmpTarget,
			tplid : 'file.user.list',
			data : {
				list : d.list,
				filetype : config.filetype,
				gid : nowGid,
				page : nextPage,
				fdid : nowFd,
				ginfo : nowGroup,
				down : config.cgi.filedown,
				pr : nowPrep,
				dep : depnum,
				ods : nowOds,
				key : nowKey,
				school : nowSchool,
				auth : nowAuth
			}
		});
		//console.log(nowSchool,nowAuth);

		view.appendPanel();	

		var pview = new View({
			target : $('#pageZone'),
			tplid : 'page',
			data : {
				next : nextPage
			}
		});

		pview.createPanel();		
	}

	// function orderChange(e,d){
	// 	tmpTarget.find('.file').remove();
	// 	nowOrder = d.order;
	// 	nowKey = d.key;
	// 	nextPage = 0;
	// 	nowFd = 0;

	// 	var view = new View({
	// 		target : tabletitTarget,
	// 		tplid : 'file.table',
	// 		data : {
	// 			order : nowOrder,
	// 			gid : nowGid,
	// 			fdid : nowFd
	// 		}			
	// 	});

	// 	view.createPanel();

	// 	handerObj.triggerHandler('file:serach',{
	// 		gid:nowGid,
	// 		keyword : nowKey,
	// 		folderId : nowFd,
	// 		page:nextPage,
	// 		pageNum : config.pagenum,
	// 		order : nowOrder
	// 	});		
	// }

	function search(e,d){
		tmpTarget.find('.file').remove();
		nowKey = d.key;
		
		//status 0 没审核 1 审核过
		var ods = {};
		ods[nowOrder[0]] = ods[nowOrder[1]];
		var obj = {
			keyword : nowKey,
			folderId : nowFd,
			page:nextPage,
			pageNum : config.pagenum,
			type : nowType,
			order : nowOds
		}
		if(nowGid){
			obj.groupId = nowGid;
		}
		if(nowUid){
			obj.creatorId = nowUid;
		}

		if(nowAuth){
			obj.status = 1;
		}
		console.log(obj);
		handerObj.triggerHandler('file:search',obj);			
	}

	function modelChange(e,d){
		if(d == 'file'){
			action = 1;
		}else{
			action = 0;
		}
	}

	function pageNext(e,d){
		//console.log(action,nextPage);
		if(!action || !nextPage){
			return;
		}

		var ods = {};
		ods[nowOrder[0]] = nowOrder[1];
		var obj = {
			keyword : nowKey,
			folderId : nowFd,
			page:nextPage,
			pageNum : config.pagenum,
			type : nowType,
			order : nowOds
		}
		if(nowGid){
			obj.groupId = nowGid;
		}
		if(nowUid){
			obj.creatorId = nowUid;
		}
		if(nowAuth){
			obj.status = 1;
		}		
		handerObj.triggerHandler('file:search',obj);				
	}

	function fileCheckSuc(e,d){
		var view = new View({
			target : actTarget,
			tplid : 'del',
			data : d,
			after : function(){
				$("#actWin").modal('show');
			},
			handlers : {
				'.btn-del' : {
					'click' : function(){
						if(!$.isEmptyObject(d.fl)){
							handerObj.triggerHandler('file:delfiles',d.fl);
						}
						if(!$.isEmptyObject(d.fd)){
							handerObj.triggerHandler('fold:delfolds',d.fd);
						}
					}
				}
			}
		});
		view.createPanel();		
	}

	function fileDel(e,d){
		if(d.cid.length){
			handerObj.triggerHandler('msg:error',40);
			return;
		}		
		if(!$.isEmptyObject(d.fd)){
			var fl = [];
			for(var i in d.fd){
				fl.push(i);
			}
			var obj = {
				folderId : fl,
				fd : d.fd,
				fl : d.fl
			}
			handerObj.triggerHandler('file:checkfold',obj);
		}else{
			var view = new View({
				target : actTarget,
				tplid : 'del',
				data : d,
				after : function(){
					$("#actWin").modal('show');

				},
				handlers : {
					'.btn-del' : {
						'click' : function(){
							if(!$.isEmptyObject(d.fl)){
								handerObj.triggerHandler('file:delfiles',d.fl);
							}
							if(!$.isEmptyObject(d.fd)){
								handerObj.triggerHandler('fold:delfolds',d.fd);
							}
						}
					}
				}
			});
			view.createPanel();
		}
	}

	function delSuc(e,d){
		var list = d.id;
		for(var i = 0,l=list.length;i<l;i++){
			$('.file'+list[i]).remove();
		}		
		if($('.file').length == 0){
			pageNext();
		}
		$('#tableTit input:checked').attr('checked',false);
		resetToolbar();
	}

	function fileEdit(e,d){
		var view = new View({
			target : actTarget,
			tplid : 'modify',
			data : {
				type : 'file',
				name : d.name
			},
			after : function(){
				$("#actWin").modal('show');
			},
			handlers : {
				'.btn-modify' : {
					'click' : function(){
						var n = actTarget.find('.obj-name').val();
						if(n != ''){
							var obj = {
								fileId : d.id,
								name : n
							};
							if(nowGid && nowGid != 0){
								obj.groupId = nowGid;
							}
						
							handerObj.triggerHandler('file:modify',obj);
						}
					}
				}
			}
		});
		view.createPanel();		
	}

	function modifySuc(e,d){
		$('.fdname'+d.fileId).text(d.name);
	}

	function fileShare(e,d){
		if(d.target == 'other'){
			handerObj.triggerHandler('file:getuser',{ type : d.target,files: d.fl});
		}else if(d.target == 'school'){
			var myinfo = Cache.get('myinfo');
			handerObj.triggerHandler('file:shareload',{ type : d.target,files: d.fl, list : myinfo[d.target].id});
		}else{
			var myinfo = Cache.get('myinfo');
			handerObj.triggerHandler('file:shareload',{ type : d.target,files: d.fl, list : myinfo[d.target]});
		}
		//handerObj.triggerHandler('file:share',{type:d.target,d.fl});
	}

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
			}			
		});
		view.appendPanel();
	}

	//添加
	function addShareUser(obj){
		//console.log(obj);
		if($('.shareUser'+obj._id).length==0){
			var view = new View({
				target : $('#shareToUser'),
				tplid : 'share.user.span',
				data : obj
			});
			view.appendPanel();
		}
	}
	//删除
	function delShareUser(obj){
		$('.shareUser'+obj._id).remove();
		$('.userClick'+obj._id).prop({
			'checked':false
		}).parents('ul.child').prevAll('.dep-click').prop({
			'checked':false
		});
	}

	function shareuserLoad(e,d){
		var selected = [];
		var view = new View({
			target : actTarget,
			tplid : 'share.user',	
			data : {
				list : d.list,
				fl : d.files
			},
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
									addShareUser(item);
								}else{
									delShareUser(item);
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
						actTarget.find('#shareToUser i').each(function(){
							li.push($(this).data('id'));
						});
						if(li.length===0){
							return;
						}
						var obj = {
							fileId : fls
						};
						obj.toUserId = li;
						handerObj.triggerHandler('file:shareto',obj);
					}
				}
			}			
		});
		view.createPanel();
	}

	function shareFoldLoad(e,d){
		$('#groupResult input[type=radio]:checked').removeAttr('data-load');
		var obj = {
			target : d.target,
			tplid : d.tplid,
			data : {
				list : d.list,
				gid : d.gid,
				root : d.root,
				ismember : true
			}
		};
		var myinfo = Cache.get('myinfo');
		if(myinfo.dep2key[d.gid]){
			obj.data.ismember = myinfo.dep2key[d.gid].isMember;
		}
		if(d.root){
			obj.handlers =  {
				'.list-link' : {
					'click' : function(e){
						var t = $(this);
						p = t.parent('li');
						p.find('input').click();
					}
				},
				'.plus' : {
					'click' : function(e){
						var t = $(this),
							id = t.attr('data-id'),
							load = t.attr('data-load'),
							gid = t.attr('data-gid');
						var p = t.parent('li');
						if(p.find('ul').length > 0){
							if(t.hasClass("minus")){
								t.removeClass('minus');
								p.find('ul').hide();
							}else{
								t.addClass('minus');
								p.find('ul').show();
							}
							return;
						}
						if(load){
							return;
						}
						t.addClass('minus').attr('data-load',1);
						var obj = {
							folderId : id,
							target : p,
							groupId : gid,
							tplid : 'share.fold.li',
							type : 1
						};
						handerObj.triggerHandler('fold:get',obj);
					}
				}
			}
		}
		var view = new View(obj);
		view.appendPanel();
	}

	function shareLoad(e,d){
		// if($.isEmptyObject(isMember)){
		// 	for(var i in d.list){
		// 		isMember[d.list[i].id] = d.list[i].isMember;
		// 	}
		// }
		var selected = [];
		var view = new View({
			target : actTarget,
			tplid : 'share',
			data : {
				type : d.type,
				fl : d.files,
				list : d.list
			},
			after : function(){
				$("#actWin").modal('show');

				$('.act-search-input').focus(function(){
					var target = $(this),
						def = target.attr('data-def');
					if(target.val() == def){
						target.val('');
					}	
				}).blur(function(){
					var target = $(this),
						def = target.attr('data-def');
					if(target.val() == ''){
						target.val(def);
					}					
				}).keyup(function(){
					if(e.keyCode == 13){
						actTarget.find('.act-search-btn').click();
					}
				});

				$('.act-search-btn').click(function(){
					var target = actTarget.find('.act-search-input'),
						def = target.attr('data-def'),
						key = target.val();
					if(key != def){
						$('#searchResult li').removeClass('color');
						for(var i=0,l=d.list.length;i<l;i++){
							var item = d.list[i];
							if(item.name.indexOf(key) >=0 ){
								$('.tag'+item.id).addClass('color');
							}
						}
					}
				});

				$('#groupResult .group-name').bind('click',function(){
					var t = $(this),
						p = t.parent('li');
						p.find('input').click();
				});

				$('#groupResult input[type=radio]').bind('click',function(){
					var t = $(this),
						v = t.val(),
						load = t.attr('data-load'),
						fdid = t.attr('data-fd');
					if(v && !load){
						t.attr('data-load',1);
						var obj = {
							target : $('#groupFoldResultUl'),
							tplid : 'share.fold.li',
							groupId : v,
							folderId : fdid,
							type : 1,
							root : 1
						}
						$('#groupFoldResultUl').html('');
						handerObj.triggerHandler('fold:get',obj);
					}
				});
			},
			handlers : {		
				'.btn-share' : {
					'click' : function(){
						var fls = [];						
						var li = [];
						for(var i in d.files){
							fls.push(d.files[i].id);
						}
						var gid = $('#groupResult input:checked').val();
						if(d.type == 'school'){
							info = Cache.get('myinfo');
							gid = info.school.id;
						}
						
						var fdid = $("#groupFoldResultUl input:checked").val();
						/*
						actTarget.find('input:checked').each(function(){
							li.push($(this).val());
						});
						*/
						var obj = {
							fileId : fls
						};
						if(fdid && fdid.length > 20){
							obj.toFolderId = [fdid];
						}
						// if(d.type == 'other'){
						// 	obj.toUserId = li;
						// }else{
							obj.toGroupId = [gid];
						//}
						//if(li.length===0){

						if(d.type == 'dep' && !obj.toFolderId){
							handerObj.triggerHandler('msg:error',60);
							return;
						}
						handerObj.triggerHandler('file:shareto',obj);
					}
				}
			}
		});
		view.createPanel();		
	}

	function aLinkClick(e){
		var t = $(e.target);
		$(".act-fold-list a").removeClass('selected');
		if(t.hasClass('list-link')){
			if(t.hasClass("selected")){
				t.removeClass('selected');
			}else{
				t.addClass('selected');
			}
		}
		actTarget.find('.btn-sub').attr('disabled',false);
	}

	function fileMove(e,d){

		var fold,
			info
			rootfd = 0;
		if(nowGid){
			fold = Cache.get('rootFolder'+nowGid);
			info = Cache.get('myinfo');
			rootfd = info.group2key[nowGid].rootFolder._id || info.group2key[nowGid].rootFolder.$id || info.group2key[nowGid].rootFolder.id;
		}else{
			fold = Cache.get('myfold');
			info = Cache.get('myinfo');
			rootfd = info.rootFolder.$id;
		}

		if(!fold){
			fold = [];
		}
		var fileid = [];
		var ids = [];
		for(var i in d.fl){
			fileid.push(d.fl[i].fid);
			ids.push(d.fl[i].id);
		}
		var view = new View({
			target : actTarget,
			tplid : 'movefile',
			data : {
				fl : d.fl,
				fold : fold,
				root : rootfd
			},
			after : function(){
				$("#actWin").modal('show');
				actTarget.find('.plus').unbind().bind('click',function(e){
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
							handerObj.triggerHandler('fold:get',{
								groupId : nowGid,
								folderId : id,
								target : p,
								tplid : 1
							});
						}
				});
			},
			handlers : {
				'.list-link' : {
					'click' : aLinkClick
				},
				'.btn-sub' : {
					'click' : function(e){
						var t = $(".act-fold-list a.selected");
						if(t.length){
							var id = t.attr('data-id');
							var obj = {
								fileId : ids,
								targetId : id								
							}
							if(nowGid){
								obj.groupId = nowGid;
							}

							handerObj.triggerHandler('file:moveto',obj);
						}
					}
				}
			}			
		});
		view.createPanel();
	};

	function fileCopy(e,d){
		var myinfo = Cache.get('myinfo');
		var prep = myinfo['prep'];
		if(!prep){
			prep = [];
		}

		var fileid = [];
		var ids = [];
		for(var i in d.fl){
			fileid.push(d.fl[i].fid);
			ids.push(d.fl[i].id);
		}
		var gid = 0;
		var view = new View({
			target : actTarget,
			tplid : 'copyfile',
			data : {
				fl : d.fl,
				prep : prep
			},
			after : function(){
				$("#actWin").modal('show');
				actTarget.find('.plus').unbind().bind('click',function(e){
						var target = $(e.target),
							id = target.attr('data-id');
						gid = target.attr('data-gid');

						var p = target.parent('li');
						if(p.find('ul').length > 0){
							if(target.hasClass("minus")){
								target.removeClass('minus');
								p.find('ul').hide();
							}else{
								target.addClass('minus');
								p.find('ul').show();
							}
							return;
						}else{			
							handerObj.triggerHandler('fold:get',{
								groupId : gid,
								folderId : id,
								target : p,
								tplid : 1
							});
						}					
				});
			},
			handlers : {
				'.list-link' : {
					'click' : aLinkClick
				},
				'.btn-sub' : {
					'click' : function(e){
						var t = $(".act-fold-list a.selected");
						if(t.length){
							var gid = t.attr('data-gid'),
								id = t.attr('data-id');
							var obj = {
								fileId : ids,
								toGroupId : [gid]								
							}
							if(id){
								obj.toFolderId = [id];
							}
							handerObj.triggerHandler('file:shareto',obj);
						}
					}
				}
			}			
		});
		view.createPanel();		
	}	

	function fileSave(e,d){
		var myInfo = Cache.get('myinfo');
		var obj = {
			fileId : [d],
			targetId : myInfo.rootFolder.id,
			savetomy : 1
		}
		handerObj.triggerHandler('file:savetomy',obj);
	}

	function fileSaveSuc(e,d){
		for(var i in d){
		$('.filesave'+d[i]).remove();
		}
	}

	function foldTree(e,d){
		target = d.target;
		if(!d.list.length){
			target.find('i').attr('class','');
		}else{
			target.find('i').addClass('minus');
		}
		var view = new View({
			target : target,
			tplid : 'copy.tree',
			data : {
				list : d.list,
				gid : target.find('i').attr('data-gid')
			},
			after : function(){
				target.find('.plus').unbind().bind('click',function(e){
						var target = $(e.target),
							id = target.attr('data-id');
						var p = target.parent('li');
						if(p.find('ul').length > 0){
							if(target.hasClass("minus")){
								target.removeClass('minus');
								p.find('ul').hide();
							}else{
								target.addClass('minus');
								p.find('ul').show();
							}
							return;
						}else{		
							handerObj.triggerHandler('fold:get',{
								gid : nowGid,
								folderId : id,
								target : p,
								tplid : 1
							});
						}
					});
			},
			handlers : {
				'.list-link' : {
					'click' : aLinkClick
				}
			}
		});

		view.appendPanel();			
	}

	function recyRef(e,d){
		var obj = {
			fileId : d.id
		}
		if(nowGid){
			obj.groupId = nowGid;
		}
		handerObj.triggerHandler('file:recyref',obj);
	}

	function recyDel(e,d){
		var obj = {
			fileId : d.id,
			size : d.size
		}
		if(nowGid){
			obj.groupId = nowGid;
		}
		handerObj.triggerHandler('file:recydel',obj);
	}	

	function recySuc(e,d){

		var ids = d.ids,
			size = d.size;
		var as = 0;
		for(var i in size){
			as += size[i];
		}
		for(var i in ids){
			$('.recy'+ids[i]).remove();
		}
		var myInfo = Cache.get('myinfo');
		myInfo.oused = parseInt(myInfo.oused);
		myInfo.osize = parseInt(myInfo.osize);
		myInfo.oused -= as;
		if(myInfo.oused <= 0){
			myInfo.oused = 0;
			myInfo.pre = 0;
			myInfo.used = 0;
		}else{
			myInfo.pre = util.getNums(myInfo.oused/myInfo.osize)*100;
			myInfo.used = util.getSize(myInfo.oused);
		}

		if(!myInfo.pre && !myInfo.oused){
			myInfo.pre = 0;
		}
		if(myInfo.pre >= 0 && myInfo.pre < 0.01){
			myInfo.pre = 0.1;
		}
		handerObj.triggerHandler('cache:set',{key: 'myinfo',data: myInfo});
		var view = new View({
			target : $('#userInfoAside'),
			tplid : 'my.info',
			data : myInfo,
			handlers : {
				'a.layout' : {
					click : function(e){
						window.location = config.cgi.logout;
					}
				}
			}			
		});
		view.createPanel();		
	}	

	function uploadSuc(e,d){

		d.fid = d.resource._id;
		d.size = util.getSize(d.resource.size);
		d.time = util.time(d.createTime);

		var target = tmpTarget,
			act = 0;
		if(tmpTarget.find('.file').length > 0){
			target = tmpTarget.find('.file').eq(0);
			act = 1;
		}
		var pr = 0;
		if(nowPrep == 'group'){
			pr = 1;
		}
		d.nick = Cache.get('myinfo').nick;
		var view = new View({
			target : target,
			tplid : 'file.user.list',
			data : {
				list : [d],
				filetype : config.filetype,
				gid : nowGid,
				page : nextPage,
				fdid : nowFd,
				ginfo : nowGroup,
				down : config.cgi.filedown,
				school : nowSchool,
				ods : nowOds,
				key : nowKey,
				auth : nowAuth,
				dep : depnum,
				pr : pr
			}
		});

		if(act){
			view.beforePanel();		
		}else{
			view.appendPanel();				
		}
		
	}

	function sharesuc(e,d){
		//resetToolbar();
	}

	function moveSuc(e,d){
		var ids = d.ids;
		for(var i in ids){
			$('.file'+ids[i]).remove();
		}
		//resetToolbar();
	}

	function resetToolbar(){
		$("#fileActZone").addClass('hide');
		$(".tool-zone").removeClass('hide');
	}


	function editMark(e,d){
		if(nowGid){
			d.groupId = nowGid;
		}
		handerObj.triggerHandler('file:edit',d);
	}	

	var handlers = {
		//'order:change' : orderChange,
		'file:sharefoldload' : shareFoldLoad,
		'recy:recysuc' : recySuc,	
		'recy:ref' : recyRef,
		'recy:del' : recyDel,
		'file:save' : fileSave,	
		'file:savesuc' : fileSaveSuc,	
		'file:movesuc' : moveSuc,
		'file:treeload' : foldTree,
		'file:move' : fileMove,
		'file:copy' : fileCopy,
		'file:share' : fileShare,
		'file:shareload' : shareLoad,
		'file:shareuserload' : shareuserLoad,
		'file:modifysuc' : modifySuc,
		'file:viewedit' : fileEdit,
		'file:delsuc' : delSuc,
		'model:change' : modelChange,
		'search:start' : search,
		'file:del' : fileDel,
		'fild:checkSuc' : fileCheckSuc,
		'file:init' : fileInit,
		'file:load' : fileLoad,
		'file:tocoll' : toColl,
		'file:touncoll' : toUnColl,
		'fav:collsuc' : collSuc,
		'fav:uncollsuc' : uncollSUc,
		'file:marksuc' : marksuc,
		'page:next' : pageNext,
		'file:sharesuc' : sharesuc,
		'file:editmark' : editMark,
		'file:uploadsuc' : uploadSuc
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}
});
define('model.fold',['config','helper/request','helper/util','cache'],function(config,request,util,Cache){

	var	handerObj = $(Schhandler);

	function convent(data){
		var list = [];
		for(var i=0,l=data.length;i<l;i++){
			var item = data[i];
			list.push({
				id : item._id,
				name : item.name,
				mark : item.mark,
				hasChild : item.hasChild,
				hasFile : item.hasFile,
				nick : item.creator.nick  || item.nick,				
				time : util.time(item.createTime),
				open : item.isOpen || 0,
				read : item.isReadonly || 0,
				pid : item.parent.$id,
				tid : item.top.$id,
				idpath : item.idpath
			})
		}
		return list;
	}

	function conventOne(data){

		var t = {};
		if(!data){
			return t;
		}
		t.idpath = data.idpath.split(',');
		if(data.parent){
			t.pid = data.parent._id;
			t.pname = data.parent.name;
		}else{
			t.pid = 0;
			t.pname = '';
		}
		if(data.top){
			t.tid = data.top._id;
			t.tname = data.top.name;
		}else{
			t.tid = 0;
			t.tname = '';
		}

		t.isOpen = data.isOpen || false;
		t.isReady = data.isReadonly || false;

		// if(t.pid == t.tid){
		// 	t.pid = 0;
		// }
		t.id = data._id;
		t.name = data.name;
		return t;
	}

	//新建文件夹
	function foldCreate(e,d){
		var opt = {
			cgi : config.cgi.foldcreate,
			data : d
		};
		var td = d;	
		var success = function(d){
			handerObj.triggerHandler('msg:error',d.err);
			if(d.err == 0){
				var myinfo = Cache.get('myinfo');
				d.result.data.nick = myinfo.nick;
				var list = convent([d.result.data]);
				handerObj.triggerHandler('fold:load',{list:list,pid:d.result.data.parent['$id']});	
			}else{
				
			}
		}
		request.post(opt,success);				
	}

	function foldSearch(e,d){
		
		var opt = {
			cgi : config.cgi.foldsearch,
			data : d
		}
		var success = function(d){
			if(d.err == 0){
				var list = convent(d.result.list);
				handerObj.triggerHandler('fold:load',{list:list});

			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);		
	}

	function foldOne(e,d){

		var opt = {
			cgi : config.cgi.foldinfo,
			data : d
		}

		var success = function(d){
			if(d.err == 0){
				if(d.result.data){
				var data = conventOne(d.result.data);
				handerObj.triggerHandler('fold:oneinfo',data);
				}			
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}		
		request.get(opt,success);	
	}

	function foldGet(e,d){
		var data = d || {};
		var page = data.page || 0,
			gid = data.groupId || 0,
			order = data.order || {},
			fdid = data.folderId || 0,
			creator = data.creatorId || 0,
			type = data.type || 0,
			root = data.root || 0,
			tplid = data.tplid,
			target = data.target || 0,
			root = data.root || 0;

		var obj = {
			folderId : fdid
		};

		if(gid){
			obj.groupId = gid;
		}
		if(creator){
			obj.creatorId = creator;
		}

		var opt = {
			cgi : config.cgi.foldlist,
			data : obj
		}
		var success = function(d){
			if(d.err == 0){
				var list = convent(d.result.list);
				if(target){
					if(tplid){
						if(type){
							handerObj.triggerHandler('file:sharefoldload',{list:list,gid:gid,root:root,target:target,tplid:tplid});
						}else{
							handerObj.triggerHandler('file:treeload',{list:list,target:target,tplid:tplid});
						}
					}else{
						if(type){
							handerObj.triggerHandler('fold:titload',{list:list,target:target,root:root});
						}else{
							handerObj.triggerHandler('fold:treeload',{list:list,target:target,root:root});
						}
					}
				}else{
					handerObj.triggerHandler('fold:load',{list:list,root:root});
				}
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);	
	}


	function editmark(e,d){

		var data = {
			folderId : d.folderId,
			mark : d.mark
		};
		if(d.groupId){
			data.groupId = d.groupId;
		}
		var target = d.target,
			mark = d.mark;
		var opt = {
			method : 'POST',
			cgi : config.cgi.foldmodify,
			data : data
		}	

		var success = function(d){
			handerObj.triggerHandler('msg:error',d.err);
			if(d.err == 0){
				handerObj.triggerHandler('fold:marksuc',{id:d.id,target:target,gid:d.gid,mark:mark});
			}else{
				
			}
		}
		request.post(opt,success);	
	}

	function delFold(e,d){
		var folderId = [];
		for(var i in d){
			folderId.push(i);
		}	
		var opt = {
			method : 'POST',
			cgi : config.cgi.folddel,
			data : {
				folderId : folderId
			}
		}
		var success = function(d){
			handerObj.triggerHandler('msg:error',d.err);
			if(d.err == 0){
				handerObj.triggerHandler('fold:delsuc',{id: folderId});
			}else{
				
			}
		}
		request.post(opt,success);						
	}

	function foldModify(e,d){
		var opt = {
			method : 'POST',
			cgi : config.cgi.foldmodify,
			data : d
		}
		var td = d;
		var success = function(d){
			handerObj.triggerHandler('msg:error',d.err);
			if(d.err == 0){
				handerObj.triggerHandler('fold:modifysuc',td);
			}else{
				
			}
		}
		request.post(opt,success);		
	}

	var handlers = {
		//'file:get' : getFile,
		'fold:modify' : foldModify,
		'fold:delfolds' : delFold,
		'fold:one' : foldOne,
		'fold:new' : foldCreate,
		'fold:search' : foldSearch,
		'fold:get' : foldGet,
		'fold:edit' : editmark
	}	

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}

});
define('view.fold',['config','helper/view','cache','model.fold'],function(config,View,Cache){
	var	handerObj = $(Schhandler);

	var nowGid = 0,
		uid = 0,
		action = 0, //当前页卡是否在活动状态
		nowGinfo = {},
		nowData = {},
		nowFdInfo = {},
		nowKey = '',
		nowFd = 0,
		nowSchool = 0,
		nowAuth = 0,
		rootFd = 0,
		nowPrep = 0, //当前是否是备课
		nowOrder  = ['createTime',-1],
		nowOds = '';
		nowUid = 0,
		nowType = 0,
		nowGrade = 0,
		nowTag = 0,	
		nowPid = 0,	
		isOpen = 0,
		isRead = 0,
		isLoad = false,
		treeLoad = false,
		nextPage = 0;

	var tmpTarget = $("#fileInfoList"),
		foldTarget = $('#foldList'),
		actTarget = $('#actWinZone'),
		actWin = $('#actWin'),	
		titTarget = $('#sectionTit');

	function crTit(obj){
		if($.isEmptyObject(obj)){
			obj = 0;
		}
		var tpl = 'file.tit';
		var data = {
			gid : nowGid,
			gname : nowGinfo.name || '',
			school : nowSchool,
			filetype : config.filetype,
			root : rootFd,
			type : nowType,
			key : nowKey,
			fold : obj || 0,
			fdid : nowFd			
		}
		if(nowGid){
			data.ml = nowGinfo.mlist;
		}
	
		if(nowPrep == 'my'){
			tpl = 'prep.tit';
			data.pr = nowPrep;
		}else if(nowPrep == 'group'){
			tpl = 'prep.group.tit';
			var userList = Cache.get('alluser2key');
			var plist = Cache.get('preplist');
			// list : plist,
			// ul : userList,
			// pid : nowPid,
			// tag : nowTag,
			// grade : nowGrade,
			// uid : nowUid		
			data.pr = nowPrep;
			data.tlist = config.tag;
			data.glist = config.grade;
			data.list =  plist;
			data.ulist = userList;
			data.pid = nowPid;
			data.tag = nowTag;
			data.grade = nowGrade;
			data.uid = nowUid;
		}

		var view = new View({
			target : titTarget,
			tplid : tpl,
			data : data,
			handlers : {
				'.dr-menu' : {
					'mouseenter' : function(e){
						var t = $(this);
							target = t.attr('data-target'),
							id = t.attr('data-id'),
							mt = $('#'+target);
						//console.log(12345);
						//mt.attr('loading');
						//if(!mt.attr('data-loaded')){
							var obj = {
								folderId : id,
								target : mt,
								type : 'fold'
							}
							if(nowGid){
								obj.groupId = nowGid;
							}
							if(nowUid){
								obj.creatorId = nowUid;
							}							
							if(mt.attr('loading')){
								$('.tit-menu').hide();
								mt.show();
								//mt.dropdown('toggle');
							}else{
								handerObj.triggerHandler('fold:get',obj);
							}
						//}
					}
				}
			}		
		});
		view.createPanel();
	}

	/*
	需要拉根目录下的文件夹
	*/
	function makeTree(list,target,id,tree){//列表.目标,当前文件夹id,是否是从树中点击过来的.
		if(target == foldTarget){
			foldTarget.html('');
		};

		var handlers = {};
		if(!treeLoad){
			treeLoad = true;
			handlers = {
				'.plus' : {
					'click' : function(){
						//console.log(123);
						var target = $(this),
							load = target.attr('data-load'),
							id = target.attr('data-id');
						var p = target.parent('li');
						if(p.find('ul').length > 0){
							if(target.hasClass("minus")){
								target.removeClass('minus');
								p.find('ul').hide();
							}else{
								target.addClass('minus');
								p.find('ul').show();
							}
							return;
						}
						if(load){
							return;
						}
						target.attr('data-load',1);
						var obj = {
							folderId : id,
							target : p
						};
						if(nowGid){
							obj.groupId = nowGid;
						}
						handerObj.triggerHandler('fold:get',obj);							
					}
				}
			}
		}

		var view = new View({
			target : target,
			tplid : 'fold.tree',
			before : function(){
				$('#foldList li').removeClass('selected');
			},
			after : function(){
				// if(!$("#foldList").attr('show')){
				// 	$('#foldTree').click();
				// }
				$('#foldtree'+nowFd).attr('data-load',1).addClass('minus');
				$('#foldtreeli'+nowFd).addClass('selected').find('ul').show();
				// if(!tree){
				// 	var path = list[0].idpath;
				// 	path = path.split(',');
				// 	for(var i in path){
				// 		if(!$("#foldtree"+path[i]).hasClass('.minus') && !$("#foldtree"+path[i]).attr('data-load')){
				// 		}
				// 	}
				// }
			},
			data : {
				list : list,
				gid : nowGid,
				fdid : id,
				order : nowOds,
				school : nowSchool
			},
			handlers : handlers
		});
		view.appendPanel();			
	}

	function titLoad(e,d){
		var data = {
			gid : nowGid,
			gname : nowGinfo.name || '',
			school : nowSchool,
			filetype : config.filetype,
			type : nowType,
			key : nowKey,
			fdid : nowFd,
			list : d.list
		};	
		var view = new View({
			target : d.target,
			tplid : 'file.tit.list',
			data : data,
			after : function(){
				//d.target.dropdown('toggle');
				$('.tit-menu').hide();
				d.target.show();
				if(d.list.length>0){
					d.target.removeClass('hide');
				}
				d.target.attr('loading',1);
			}
		});	
		view.createPanel();
	}

	function foldTree(e,d){
		if(d.root){
			handerObj.triggerHandler('cache:set',{key: 'rootFolder'+nowGid,data:d.list});
		}
		makeTree(d.list,d.target,nowFd,true);
		d.target.addClass('minus');
		d.target.find('i:first').addClass('minus');
	}

	function marksuc(e,d){
		var target = d.target;
		if(target){
			target.parent('span').prev('span').text(d.mark);
		}
	}

	function foldInit(e,d){
		action = 1;
		foldTarget.hide().removeAttr('show');
		foldTarget.css('float','none').css('width','100%');
		nowData = d;
		if(!uid){
			uid = Cache.get('myinfo').id;
		}

		// foldTarget.html('')
		tmpTarget.html('');
		nowFdInfo = {};
		if(d){
			nowGid = d.gid || 0;
			nowGinfo = d.info || {};
			nowFd = d.fdid || 0;
			nowKey = d.key || '';
			nowPrep = d.prep || 0;
			nowUid = d.uid || 0;
			rootFd = d.rootfdid || 0;
			nowType = d.type;
			if(d.order){
				nowOrder = d.order;
			}
			nowOds = '{'+nowOrder[0]+':'+nowOrder[1]+'}';

			nowSchool = d.school || 0;
			nowAuth = d.auth || 0;
			//备课
			nowGrade = d.grade || 0;
			nowTag = d.tag || 0;
			nowUid = d.uid || 0;
			nowPid = d.pid || 0;						
		}

		if(nowGid && !nowFd){
			$('#btnZone').hide();
		}else{
			if(nowPrep == 'group'){
				$('#btnZone').hide();
			}else if(!nowSchool){
				$('#btnZone').show();
			}
		}


		//crTit();
		var data = {};
		if(nowFd){
			data.folderId = nowFd;
		}
		//folderId : nowFd
		//};
		if(nowGid){
			data.groupId = nowGid;
		}
		handerObj.triggerHandler('fold:one',data);			

		var obj = {};
		if(nowFd){
			obj.folderId = nowFd;
		}
		// if(nowFd){
		// 	obj.folderId = nowFd;
		// }else if(rootFd){
		// 	obj.folderId = rootFd;
		// }
		if(nowGid){
			obj.groupId = nowGid;
		}
		if(nowUid){
			obj.creatorId = nowUid;
		}

		if(isLoad){
			return;			
		}
		isLoad = true;


		// if(nowFd != rootFd){

		// 	var o1 = {
		// 		folderId : rootFd
		// 	}	
		// 	if(nowUid){
		// 		o1.creatorId = nowUid;
		// 	}
		// 	o1.root = 1;
		// 	if(!nowGid){
		// 		handerObj.triggerHandler('fold:get',o1);
		// 	};
		// }

		if(nowKey == ''){
			handerObj.triggerHandler('fold:get',obj);
		}else{
			obj.key = nowKey;
			handerObj.triggerHandler('fold:get',obj);
		}
	}

	function foldOne(e,d){

		if(d.isOpen){
			nowData.open = 1;
		}
		if(nowData.info){
			handerObj.triggerHandler('file:init',nowData);
		}
		if(nowGid && (nowGinfo.type != 0 && !nowGinfo.isMember) && nowFd == nowGinfo.rootFolder.id && !nowPrep){
			$('#btnZone').hide();
		}else{
			if(!$.isEmptyObject(nowGinfo) && (!nowGinfo.isMember && nowGinfo.type !=0)){
				if(d.isOpen && !d.isReady){
					$(".btn-upload").show();
				}else{
					$('#btnZone').hide();
				}
			}
		}

		nowFdInfo = d;
		crTit(d);
	}

	function foldLoad(e,d){
		isLoad = false;
		//个人的首页
		if(!nowGid){ // && !nowFd){
			//if(!nowFd || nowFd == rootFd || d.root){
				
            	//新建文件夹
                if(d.pid == rootFd){
                	var fl = Cache.get('myfold');
                	fl.push(d.list[0]);
                	makeTree(fl,foldTarget,nowFd);
					handerObj.triggerHandler('cache:set',{key: 'myfold',data:fl});                	
                }else{
                	if(d.list.length > 0){
		            	var td = d.list[0];
		            	var target = $('#foldList .fold'+td.pid);
		            	//根目录下的文件夹
		            	if(td.pid == rootFd){
		            		target  = foldTarget;
		            	}
						makeTree(d.list,target,nowFd);
						handerObj.triggerHandler('cache:set',{key: 'myfold',data:d.list});
					}
				}
			//}
		//小组,部门,学校
		}else if(nowGinfo.rootFolder){
			if(nowGinfo.rootFolder.id == nowFd){
				if(d.pid == rootFd){
                	var fl = Cache.get('rootFolder'+nowGid);
                	fl.push(d.list[0]);
                	makeTree(fl,foldTarget,nowFd);
					handerObj.triggerHandler('cache:set',{key: 'rootFolder'+nowGid,data:fl});
				}else{
					if(d.list.length > 0){
		            	var td = d.list[0];
		            	var target = $('#foldList .fold'+td.pid);
		            	//根目录下的文件夹
		            	if(td.pid == rootFd){
		            		target  = foldTarget;
		            	}					
						makeTree(d.list,target,nowFd);
						handerObj.triggerHandler('cache:set',{key: 'rootFolder'+nowGid,data:d.list});
					}
				}
			}else{
            	var td = d.list[0];
            	if(d.list.length){
	            	var target = $('#foldList .fold'+td.pid);
	            	//根目录下的文件夹
	            	if(td.pid == rootFd){
	            		target  = foldTarget;
	            	}					
					makeTree(d.list,target,nowFd);				
				}
				//这个地方有点糊涂了...暂时不用,可能是树哪儿的逻辑.
				//非跟目录
				// var obj = {
				// 	groupId : nowGid,
				// 	target : foldTarget,
				// 	root: 1
				// }
				// if(nowGinfo.rootFolder){
				// 	obj.folderId = nowGinfo.rootFolder.id;
				// }
				//handerObj.triggerHandler('fold:get',obj);
			}
		}
		
		if(d.root){
			return;
		}

		var pr = 0;
		if(nowPrep){
			pr = nowPrep;
		}
		var view = new View({
			target : tmpTarget,
			tplid : 'fold.user.list',
			data : {
				list : d.list,
				gid : nowGid,
				pr : pr,
				prep : nowPrep,
				grade : nowGrade,
				school : nowSchool,
				ginfo : nowGinfo,
				auth : nowAuth,
				tag : nowTag,
				uid : nowUid
			}
		});
		view.beginPanel();		
	}

	// function orderChange(e,d){
	// 	tmpTarget.find('.fold').remove();
	// 	nowOrder = d.order;
	// 	nowKey = d.key;
	// 	nextPage = 0;
	// 	nowFd = 0;
	// 	handerObj.triggerHandler('fold:search',{
	// 		gid:nowGid,
	// 		keyword : nowKey,
	// 		folderId : nowFd,
	// 		page:nextPage,
	// 		pageNum : config.pagenum,
	// 		order : nowOrder
	// 	});	
	// }

	function search(e,d){
		tmpTarget.find('.fold').remove();
		nowKey = d.key;

		var data = {
			keyword : nowKey,
			page:0,
			pageNum : 0,
			order : nowOds			
		}

		if(nowGid){
			data.groupId = nowGid;
		}
		if(nowFd){
			data.folderId = nowFd;
		}
		if(nowUid){
			data.creatorId = nowUid;
		}
		//console.log(data);
		
		handerObj.triggerHandler('fold:search',data);			
	}	

	//新建文件夹
	function createFold(e,d){
		var data = {
			name : d.name,
			isOpen : d.isOpen,
			isReadonly : d.isReadonly
		}

		if(nowGid){
			data.groupId = nowGid;
		}
		if(nowFd){
			data.folderId = nowFd;
		}

		handerObj.triggerHandler('fold:new',data);
	}

	function delSuc(e,d){
		$("#fileActZone").addClass('hide');
		$(".tool-zone").removeClass('hide');		
		var list = d.id;
		var fl = [];
		var nl = [];
		if(!nowGid){
			fl = Cache.get('myfold');
		}else{
			fl = Cache.get('rootFolder'+nowGid);
		}

		for(var i = 0;i<fl.length;i++){
			if($.inArray(fl[i].id,list)<0){
				nl.push(fl[i]);
			}
		}
		if(!nowGid){
			handerObj.triggerHandler('cache:set',{key: 'myfold',data:nl});			
		}else{
			handerObj.triggerHandler('cache:set',{key: 'rootFolder'+nowGid,data:nl});			
		}

		for(var i = 0,l=list.length;i<l;i++){
			$('.fold'+list[i]).remove();
		}
	}

	function foldEdit(e,d){
		var view = new View({
			target : actTarget,
			tplid : 'modify',
			data : {
				type : 'fold',
				name : d.name
			},
			after : function(){
				$("#actWin").modal('show');
			},
			handlers : {
				'.btn-modify' : {
					'click' : function(){
						var n = actTarget.find('.obj-name').val();
						if(n != ''){
							var obj = {
								folderId : d.id,
								name : n
							};
							if(nowGid){
								obj.groupId = nowGid;
							}
							handerObj.triggerHandler('fold:modify',obj);
						}
					}
				}
			}
		});
		view.createPanel();			
	}

	function editMark(e,d){
		if(nowGid){
			d.groupId = nowGid;
		}
		handerObj.triggerHandler('fold:edit',d);
	}

	function modifySuc(e,d){
		$('.fdname'+d.folderId).text(d.name);
	}

	function showCreateFold(){
		$('#newFold .check-open:checked').attr('checked',false);
		$('#newFold .check-read:checked').attr('checked',false);
		$('#newFold .open-fold').addClass('hide');
		$('#newFold .read-fold').addClass('hide');			
		if(nowGid){
			if(nowGinfo.isMember && nowGinfo.type==2){
				$('#newFold .open-fold').removeClass('hide');
				//$('#newFold .read-fold').removeClass('hide');
			}
		}
		$('#newFold').modal('show');
	}

	var handlers = {
		'fold:titload' : titLoad,
		'fold:treeload' : foldTree,
		'fold:modifysuc' : modifySuc,
		'fold:viewedit' : foldEdit,
		'fold:delsuc' : delSuc,
		'fold:create' : createFold,
		'fold:createfold' : showCreateFold,
		//'order:change' : orderChange,
		'foldsearch:start' : search,
		'fold:marksuc' : marksuc,
		'fold:init' : foldInit,
		'fold:load' : foldLoad,
		'fold:editmark' : editMark,
		'fold:oneinfo' : foldOne
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}
});

define('view.my',['config','cache','helper/view','helper/util','model.file'],function(config,Cache,View,Util){

	var	handerObj = $(Schhandler),
		myInfo = null,
		loading = 0,
		isFrist = 1,
		nowKey = '',  //当前关键字
		nowFd = 0, //当前文件夹
		nowOd = 0,   //当前排序方式
		nowOn = 0,   //当前排序字段
		nextPage = 0, //下一页
		nowPage = 0; //当前页码

	var	fileView = new View(),
		foldView = new View(),
		foldTitView = new View();

	//var fileTarget = $('#fileList'),
	var	tableTarget = $('#tableTit'),
		searchTarget = $('#searchZone'),
		fileTarget = $('#fileInfoList'),
		pageTarget = $("#pageZone"),
		foldTarget = $('#foldList'),
		foldTitTarget = $('#sectionTit');

	var fileType = config.filetype;

	function init(e,d){
		$('#aside .aside-divs').hide();
		$('#userAside').show();

		if(!myInfo){
			myInfo = Cache.get('myinfo');
		}
	
		$("#fileActZone .renamefile").show();
		$("#fileActZone .delfile").show();
		$("#fileActZone .movefile").show();			
		$("#btnZone").show();
		$('.btn-newfold').show();
		$('.btn-upload').show();

		if(d.fdid == 0 || !d.fdid){
			d.fdid = myInfo.rootFolder.id;
		}
		d.rootfdid = myInfo.rootFolder.id;
		d.used = myInfo.oused;
		d.size = myInfo.osize;
		var obj = {};
		// if(d.fdid){
		// 	obj.fdid = d.fdid;
		// }else{
		// 	obj.fdid = d.rootfdid;
		// }
		Util.showNav('my');
        handerObj.triggerHandler('file:init',d);
        handerObj.triggerHandler('fold:init',d);	
        handerObj.triggerHandler('upload:param',d);
	
	}

	function prep(){

	}


	function change(e,d){
		nowPage = 0;
		nowOd = 0;
		nowOn = 0;
		nowKey = '';
	}	

	var handlers = {
		'my:init' : init
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}

    $(document).on('scrollBottom',function(e){
    	if(loading){
    		return;
    	}
    	loading = 1;
    	if(nextPage){
    		pageTarget.find('a').click();
    	}
    });

});
define('model.group',['config','helper/request','helper/util'],function(config,request,util){
	var	handerObj = $(Schhandler);

	function convent(data){
		var list = [];
		for(var i = 0,l= data.length;i<l;i++){
			var item = data[i];
			var obj = {
				id : item._id,
				time : util.time(item.createTime),
				content : item.content
			};
			if(item.creator){
				obj.name = item.creator.nick;
			}
			list.push(obj);
		}
		return list;
	}

	function conventMembers(list){
		var ml = [];
		for(var i in list){
			ml.push(list[i]._id);
		}
		return ml;
	}

	function convent2Members(list){
		var ml = {};
		for(var i in list){
			list[i].id = list[i]._id;
			ml[list[i]._id] = list[i];
		}
		return ml;
	}	

	function groupEdit(e,d){
		var opt = {
			cgi : config.cgi.groupmodify,
			data : d
		}	
		var success = function(d){
			if(d.err == 0){
				d.result.data.id = d.result.data._id;
				d.result.data.auth = 1;
				handerObj.triggerHandler('msg:error',d.err);
				handerObj.triggerHandler('group:modifySuc',d.result.data);
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.post(opt,success);	
	}	

	function board(e,d){
		var gid = d.groupId,
			type = d.type,
			keyword = d.keyword;
		var opt = {
			cgi : config.cgi.boardlist,
			data : d
		}	
		var success = function(d){
			if(d.err == 0){
				var list = convent(d.result.list);
				if(type){
					handerObj.triggerHandler('board:asidelistsuc',{list : list,type:type,next : d.result.next});
				}else{
					handerObj.triggerHandler('board:listsuc',{list : list,next : d.result.next,keyword:keyword});
				}
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);		
	}		

	function groupInfo(e,d){
		var deftype = 'group';
		var gid,type = 0,
			recy = false,
			school = 0;
		if(typeof d == 'object'){
			gid = d.gid;
			type = d.type;
			recy = d.recy;
		}else{
			gid = d;
			type = deftype;
		}
		

		var opt = {
			cgi : config.cgi.groupinfo,
			data : {
				groupId : gid
			}
		}
		var success = function(d){
			if(d.err == 0){
				d.result.data.recy = recy;
				d.result.data.id = d.result.data._id;
				d.result.data.ml = conventMembers(d.result.data.members);
				d.result.data.mlist = convent2Members(d.result.data.members);
				d.result.data.rootFolder.id = d.result.data.rootFolder.$id; 
				handerObj.triggerHandler(type+':infosuc',d.result.data);
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);	
	}

	function boardNew(e,d){
		var type = d.type;
		var opt = {
			cgi : config.cgi.boardcreate,
			data : d
		}
		var success = function(d){

			handerObj.triggerHandler('msg:error',d.err);
			if(d.err == 0){
				var data = convent([d.result.data]);
				//if(type){
					handerObj.triggerHandler('group:boardasideaddsuc',data);
				if(!type){
					handerObj.triggerHandler('group:boardaddsuc',data);
				}
				//handerObj.triggerHandler('group:infosuc',d.result.data);
			}else{
				//handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.post(opt,success);		
	}

	function boardDel(e,d){
		var target = d.target;
		var type = d.type;
		var opt = {
			cgi : config.cgi.boarddel,
			data : {
				boardId : d.boardId
			}
		}
		var id = d.boardId;
		var success = function(d){
			if(d.err == 0){
				handerObj.triggerHandler('group:boarddelsuc',{target:target,id:id});
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}	
		request.post(opt,success);			
	}

	var handlers = {
		'board:del' : boardDel,
		'board:new' : boardNew,
		'group:info' : groupInfo,
		'group:edit' : groupEdit,
		'group:board' : board
	}	

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}	
});
define('model.groupprep',['config','helper/request','helper/util','cache'],function(config,request,util,Cache){
	var	handerObj = $(Schhandler);

	function convent(data){
		var list = [];
			plist = [];
		for(var i = 0,l=data.length;i<l;i++){
			var item = data[i];
			item.id = item._id;
			if(item.list){
				var tl = [];
				for(var j =0,m=item.list.length;j<m;j++){
					var obj = item.list[j];
					obj.id = obj._id;
					obj.pid = item.id;
					tl.push(obj);
					plist.push(obj);
				}
				item.list = tl;
			}
			list[item.id] = item;
		}
		return {
			list : list,
			plist : plist
		};
	}

	function fetch(d,data){
		if(!d.pid && !d.grade && !d.tag){
			return d;
		}else{
			var list = [];
			if(d.pid){
				var tl = [];
				list = data[d.pid];
				if(!d.grade && !d.tag){
					data[d.pid].list = tl;
					return data;
				}else{
					
					for(var i=0,l=list.list.length;i<l;i++){
						var item = list.list[i];
						if(item.grade == d.grade || item.tag == d.tag){
							tl.push[item];
						}
					}
					data[d.pid].list = tl;
					return data;
				}
			}else{
				for(var x in data){
					var item = data[x];
					var tl = [];
					for(var i = 0,l=item.list.length;i<l;i++){
						var	obj = item.list[i];
						if(item.grade == d.grade || item.tag == d.tag){
							tl.push[item];
						}							
					}
					data[x].list = tl;
				}
				return data;
			}
		}
	}

	function prepGet(e,d){
		var list = Cache.get('preplist');
		if(list){
			//list = fetch(d,list);
			handerObj.triggerHandler('groupprep:loadsuc',list);
			return;
		}
		var opt = {
			cgi : config.cgi.mpreplist,
			data : {
				fetchChild: true
			}
		}	
		var success = function(d){
			if(d.err == 0){
				var list = convent(d.result.list);
				//var nlist = fetch(d,list);
				handerObj.triggerHandler('groupprep:loadsuc',list);
				handerObj.triggerHandler('cache:set',{key : 'preplist' ,data : list});
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);			
	}

	var handlers = {
		'groupprep:get' : prepGet
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}	
});
define('view.groupprep',['config','helper/view','cache','helper/util','model.groupprep'],function(config,View,Cache,util){
	var	handerObj = $(Schhandler);

	var	stitTarget = $('#sectionTit'),
		tabletitTarget = $("#tableTit"),
		tmpTarget = $('#fileInfoList'),
		groupPrepAsideTarget = $('#groupPrepAside');

	var nowGid = 0,
		action = 0,
		nowKey = '',
		nowFd = 0,
		userList = null,
		nowOrder  = ['createtime',1],
		nowGrade = 0,
		nowTag = 0,
		nowPrep = 0, //当前是否是备课
		nowD = null,
		nextPage = 0
		nowPrep = null;

	function prepAside(){
		var data = {
			name : '备课检查',
			pt : 1
		};
		var view = new View({
			target : groupPrepAsideTarget,
			tplid : 'group.aside',
			data : data,
			after : function(){
				groupPrepAsideTarget.attr('have',1);
			}
		});
		view.createPanel();
	}

	function crTit(){
		var view = new View({
			target : stitTarget,
			tplid : 'prep.group.tit',
			data : {
				list : nowPrep.list,
				tlist : config.tag,
				glist : config.grade,
				key : nowKey,
				fold : 0,
				fdid : nowFd,
				ulist : userList,
				pid : nowPid,
				gid : nowPid,
				tag : nowTag,
				grade : nowGrade,
				uid : nowUid
			}
		});
		view.createPanel();	
	}

	function init(e,d){
		d.prep = 'group';
		util.showNav('dep');
		if(d){
			nowD = d;
			nowGrade = d.grade || 0;
			nowTag = d.tag || 0;
			nowGid = d.gid || 0;
			nowFd = d.fdid || 0;
			nowUid = d.uid || 0;
			nowPid = d.pid || 0;
			if(d.order){
				nowOrder = d.order;
			}
			nowKey = d.key || '';
			//nowPrep = d.prep || 0;
		}

		if(!nowGid){
			tabletitTarget.html('');
		}


		$('.aside-divs').hide();
		if(!groupPrepAsideTarget.attr('have')){
			prepAside();
		}
		groupPrepAsideTarget.show();

		if(!userList){
			handerObj.triggerHandler('nav:getuser',{type:'prep'});
		}else{
			if(!nowUid){
				crTit();
			}
			handerObj.triggerHandler('groupprep:get',{pid:nowPid,grade:nowGrade,tag:nowTag});
		}
		// handerObj.triggerHandler('file:init',d);
		// handerObj.triggerHandler('fold:init',d); 
	};

	function userLoad(e,d){
		userList = Cache.get('alluser2key');
		handerObj.triggerHandler('groupprep:get',{pid:nowPid,grade:nowGrade,tag:nowTag});
	}

	function loadSuc(e,d){
		nowPrep = d;
		crTit();	
		if(nowGid){
			handerObj.triggerHandler('fold:init',nowD);
			if(nowFd){
				handerObj.triggerHandler('file:init',nowD);
			}
			return;
		}		
		
		var plist = d.plist;
		var list = d.list;
		var view = new View({
			target : tmpTarget,
			tplid : 'prep.group.list',
			data : {
				list : plist,
				ul : userList,
				pid : nowPid,
				tag : nowTag,
				grade : nowGrade,
				uid : nowUid				
			}
		});　
		view.createPanel();
		
	}

	var handlers = {
		'groupprep:init' : init,
		'groupprep:loadsuc' : loadSuc,
		'groupprep:userload' : userLoad
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}

});
define('view.group',['config','cache','helper/view','helper/util','model.group','view.groupprep'],function(config,Cache,View,util){
	var	handerObj = $(Schhandler);

	var nowGid = 0,
		myGroups = null,
		myInfo = null,
		nowGroup,
		nowUid = 0,
		nowPage = 0,
		nowData = null,
		nowFd = 0;

	var actTarget = $('#actWinZone'),
		actWin = $('#actWin'),	
		userAsideTarget = $('#userAside'),
		userPrepAsideTarget = $('#userPrepAside'),
		groupAsideTarget = $('#groupAside'),
		groupPrepAsideTarget = $('#groupPrepAside');

	var tmpTarget = $('#boxTableList'),
		stitTarget = $('#sectionTit'),
		titTarget = $("#boxtableTit");		

	function init(e,d){
		nowGid = d.gid;
		nowFd = d.fdid || 0;
		nowUid = d.uid || 0;
		nowData = d;
		if(!myGroups){
			myInfo = Cache.get('myinfo'),
			myGroups = myInfo.group2key;
		}

		nowGroup = myGroups[nowGid];
		if(nowGroup.type === 2){
			util.showNav('dep');
		}else{
			util.showNav('group');
		}

		$("#fileActZone .renamefile").show();
		$("#fileActZone .delfile").show();
		$("#fileActZone .movefile").show();		

		if(nowGroup.isMember){
			$("#btnZone").show();
		}else{
			$("#btnZone").hide();
		}
		handerObj.triggerHandler('group:info',nowGid);
		// if(myGroups[nowGid]){
		// 	handerObj.triggerHandler('group:infosuc',myGroups[nowGid]);
		// }else{
		// 	handerObj.triggerHandler('msg:error',1010);
		// }
	}

	function groupAside(){
		var view = new View({
			target : groupAsideTarget,
			tplid : 'group.aside',
			data : nowGroup,
			handlers : {
				'.group-desc-edit' : {
					'click' : function(e){
						$('#groupEdit').removeClass('hide');
						$("#groupDesc").addClass('hide');
					}
				},
				'.group-desc-save' : {
					'click' : function(e){
						var desc = $('#groupEdit textarea').val();
						handerObj.triggerHandler('group:edit',{
							groupId : nowGid,
							content : desc,
							type : 1
						});
						$('#groupEdit').addClass('hide');
						$("#groupDesc").removeClass('hide');						
					}
				},
				'.group-desc-esc' : {
					'click' : function(e){
						$('#groupEdit').addClass('hide');
						$("#groupDesc").removeClass('hide');
					}
				} 
			}
		});
		view.createPanel();
	}

	function showAside(d){

		if(!myGroups){
			myInfo = Cache.get('myinfo'),
			myGroups = myInfo.group2key;
		}
		nowGroup = myGroups[d.id];

		var data = {
			gid : d.id,
			fdid : d.rootFolder.id,
			info : d
		}
		if(!nowData){
			nowData = {};
		}
		nowData.info = d;
		if((nowFd == 0 || !nowFd) && d.rootFolder){
			nowData.fdid = d.rootFolder.id || d.rootFolder.$id;
		}
		nowData.rootfdid = d.rootFolder.id || d.rootFolder.$id;

		$('#aside .aside-divs').hide();	
		
		groupAsideTarget.show();
		groupAside();

		if(!d.pt){
			handerObj.triggerHandler('group:board',{
				groupId : d.id,
				pageNum : 10,
				order : '{crateTime:-1}',
				page : 0,
				type : 1
			});
		}			
	}

	function info(e,d){
		var data = {
			gid : nowGid,
			fdid : nowFd,
			info : d
		}
		if(myGroups[nowGid]){
			d.isMember = myGroups[nowGid].isMember;
		}
		if(nowUid){
			nowData.uid = nowUid;
		}
		if(d.recy){
			showAside(d);
			return;
		}
		nowData.info = d;

		if((nowFd == 0 || !nowFd) && d.rootFolder){
			nowData.fdid = d.rootFolder.id || d.rootFolder.$id;
		}
		nowData.rootfdid = d.rootFolder.id || d.rootFolder.$id;
		nowData.used = nowData.info.used;
		nowData.size = nowData.info.size;

		$('#aside .aside-divs').hide();
		switch(d.type){
			case 0:
				break;
			case 1:
			case 2:
				groupAsideTarget.show();
				groupAside();
				if(!d.pt){
					handerObj.triggerHandler('group:board',{
						groupId : nowGid,
						pageNum : 10,
						order : '{crateTime:-1}',
						page : 0,
						type : 1
					});
				}
				break;
			case 3:
				break;
		}
		if(d.pt){
			nowData.prep = 'group';
			handerObj.triggerHandler('groupprep:init',nowData);
		}else{
	        //handerObj.triggerHandler('file:init',nowData);
	        handerObj.triggerHandler('fold:init',nowData); 
	        handerObj.triggerHandler('upload:param',nowData);
    	}
    	//延时2秒加载小组的详细资料拿用户id
    	
    	setTimeout(function(){

    	},2000);
	}

	function newBoard(){
		var view = new View({
			target : actTarget,
			tplid : 'board.new',
			after : function(){
				$("#actWin").modal('show');
			},
			handlers : {
				'.btn-post' : {
					'click' : function(){
						var desc = $.trim(actTarget.find('textarea').val());
						if(desc != ''){
							handerObj.triggerHandler('board:new',{
								groupId : nowGid,
								content : desc,
								type : 1
							});
						}
					}
				}
			}
		});
		view.createPanel();
	}

	//侧边栏
	function boardAsideSuc(e,d){
		// $('#groupBoard').data('list',d.list);
		var target,
			tpl;
			target = $('#groupBoard');
			tplid = 'group.board';
		var view = new View({
			target : target,
			tplid : tplid,
			data : {
				list : d.list,
				auth : nowGroup.auth
			},
			handlers : {
				'.group-post-board' : {
					'click' : function(){
						newBoard();
					}
				},
				'.show-all-board' : {
					'click' : function(){
						handerObj.triggerHandler('board:init',{gid : nowGid});
					}	
				},
				'.delete-board' : {
					'click' : function(){
						var id = $(this).attr('data-id');
						handerObj.triggerHandler('board:del',{
							boardId : id,
							target : target
						});						
					}
				}				
			}
		});
		view.createPanel();
	}

	function updateGroup(d){
		myInfo.group2key[d.id] = d;
		handerObj.triggerHandler('cache:set',{key: 'myinfo',data: myInfo});
	}

	function modifySuc(e,d){
		updateGroup(d);
		var info = d,
			desc = d.content;
		if(info.content == ''){
			desc = '暂无公告'
		}
		$("#groupDesc p").html(util.transStr(desc));
	}

	function boardasideaddSuc(e,d){
		$('#groupBoard .board-empty').remove();
		d.auth = nowGroup.auth;
		var view = new View({
			target : $('#groupBoard').find('ul'),
			tplid : 'group.boardone',
			data : d
		});
		view.beginPanel();		
	}

	function boardInit(e,d){

		var view = new View({
			target : actTarget,
			tplid : 'board.all',
			after : function(){
				$("#actWin").modal('show');
				handerObj.triggerHandler('group:board',{
					groupId : nowGid,
					pageNum : 10,
					page : 0
				});	

				actTarget.find('.board-list').on('scroll',function(){
	                var scrollTop = $(this).scrollTop();
	                var scrollHeight = $(this).get(0).scrollHeight;
	                var height = $(this).height();
	                
	                if(height + scrollTop > scrollHeight - 8){
	                	actTarget.find('.page-zone').click();
	                }
				});

				actTarget.bind('click',function(e){
					var target = $(e.target),
						cmd = target.attr('cmd');
					if(cmd == 'del'){
						var id = target.attr('data-id');
						handerObj.triggerHandler('board:del',{
							boardId : id,
							target : target
						});
					}
				})
			},
			handlers : {
				'.btn-post' : {
					'click' : function(){
						var desc = actTarget.find('.board-input').val();
						if(desc != ''){
							handerObj.triggerHandler('board:new',{
								groupId : nowGid,
								content : desc
							});
						}						
					}
				},
				'.search-btn' : {
					'click' : function(){
						var target = actTarget.find('.search-input'),
							key = $.trim(target.val()),
							def = target.attr('data-def');
						//if(key != def){
							if(key == def){
								key = '';
							}
							handerObj.triggerHandler('group:board',{
								groupId : nowGid,
								keyword : key,
								pageNum : 10,
								page : 0
							});
						//}

					}
				},
				'.search-input' : {
					'focus' : function(){
						var target = $(this),
							def = target.attr('data-def');
						if(target.val() == def){
							target.val('');
						}
					},
					'blur' : function(){
						var target = $(this),
							def = target.attr('data-def');
						if(target.val() == ''){
							target.val(def);
						}	
					},
					'keyup' : function(){
						if(e.keyCode == 13){
							actTarget.find('.search-btn').click();
						}						
					}
				},
				'.page-zone' : {
					'click' : function(){
						var target = $(this),
							next = target.attr('data-next'),
							keyword = target.attr('data-key');

						if(next){
							var obj = {
								groupId : nowGid,
								pageNum : 10,
								page : next
							}
							if(keyword){
								obj.keyword = keyword;
							}
							handerObj.triggerHandler('group:board',obj);
						}
					}
				}
			}
		});
		view.createPanel();
	}

	function boardaddSuc(e,d){

		var view = new View({
			target : $("#boardList"),
			tplid : 'board.list',
			data : {
				list : [d],
				auth : nowGroup.auth
			}
		});
		view.beginPanel();	
	}

	function boardlistSuc(e,d){
		// if(!d.list.length){
		// 	//return;
		// }
		
		var view = new View({
			target : $("#boardList"),
			tplid : 'board.list',
			after : function(){
				if(d.keyword && d.next){
					actTarget.find('.page-zone').text('更多文件').attr('data-key',d.keyword);
				}
			},
			handlers : {
				'.delete-board' : {
					'click' : function(){
						var id = $(this).attr('data-id');
						handerObj.triggerHandler('board:del',{
							boardId : id,
							target : target
						});						
					}
				}
			},
			data : {
				list : d.list,
				auth : nowGroup.auth
			}
		});
		var oldkey = actTarget.find('.page-zone').attr('data-key');
		if(oldkey == d.keyword){
			view.appendPanel();
		}else{
			view.createPanel();			
		}
		
	}

	function delSuc(e,d){
		var target = d.target;
		$('.boardmsg'+d.id).remove();
		if($('.boardmsg').length===0){
			$('.group-board-list').html('<li class="board-empty">暂无留言</li>');
		}
		//target.parent('li').remove();
	}

	var handlers = {
		'group:boarddelsuc' : delSuc,
		'group:boardaddsuc' : boardaddSuc,
		'board:init' : boardInit,
		'board:asidelistsuc' : boardAsideSuc,
		'group:boardasideaddsuc' : boardasideaddSuc,
		'group:init' : init,
		'group:modifySuc' : modifySuc,
		'group:infosuc' : info,
		'board:listsuc' : boardlistSuc
	}	

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}
});
define('model.mail',['config','helper/request','helper/util'],function(config,request,util){

	var	handerObj = $(Schhandler);

	function convent(data){
		var list = [];
		for(var i=0,l=data.length;i<l;i++){
			var item = data[i];
			list.push({
				id : item._id,
				rid : item.resource._id,
				tname : item.toUser.nick,
				fname : item.fromUser.nick,
				fid : item.fid,
				name : item.name,
				content : item.content,
				time : util.time(item.createTime),
				save : item.save,
				fuid : item.fromUser._id,
				tuid : item.toUser._Id,
				type : item.resource.type,
				size : util.getSize(item.resource.size || 0)
			})
		}
		return list;
	}

	function conventType(data){
		var list = [];
		for(var i=0,l=data.length;i<l;i++){
			var item = data[i];
			list.push({
				id: item._id,
				fid : item.resource._id,
				name : item.name,
				type : item.type,
				size : util.getSize(item.size || 0),
				time : util.time(item.createTime),
				gname : item.group.name,
				fname : item.folder,
				content : item.content
			});
		}
		return list;
	}

	function search(e,d){
		var cate = d.cate;
		if(d.cate == 0){
			d.cate = parseInt(1);
			var opt = {
				cgi : config.cgi.filequery,
				data : d
			}
		}else{
			var opt = {
				cgi : config.cgi.msgsearch,
				data : d
			}
		}	
		var success = function(d){
			if(d.err == 0){
				if(cate == 0){
					handerObj.triggerHandler('mail:load',{
						list : conventType(d.result.list),
						ul : d.result.ul,
						next : d.result.next,
						total : d.result.total
					});
				}else{
					handerObj.triggerHandler('mail:load',{
						list : convent(d.result.list),
						ul : d.result.ul,
						next : d.result.next,
						total : d.result.total
					});					
				}

			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);			
	}

	function save(e,d){
		var obj = {
			messageId : d
		}
		var opt = {
			cgi : config.cgi.filesave,
			data : obj
		}
		var success = function(d){
			handerObj.triggerHandler('msg:error',d.err);
			if(d.err == 0){
				handerObj.triggerHandler('mail:savesuc',obj.messageId);
			}else{
				
			}
		}
		request.post(opt,success);					
	}

	var handlers = {
		'mail:search' : search,
		'mail:save' : save
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}		
});


define('view.mail',['config','helper/view','model.mail'],function(config,View){
	var	handerObj = $(Schhandler);

	var nowType = 0,
		action = 0,//活动状态
		nextPage = 0,
		nowTotal = 0,
		nowCate = 0,//我的贡献 ,1 收件 2 发件
		nowOrder  = ['createTime',-1],
		nowOds = '',
		nowKey = '';

	var tmpTarget = $('#boxTableList'),
		stitTarget = $('#sectionTit'),
		titTarget = $("#boxtableTit");		

	function crTit(obj){
		var view = new View({
			target : stitTarget,
			tplid : 'mail.tit',
			data : {
				filetype : config.filetype,
				cate : nowCate,
				type : nowType,
				key : nowKey
			}
		});
		view.createPanel();
	}

	function init(e,d){
		tmpTarget.html('');

		nextPage = 0;
		nowTotal = 0;
		nowCate = d.cate;
		nowType = d.type;
		if(d.order){
			nowOrder = d.order;
		}
		if(nowType == 1){
			$('#newMailnum').text(0);
			$('#allNums').text(0);
		}
		nowOds = '{'+nowOrder[0]+':'+nowOrder[1]+'}';
		nowKey = d.key || '';
		crTit();

		var view = new View({
			target : titTarget,
			tplid : 'coll.table.tit',
			data : {
				order : nowOrder,
				name : 'mailbox',
				cate : nowCate,
				type : nowType
			}			
		});

		view.createPanel();

		handerObj.triggerHandler('mail:search',{
			keyword : nowKey,
			page:nextPage,
			pageNum : config.pagenum,
			type : nowType,
			cate : nowCate,
			order : nowOds
		});			

	}

	function mailGet(e,d){

	}

	function load(e,d){

		//nextPage = d.next;
		nowTotal = d.total;

		if($(".file").length < nowTotal){
			nextPage += 1;
		}else{
			nextPage = 0;
		}
		var view = new View({
			target : tmpTarget,
			tplid : 'mail.list',
			data : {
				list : d.list,
				ul : d.ul,
				page : nextPage,
				type : nowType,
				cate : nowCate,
				key : nowKey,
				ods : nowOds,
				filetype : config.filetype
			}
		});
		
		view.appendPanel();

		var pview = new View({
			target : $('#boxpageZone'),
			tplid : 'page',
			data : {
				next : nextPage
			}
		});

		pview.createPanel();
	}

	function modelChange(e,d){
		if(d == 'mail'){
			action = 1;
		}else{
			action = 0;
		}
	}

	function pageNext(e,d){
		if(!action || !nextPage){
			return;
		}
		handerObj.triggerHandler('mail:search',{
			keyword : nowKey,
			page:nextPage,
			pageNum : config.pagenum,
			cate : nowCate,
			type : nowType,
			order : nowOds
		});			
	}

	function saveSuc(e,d){
		$('.mailsave'+d).remove();
	}

	var handlers = {
		'page:next' : pageNext,
		'model:change' : modelChange,
		'mail:init' : init,
		'mail:get' : mailGet,
		'mail:load' : load,
		'mail:savesuc' : saveSuc
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}	
});
define('model.coll',['config','helper/request','helper/util'],function(config,request,util){
	
	var	handerObj = $(Schhandler);

	function convent(data){
		var list = [];
		for(var i=0,l=data.length;i<l;i++){
			var item = data[i];
			list.push({
				id : item._id,
				name : item.name,
				fileid : item.fromFile.$id,
				fid : item.resource.$id,
				coll : item.coll,
				remark : item.remark,
				time : util.time(item.createTime),
				size : util.getSize(item.size),
				type : item.type
			})
		}
		return list;
	}

	function search(e,d){
		var opt = {
			cgi : config.cgi.favsearch,
			data : d
		}	
		var success = function(d){
			if(d.err == 0){
				handerObj.triggerHandler('coll:load',{
					list : convent(d.result.list),
					next : d.result.next
				});
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);			
	}

	var handlers = {
		'coll:serach' : search
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}	
});
define('view.coll',['config','helper/view','model.coll'],function(config,View){
	var	handerObj = $(Schhandler);

	var nextPage = 0,
		action = 0,
		nowOrder  = ['createTime',-1], 
		nowType = 0;
		nowOds = '',
		nowKey = '';

	var tmpTarget = $('#boxTableList'),
		stitTarget = $('#sectionTit'),
		titTarget = $("#boxtableTit");

	function crTit(obj){
		var view = new View({
			target : stitTarget,
			tplid : 'coll.tit',
			data : {
				filetype : config.filetype,
				type : nowType,
				key : nowKey
			}
		});
		view.createPanel();
	}

	function init(e,d){
		nextPage = 0;
		action = 1;
		nowType = d.type;
		tmpTarget.html('');
		crTit();

		if(d.order){
			nowOrder = d.order;
		}
		nowOds = '{'+nowOrder[0]+':'+nowOrder[1]+'}';
		nowKey = d.key || '';

		var view = new View({
			target : titTarget,
			tplid : 'coll.table.tit',
			data : {
				order : nowOrder,
				name : 'mycoll',
				cate : 1
			}			
		});
		view.createPanel();

		handerObj.triggerHandler('coll:serach',{
			keyword : nowKey,
			page:nextPage,
			type:nowType,
			pageNum : config.pagenum,
			order : nowOds
		});			
	}

	function load(e,d){
		nextPage = d.next;
		var view = new View({
			target : tmpTarget,
			tplid : 'coll.list',
			data : {
				list : d.list,
				page : nextPage,
				ods : nowOds,
				key : nowKey,
				filetype : config.filetype
			}
		});

		view.appendPanel();

		var pview = new View({
			target : $('#boxpageZone'),
			tplid : 'page',
			data : {
				next : d.next
			}
		});

		pview.createPanel();		
	}

	function modelChange(e,d){
		if(d == 'coll'){
			action = 1;
		}else{
			action = 0;
		}
	}

	function pageNext(e,d){
		if(!action || !nextPage){
			return;
		}
		handerObj.triggerHandler('coll:serach',{
			keyword : nowKey,
			page:nextPage,
			type:nowType,
			pageNum : config.pagenum,
			order : nowOds
		});		
	}

	var handlers = {
		'page:next' : pageNext,
		'model:change' : modelChange,
		'coll:init' : init,
		'coll:load' : load
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}			

});
define('view.prep',['config','helper/view','cache'],function(config,View,Cache){
	var	handerObj = $(Schhandler);

	var nowGid = 0,
		nowFd = 0,
		nowPage = 0;
		action = 0,
		prepLength = 0,
		prepList = null,
		prepKey = null;

	//userPrepAside

	function init(e,d){

		if(!prepList){
			var myinfo = Cache.get('myinfo');
			prepLength = myinfo.prep.length;
			prepList = myinfo.prep;
			prepKey = myinfo.prep2key;
		}

		if(!d.gid){
			nowGid = prepList[0].id;
			nowFd = prepList[0].rootFolder.id;
		}else{
			nowGid = d.gid;
			nowFd = d.fdid;
		}
		if(!d.fdid){
			nowFd = prepKey[nowGid].rootFolder.id;
		}

		var data = {
			gid : nowGid,
			fdid : nowFd,
			info : prepKey[nowGid],
			order : d.order,
			key : d.key,
			prep : 'my'
		}
        //handerObj.triggerHandler('file:init',data);
        handerObj.triggerHandler('fold:init',data); 
        handerObj.triggerHandler('upload:param',data);		

		$('#aside .aside-divs').hide();
		var list = {};
		var plength = 0;
		for(var i in prepList){
			var item = prepList[i];
			if(item.parent){
				if(!list[item.parent._id]){
					list[item.parent._id] = {
						name : item.parent.name,
						child : []
					}
				}
				if(!list[item.parent._id].child){
					list[item.parent._id].child = [];
				}
				list[item.parent._id].child.push(item);
				plength++;
			}else{
				list[item.id] = item;
			}
		}
		console.log(plength);
		var view = new View({
			target : $('#userPrepAside'),
			tplid : 'myprep.list',
			after : function(){
				$('#userPrepAside').show();
			},
			data : { 
				list : list,
				plength : plength,
				length : prepLength
			}
		})
		view.createPanel();
	}

	var handlers = {
		'prep:init' : init
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}
});
define('model.recy',['config','helper/request','helper/util'],function(config,request,util){
	var	handerObj = $(Schhandler);

	function convent(data){
		var list = [];
		for(var i=0,l=data.length;i<l;i++){
			var item = data[i];
			list.push({
				id : item._id,
				fid : item.fid,
				name : item.name,
				mark : item.mark,
				size : util.getSize(item.size),
				osize : item.size,
				type : item.type,
				src : item.src || 0,
				nick : item.creator.nick,				
				time : util.time(item.createTime),
				coll : item.coll
			})
		}
		return list;
	}

	function search(e,d){
		var opt = {
			cgi : config.cgi.recsearch,
			data : d
		}	
		var success = function(d){
			if(d.err == 0){
				handerObj.triggerHandler('recy:load',{
					list : convent(d.result.list),
					total : d.result.total
				});
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}

		request.get(opt,success);			
	}

	var handlers = {
		'recy:serach' : search
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}	
});
define('view.recy',['config','helper/view','cache','model.recy'],function(config,View,Cache){

	var	handerObj = $(Schhandler);

	var nextPage = 0,
		action = 0,
		nowGid = 0,
		nowOrder  = ['createTime',-1],
		nowOds = '',
		nowType = 0,
		nowSchool = 0,
		nowKey = '';	

	var tmpTarget = $('#boxTableList'),
		stitTarget = $('#sectionTit'),
		titTarget = $("#boxtableTit");

	function crTit(obj){
		var view = new View({
			target : stitTarget,
			tplid : 'recy.tit',
			data : {
				filetype : config.filetype,
				gid : nowGid,
				school : nowSchool,
				type : nowType,
				key : nowKey
			}
		});
		view.createPanel();
	}

	function init(e,d){
		var myInfo = Cache.get('myinfo');
		action = 1;
		tmpTarget.html('');
		

		nextPage = 0;

		if(d.order){
			nowOrder = d.order;
		}
		if(d.gid){
			nowGid = d.gid;
		}
		nowSchool = d.school || 0;
		nowType = d.type;
		nowOds = '{'+nowOrder[0]+':'+nowOrder[1]+'}';
		nowKey = d.key || '';

		var name = 'myrecy';
		if(nowSchool || nowGid){
			name = 'recy';
		}
		var view = new View({
			target : titTarget,
			tplid : 'coll.table.tit',
			data : {
				order : nowOds,
				name : name,
				cate : 2,
				type : nowType,
				gid : nowGid,
				school : nowSchool		
			}	
		});
		view.createPanel();
		crTit();
		var obj = {
			keyword : nowKey,
			page:nextPage,
			type : nowType,
			pageNum : config.pagenum,
			order : nowOds
		}
		if(nowGid && !nowSchool){
			obj.groupId = nowGid;

			handerObj.triggerHandler('group:info',{
				gid : nowGid,
				type : 'group',
				recy : true
			});
		}

		handerObj.triggerHandler('recy:serach',obj);			
	}

	function load(e,d){
		//nextPage = d.next;
		if($(".file").length < d.total){
			nextPage += 1;
		}else{
			nextPage = 0;
		}

		var view = new View({
			target : tmpTarget,
			tplid : 'recy.list',
			data : {
				gid : nowGid,
				list : d.list,
				filetype : config.filetype
			}
		});
		
		view.appendPanel();

		var pview = new View({
			target : $('#boxpageZone'),
			tplid : 'page',
			data : {
				next : nextPage
			}
		});

		pview.createPanel();		
	}

	function modelChange(e,d){
		if(d == 'recy'){
			action = 1;
		}else{
			action = 0;
		}
	}

	function pageNext(e,d){
		if(!action || !nextPage){
			return;
		}
		var obj = {
			keyword : nowKey,
			page:nextPage,
			type:nowType,
			pageNum : config.pagenum,
			order : nowOds
		};
		if(nowGid){
			obj.groupId = nowGid
		}
		handerObj.triggerHandler('recy:serach',obj);			
	}

	var handlers = {
		'page:next' : pageNext,
		'model:change' : modelChange,
		'recy:init' : init,
		'recy:load' : load
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}			


});
define('model.share',['config','helper/request','helper/util'],function(config,request,util){
	var	handerObj = $(Schhandler);
});
define('view.share',['config','helper/view','model.share'],function(config,View){
	var	handerObj = $(Schhandler);
});
define('model.school',['config','helper/request','helper/util'],function(config,request,util){
	var	handerObj = $(Schhandler);

	function approw(e,d){
		var opt = {
			method : 'POST',
			cgi : config.cgi.mappfile,
			data : d
		}
		var td = d;
		var success = function(d){
			handerObj.triggerHandler('msg:error',d.err);
			if(d.err == 0){
				if(td.fdid){
					var obj = {
						targetId : td.fdid,
						fileId : [td.fileId],
						groupId : td.gid
					}
					handerObj.triggerHandler('file:moveto',obj);
				}
				handerObj.triggerHandler('school:apvsuc',td);
			}
			if(!td.fdid){
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.post(opt,success);
	}

	var handlers = {
		'school:approv' : approw
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}	
});
define('view.school',['config','helper/view','cache','helper/util','model.school'],function(config,View,Cache,util){
	var	handerObj = $(Schhandler);

	var nowGid = 0,
		nowFd = 0,
		nowOrder  = ['createTime',-1],
		nowKey = '',
		nowUid = 0,
		nowType = 0,
		rootFd = 0;

	var actTarget = $('#actWinZone'),
		userAsideTarget = $('#userAside'),
		userPrepAsideTarget = $('#userPrepAside'),
		groupAsideTarget = $('#groupAside'),
		groupPrepAsideTarget = $('#groupPrepAside');	

	function init(e,d){
		$('#userAside').hide();
		$("#groupAside").show();

		util.showNav('school');
		userAsideTarget.hide();
		userPrepAsideTarget.hide();
		groupPrepAsideTarget.hide();

		var myinfo = Cache.get('myinfo');
		var school = myinfo.school;

		$("#fileActZone .sharefile").hide();
		$("#fileActZone .copyfile").hide();

		if(!school.auth){
			$('#btnZone').hide();
			$("#fileActZone").addClass('hide');
			$('.tool-zone').removeClass('hide');
			$("#fileActZone .renamefile").hide();
			$("#fileActZone .delfile").hide();
			$("#fileActZone .movefile").hide();
		}else{
			$('.tool-zone').removeClass('hide');
			$("#fileActZone").addClass('hide');
		}
		handerObj.triggerHandler('bind:school',{
			school : 1,
			auth : school.auth
		});
		nowGid = school.id;
		nowFd = school.rootFolder.id;
		nowUid = d.uid;

		var view = new View({
			target : $("#groupAside"),
			tplid : 'school.aside',
			data : {
				auth : school.auth,
				type : nowType
			},
			handlers : {
				'h3' : {
					'click' : function(e){
						$("#groupAside h3").removeClass('selected');
						var cmd = $(e.target).attr('cmd');
						//console.log($(e.target).hasClass('selected'),$(e.target).attr('class'));
						if(!$(e.target).hasClass('selected')){
							$(e.target).addClass('selected');
							if(cmd=='manage'){
								d.auth = school.auth;
								nowType = 1;	
							}else{
								d.auth = 0;
								nowType = 0
							}
							d.school = 1;
							if(cmd==='recy'){
								//#recy=1&gid=<%+id%>
								//handerObj.triggerHandler('recy:init',d);	
								window.location.hash = '#recy=1&gid='+d.gid+'&school=1';
							}else{
								handerObj.triggerHandler('fold:init',d);	
							}
					        //handerObj.triggerHandler('file:init',d);
						}

					}
				}
			}		
		});
		view.createPanel();

		if(d){
			if(d.order){
				nowOrder = d.order;
			}
			nowOds = '{'+nowOrder[0]+':'+nowOrder[1]+'}';
			nowKey = d.key || '';
		}		

		d.gid = nowGid;
		if(d.fdid){
			nowFd = d.fdid;
		}
		d.info = school;

		d.school = 1;
		d.auth = nowType;

		handerObj.triggerHandler('group:info',{
			gid : nowGid,
			type : 'school'	
		});
        //handerObj.triggerHandler('file:init',d);
        handerObj.triggerHandler('upload:param',d);		
	}

	function infoSuc(e,d){
		var obj = {
			auth : nowType,
			school : 1,
			gid : nowGid,
			fdid : nowFd,
			uid : nowUid,
			order : nowOrder,
			info : d
		}
		handerObj.triggerHandler('fold:init',obj); 
	}

	function showApv(e,d){
		var fold = Cache.get('rootFolder'+nowGid);

		var view = new View({
			target : actTarget,
			tplid : 'file.apv',
			data : {
				name : d.name,
				fold : fold,
				gid : nowGid,
				status : d.status
			},
			after : function(){
				$("#actWin").modal('show');
			},
			handlers : {
				'.btn-post' : {
					'click' : function(){
						var obj = {
							fileId : d.id,
							validateText : actTarget.find('.val-text').val(),
							validateStatus : d.status
						}
						if($('#schoolFoldResultUl input:checked').length){
							obj.fdid = $('#schoolFoldResultUl input:checked').val();
							obj.gid = nowGid;
						}
						handerObj.triggerHandler('school:approv',obj);
					}
				},
				'.plus' : {
					'click' : function(){
						var t = $(this),
							id = t.attr('data-id'),
							load = t.attr('data-load'),
							gid = t.attr('data-gid');
						var p = t.parent('li');
						if(p.find('ul').length > 0){
							if(t.hasClass("minus")){
								t.removeClass('minus');
								p.find('ul').hide();
							}else{
								t.addClass('minus');
								p.find('ul').show();
							}
							return;
						}
						if(load){
							return;
						}
						t.addClass('minus').attr('data-load',1);
						var obj = {
							folderId : id,
							target : p,
							groupId : gid,
							tplid : 'share.fold.li',
							type : 1
						};
						handerObj.triggerHandler('fold:get',obj);						
					}
				}
			}
		});
		view.createPanel();

		var validateText;
		var validateStatus;
	}

	function apvSuc(e,d){
		$('.file'+d.fileId).remove();
	}

	var handlers = {
		'school:init' : init,
		'school:infosuc' : infoSuc,
		'school:showapv' : showApv,
		'school:apvsuc' : apvSuc
	};

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}	

});
define('view.log',['config','cache','helper/view','helper/request','helper/util'],function(config,Cache,View,request,Util){
	var	handerObj = $(Schhandler),
		pageNum = config.pagenum,
		isInit = false;
		nowPage = 0,
		nowDate = new Date().getTime(),
		nowGid = 0,
		isLoad = false,
		logType = 0,
		logSt = 0,
		logEt = 0,
		nowType = -1;
		nowKey = '',
		myInfo = null;

	function loadLog(obj){
		if(nowKey != ''){
			obj.fileName = nowKey;
		}
		if(nowType>=0){
			obj.fromGroupType = nowType;
		}
		var opt = {
			cgi : config.cgi.logsearch,
			data : obj
		}		
		var success = function(data){
			isLoad = false;
			if(data.err==0){
				var view = new View({
					target : $('#logList'),
					tplid : 'log.list',
					data : {
						filetype : config.filetype,
						size : Util.getSize,
						list : data.result.list,
						logType : Util.logType,
						time : Util.time
					}
				});
				view.appendPanel();
				if($('#logList tr').length < data.result.total){
					nowPage++;
					$('.next-log-page').attr('data-next',nowPage).text('点击加载更多');
				}else{
					$('.next-log-page').removeAttr('data-next').text('已经全部加载完了');
				}
			}else{
				handerObj.triggerHandler('msg:error',data.err);
			}
		}
		request.get(opt,success);
	}

	function init(e,d){
		nowPage = 0;
		myInfo = Cache.get('myinfo');
		$('#logType').attr('data-type',0).text('全部');
		var obj = {
			page : 0,
			pageNum : pageNum
		}	
		if(d.gid){
			var gid = d.gid;
			nowGid = gid;
			obj.fromGroupId = gid;
			if(!myInfo.auth == 15){
				if((myInfo.group2key[gid] && !myInfo.group2key[gid].auth) && (myInfo.dep2key[gid] && !myInfo.dep2key[gid].auth)){
					obj.fromUserId = myInfo.id;
				}			
			}
		}else{
			nowGid = 0;
			obj.fromUserId = myInfo.id;
		}
		$('#logList').html('');
		if(!isLoad){
			isLoad = true;
			loadLog(obj);
		}
		if(!isInit){
			$('#logBlock .dropdown-menu li').bind('click',function(){
				$('#logType').attr('data-type',$(this).attr('data-type')).text($(this).text());
					var obj = {
						page : 0,
						pageNum : pageNum
					};		
					if(parseInt($(this).attr('data-type'))){
						obj.type = [$(this).attr('data-type')];
						logType = $(this).attr('data-type');
					}

					$('#logList').html('');
					$('.next-log-page').removeAttr('data-next');
					if(nowGid){
						obj.fromGroupId = nowGid;
					}else{
						obj.fromUserId = myInfo.id;
					}
					nowPage = 0;
					if(!isLoad){
						isLoad = true;
						loadLog(obj);
					}
			});
			
			$('.btn-log-search').bind('click',function(){
				nowKey = $('#logSearchKey').val();
				nowType = $('#logGroupType').val();
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
				if(type || st || et || nowKey != '' || nowType >= 0){
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
						et += 3600*24*1000;
						obj.endTime = et;
						logEt = et;
					}
					if(nowGid){
						obj.fromGroupId = nowGid;
					}else{
						obj.fromUserId = myInfo.id;
					}
					nowPage = 0;
					if(!isLoad){
						isLoad = true;
						loadLog(obj);
					}
				}else{
					return;
				}
			});

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
			$('.next-log-page').bind('click',function(){
				var t = $(this),
					next = t.attr('data-next');
				if(next){
					var obj = {
						page : next,
						pageNum : pageNum
					}	
					if(logType){
						obj.type = [logType];
					}
					if(logSt){
						obj.startTime = logSt;
					}
					if(logEt){
						obj.endTime = logEt;
					}					
					if(nowGid){
						obj.fromGroupId = nowGid;
					}else{
						obj.fromUserId = myInfo.id;
					}	
					if(!isLoad){
						isLoad = true;
						loadLog(obj);
					}				
					// handerObj.triggerHandler('manage:log',{
					// 	page : nowPage,
					// 	pageNum : pageNum
					// });
				}				
			});
		}

	}

	var handlers = {
		'log:init' : init
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}			
});
define('view.data',['config','cache','helper/view','helper/request','helper/util'],function(config,Cache,View,request,Util){
	var	handerObj = $(Schhandler),
		pageNum = config.pagenum,
		isInit = false;
		nowPage = 0,
		myInfo = null;

	function showData(data){
				var list = [],
					clist = [];
				var filetype = config.filetype;
		if(data.totalCount){
			for(var i in data.list){
				var item = data.list[i];
				list.push([filetype[item.type],item.size,item.count]);
				clist.push([filetype[item.type],item.count]);
			};
			var plot2 = jQuery.jqplot ('dataPre', [list],{
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
		}else{
			$('#dataPre').html('暂无文件');
		}
		if(data.totalSize){
			var plot3 = jQuery.jqplot ('dataPre1', [clist],{
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
			data.filetype = config.filetype;
			data.getSize = Util.getSize;
			var view = new View({
				target : $('#dataTable'),
				tplid : 'data.table',
				data : data,					
			});
			view.createPanel();
		}else{
			$('#dataPre1').html('暂无文件');
		}
	}

	function loadData(obj){
		//汇总
			var opt = {
				cgi : config.cgi.filestatus,
				data : {
					folderId : obj
				}
			}		
			var success = function(data){
				if(data.err==0){
					showData(data.result);
					//handerObj.triggerHandler('manage:staticload', conventStatic(data.result));
				}else{
					handerObj.triggerHandler('msg:error',data.err);
				}
			}
			request.get(opt,success);		
	}

	function init(e,d){
		$('#dataTable').html('');
		$('#dataPre1').html('');
		$('#dataPre').html('');
		myInfo = Cache.get('myinfo');
		var fdid = myInfo.rootFolder.id;
		if(d.fdid){
			fdid = d.fdid;
		}
		loadData(fdid);
	}

	var handlers = {
		'data:init' : init
	}

	for(var i in handlers){
		handerObj.bind(i,handlers[i]);
	}			
});
define('bind',['config'],function(config){

	var	handerObj = $(Schhandler);
	var searchTarget = $('#searchKey');
	var loading = 0,
		nowFd = 0,   //当前文件夹id
		nowGid = 0,  //当前小组id
		nowSchool = 0,
		isMember = 0,
		nowAuth = 0,
		nowPage = 'user';

    $("#newFolds").validate({
            rules:{
                    foldname : {
                            required : true,
                            maxlength : 120,
                            minlength : 2
                    } 
            },
            messages:{
                    foldname : {
                            required : '请输入名称',
                            maxlength : '名称最长120个字',
                            minlength : '名称至少需要2个字'
                    }
            },
            submitHandler : function(form) { 
			 	var value = $('#foldname').val();
			 	var isopen = 0;
			 	var isread = 0;
			 	if($('#newFold .check-open:checked').length > 0){
			 		isopen = 1;
			 	}
			 	if($('#newFold .check-read:checked').length > 0){
			 		isread = $('#newFold .check-read:checked').val();
			 	}

			 	var obj = {
			 		name : value,
			 		isOpen : isopen,
			 		isReadonly : isread
			 	}
			 	handerObj.triggerHandler('fold:create',obj);  
			 	$("#newFold .close").click();      	
                return false;
            }
    });		


	/***********************************/
	$('#newFold .check-open').bind('click',function(){
		if($(this).prop('checked')){
			$('#newFold .read-fold').removeClass('hide');
		}else{
			$('#newFold .read-fold').addClass('hide');
		}
	})

	//收藏文件
	function coll(id,target){
		if(typeof id != 'object'){
			id = [id];
			target = [target];
		}
		handerObj.triggerHandler('file:tocoll',{fileId:id,target:target});

	}
	//取消收藏文件
	function uncoll(id,favid,target){
		if(typeof id != 'object'){
			id = [id];
			favid = [favid];
			target = [target];
		}
		handerObj.triggerHandler('file:touncoll',{id:id,favId:favid,target:target});
	}

	//下载文件
	function down(id){

	}

	//分享文件
	function shareFile(type,obj){
		//单个文件
		if(obj){
			handerObj.triggerHandler('file:share',{target:type,fl: [obj] });
		//批量
		}else{
			if($('.table-files .fclick:checked').length>0){
				var fl  = [];
				$('.table-files .fclick:checked').each(function(){
					var id = $(this).val(),
						name = $('.fdname'+id).text();
					fl.push({
						id : id,
						name : name
					})
				})

				handerObj.triggerHandler('file:share',{target:type,fl:fl});
			}
			
		}
	}

	//复制文件到目录
	function moveFile(){
			if($('.table-files .fclick:checked').length>0){
				var fl  = [];
				$('.table-files .fclick:checked').each(function(){
					var id = $(this).val(),
						fid = $(this).attr('data-fid'),
						name = $('.fdname'+id).text();
					fl.push({
						id : id,
						fid : fid,
						name : name
					})
				})

				handerObj.triggerHandler('file:move',{fl:fl});
			}
	}

	//移动文件到备课
	function copyFile(){
			if($('.table-files .fclick:checked').length>0){
				var fl  = [];
				$('.table-files .fclick:checked').each(function(){
					var id = $(this).val(),
						fid = $(this).attr('data-fid'),
						name = $('.fdname'+id).text();
					fl.push({
						id : id,
						fid : fid,
						name : name
					})
				})

				handerObj.triggerHandler('file:copy',{fl:fl});
			}
	}

	//批量下载
	function downFile(){
     	$('#downloadForm').html('');
     	var ids = [];
     	$('.fclick:checked').each(function(){
     		var flid = $(this).val();
     		ids.push(flid);
     		$('#downloadForm').append('<input name="fileId[]" type="checkbox" checked value="'+flid+'" />');
     	});
     	if(ids.length>1){
     		$('#downloadForm').submit();
     	}else{
     		if(ids[0]){
     			window.open('/api/file/download?fileId='+ids[0]);	
     		}
     	}		
	}

	//修改备注
	function editMark(id,mark,type,target){
		handerObj.triggerHandler(type+':editmark',{folderId:id,target:target,mark:mark});
	}
	/***********************************/

	//搜索
	function gosearch(key){
		var hash = location.hash;
		if(hash.indexOf('key=')>=0){
			hash = hash.replace(/key=([^&])+/g,'key='+key);
			location.hash = hash;
		}else{
			if(hash.length<1){
				location.hash = location.hash+'key='+key;
			}else{
				location.hash = location.hash+'&key='+key;
			}
		}
	}

	$('.btn-newfold').bind('click',function(e){
		handerObj.triggerHandler('fold:createfold');
	});

	//搜索框的绑定
	$('.search-key').bind('keyup',function(e){
		var target = $(this),
			def = target.attr('data-def');

		if(e.keyCode == 13){
			var v= $.trim(target.val());
			if(v != def){
				gosearch(v);
				//location.hash = location.hash+'&key='+v;
				// handerObj.triggerHandler('search:start',{
				// 	key : v
				// });
			}
		}
	}).bind('focus',function(e){
		var target = $(this),
			val = target.val(),
			def = target.attr('data-def');

		if(val == def){
			target.val('');
		}
	}).bind('blur',function(e){
		var target = $(this),
			val = target.val(),
			def = target.attr('data-def');

		if(val == def || val == ''){
			target.val(def);
		}
	});

	$('.search-btn').bind('click',function(){
		var	def = searchTarget.attr('data-def');		
		if(v != def){
			var v= $.trim(searchTarget.val());
			gosearch(v);					
		}
	});

    $('#boxtableTit').on('click','#selectAll',function(e){
		if($(this).prop('checked')){
			$('#boxTableList .liclick:not(:checked)').prop({'checked':true});
		}else{
			$('#boxTableList .liclick:checked').prop({'checked':false});
		}
    })


    $('#tableTit').bind('click',function(e){
    	var target = $(e.target),
    		cmd = target.attr('cmd');
    	if(cmd == 'selectall'){
			if(target.prop('checked')){
				$('#fileList .liclick:not(:checked)').prop({'checked':true});
			}else{
				$('#fileList .liclick:checked').prop({'checked':false});
			}
			checkAct();    		
    	}else if(cmd == 'select'){
			var tag = target.attr('data-tag');
			if(tag == 'folds'){	
				$('#fileList .fdclick').prop({'checked':true});
    			$('#fileList .fclick').prop({'checked':false});
				checkFoldAct();
			}else if(tag == 'files'){
				$('#fileList .fdclick').prop({'checked':false});
    			$('#fileList .fclick').prop({'checked':true});				
				checkAct();	
			}
			    	
    	}
    })	

    //显示或者隐藏重命名和评论
    var checkAct = function(){
    	var l = $('.table-files .fclick:checked').length;
    	var n = $('.table-files .fdclick:checked').length;

		if(n == 0){
			if(!nowSchool){
		    	$('#fileActZone .sharefile').show();
		    	$('#fileActZone .copyfile').show(); 
	    	}else if(nowAuth){
		    	$('#fileActZone .movefile').show(); 
	    	}
	    	$('#fileActZone .downfile').show();
	    	$('#fileActZone .collfile').show();
	    	$('#fileActZone .renamefile').show();
	    }
    	if(l==0 && n == 0){
			$('.tool-zone').removeClass('hide');
			$('.file-act-zone').addClass('hide');
    	}else{
			$('.tool-zone').addClass('hide');
			$('.file-act-zone').removeClass('hide');
    		if(l>0 && n> 0){
	    		$('#renameAct').addClass('hide');
	    		$('#remarkAct').addClass('hide');
    		}else{
				if(l>1 || n> 1){
					$('#renameAct').addClass('hide');
					$('#remarkAct').addClass('hide');
				}else{
					$('#renameAct').removeClass('hide');
					$('#remarkAct').removeClass('hide');
				}
    		}
    	}
    }	

    //显示或者隐藏重命名和评论
    var checkFoldAct = function(){
    	var l = $('.table-files .fclick:checked').length;
    	var n = $('.table-files .fdclick:checked').length;
    	// $('#fileList .fclick:checked').each(function(){
    	// 	$(this).attr('checked',false);
    	// });
    	if(l==0 && n == 0){
			$('.tool-zone').removeClass('hide');
			$('.file-act-zone').addClass('hide');
    	}else{
    		if(n>0){   			
		    	$('#fileActZone .sharefile').hide();
		    	$('#fileActZone .downfile').hide();
		    	$('#fileActZone .collfile').hide();    		
		    	$('#fileActZone .copyfile').hide(); 
		    	$('#fileActZone .movefile').hide();  
	    	}else{
				if(!nowSchool){
			    	$('#fileActZone .sharefile').show();
			    	$('#fileActZone .copyfile').show(); 
		    	}else if(nowAuth){
		    		$('#fileActZone .movefile').show();  
		    	}
		    	$('#fileActZone .downfile').show();
		    	$('#fileActZone .collfile').show();    		
		    		    		
	    	} 
			$('.tool-zone').addClass('hide');
			$('.file-act-zone').removeClass('hide');
    		if(l>0 && n > 0){
	    		$('#renameAct').addClass('hide');
	    		$('#remarkAct').addClass('hide');
    		}else{
				if(l>1 || n> 1){
					$('#renameAct').addClass('hide');
					$('#remarkAct').addClass('hide');
				}else{
					$('#renameAct').removeClass('hide');
					$('#remarkAct').removeClass('hide');
				}
    		}
    	}
    }  

    //删除文件和文件夹
    function deleteObj(){
    	var fid = {},
    		fdid = {}
    		cid = [];
		$('.table-files .fclick:checked').each(function(e){
			var id = $(this).val();
			fid[id] = $('.fdname'+id).text();
		});    	
		$('.table-files .fdclick:checked').each(function(e){
			var id = $(this).val();
			if($(this).attr('data-child')){
				cid.push(cid);
			}
			fdid[id] = $('.fdname'+id).text();
		});		
		handerObj.triggerHandler('file:del',{
			fl : fid,
			fd : fdid,
			cid : cid
		});
    }

    //重命名文件夹或文件
    function renameObj(){
    	if($('.table-files .fclick:checked').length > 0){
    		var id = $('.table-files .fclick:checked').val();
    		handerObj.triggerHandler('file:viewedit',{
    			id : id,
    			name : $('.fdname'+id).text()
    		});
    	}else{
    		var id = $('.table-files .fdclick:checked').val();
    		handerObj.triggerHandler('fold:viewedit',{
    			id : id,
    			name : $('.fdname'+id).text()
    		});
    	}
    }

    //批量操作按钮
    $('#fileActZone').bind('click',function(e){
		var target = $(e.target),
			cmd = target.attr('cmd');
		switch(cmd){	
			case 'rename':
				renameObj();
				break;
			case 'group':
			case 'other':
			case 'dep':
			case 'school':
				shareFile(cmd);
				break;	
			case 'downfile':
				downFile();
				break;
			case 'move':
				moveFile();
				break;
			case 'copy':
				copyFile();
				break;
			case 'del':
				deleteObj();
				break;
			case 'cancel':
				$('.tool-zone').removeClass('hide');
				$('.file-act-zone').addClass('hide');				
				$('.table-files input:checked').each(function(){
					$(this).attr('checked',false);
				});
				break;
		}			
    });

    //title 事件绑定
    $('#sectionTit').bind('click',function(e){
    	var target = $(e.target),
    		cmd = target.attr('cmd');
    	switch(cmd){
    		case 'tree':
				if($("#foldList").attr('show')){
					$("#foldList").hide().removeAttr('show');
					$('#fileList').css('float','none').css('width','100%');
				}else{
					$("#foldList").show().css('float','left').css('width','20%').attr('show',1);
					$('#fileList').css('float','left').css('width','80%');
				}   		
    			break;
    	}
    });


    //文件和文件夹选择
	$('.table-files').click(function(e){
		var t = $(e.target),
			type = t.attr("data-type");
		if(!type){
			return;
		}
		if(type == 'file'){
			checkAct();
		}else{
			checkFoldAct();
		}
	});

	//文件和文件夹列表的事件代理
	$(".table-list").bind('click',function(e){

		var gid = $('#fileList').attr('data-gid') || 0;
		var key = $('#searchKey').val(),
			def = $('#searchKey').attr('data-def');

		if(key == def){
			key = false;
		}
		var target = $(e.target),
			tag = 0,
			file = 0,
			cmd = target.attr('cmd');

		if(target.parents('.table-list').hasClass('table-files')){
			file = 1;
		}
		switch(cmd){
			case 'other':
			case 'group':
			case 'dep':
			case 'school':
				var id = target.attr('data-id'),
					name = target.attr('data-name'),
					obj = {
						id : id,
						name : name
					};
				shareFile(cmd,obj);
				break;	
			case 'ref': //恢复文件
				var id = target.attr('data-id');
				handerObj.triggerHandler('recy:ref',{id:[id]});
				break; 
			case 'delcomp': //从回收站彻底删除
				var id = target.attr('data-id'),
					size = target.attr('data-size');
				handerObj.triggerHandler('recy:del',{id:[id],size:[size]});
				break;				
			case 'coll':
				var id = target.attr('data-id');
				coll(id,target);
				break;
			case 'uncoll':
				var id = target.attr('data-id');
				var favid = target.attr('data-favid');
				uncoll(id,favid,target);
				break;
			case 'edit':
				$('.editmark').hide();
				target.hide();
				target.next('span').removeClass('hide').show();
				break;
			case 'editComp':
				var mark = target.prev('input').val(),
					id = target.attr('data-id'),
					type = target.attr('data-type');	
					editMark(id,mark,type,target);
					target.parent('span').prev('span').show();
					target.parent('span').addClass('hide');	
				break;
			case 'editClose':
				var mark = target.attr('data-value');
				target.prev('input').val(mark);
				target.parent('span').prev('span').show();
				target.parent('span').addClass('hide');			
				break;
			case 'save':
				var id = target.attr('data-id');
				handerObj.triggerHandler('mail:save',id);
				break;
			case 'savetomy':
				var id = target.attr('data-id');
				handerObj.triggerHandler('file:save',id);				
				break;
			case 'down':
				down(e);
				break;
			case 'pass':
				var id = target.attr('data-id'),
					name = target.attr('data-name');
				var obj = {
					id : id,
					name : name,
					status : 1
				}					
				handerObj.triggerHandler('school:showapv',obj);
				break;
			case 'notpass':
				var id = target.attr('data-id'),
					name = target.attr('data-name');
				var obj = {
					id : id,
					name : name,
					status : 0
				}
				handerObj.triggerHandler('school:showapv',obj);
				break;
			default :
				if(!target.hasClass('name-edit')){
					$('.editmark').hide();
					$('.f-mark').show();
				}
				if(file){
					if(!target.hasClass('liclick') && !target.hasClass('name-edit') && !target.hasClass('share-file') && !target.hasClass('no-act') && !target.hasClass('file-name')){
						var p = target.parents("tr");
						if(p.find('.liclick').prop('checked')){
							p.find('.liclick').prop({'checked':false});
						}else{
							p.find('.liclick').prop({'checked':true});
						}
						checkAct();
						//p.find('.liclick').click();										
					}
				}
				break;
		}
	});

	$('.page-div').bind('click',function(e){
		var target = $(e.target),
			cmd = target.attr('cmd');
		if(cmd){
			handerObj.triggerHandler('page:next');
		}
	});

	$('body').bind('click',function(e){
		var target = $(e.target);
		if(!target.hasClass('dr-menu')){
			$('.tit-menu').hide();
		}
	});

    var scrollData = {
        scrollEl: [],
        bindScroll: function(el, eventName){
            el.on('scroll', function(){
                //check if bottom
                var scrollTop = $(this).scrollTop();
                var scrollHeight = $(this).get(0).scrollHeight;
                var height = $(this).height();
                
                if(height + scrollTop > scrollHeight - 8){
                 bottomFlag = 1;
                }else{
                 bottomFlag = 0;
                }

                if(bottomFlag){
                    el.trigger(eventName);
                    handerObj.triggerHandler('page:next');
                }
            });
        },
        push: function(el, eventName){
            this.bindScroll(el, eventName);
        }
    };

    scrollData.push($('.listDiv'), "scrollBottom");	

    var wHeight = $(window).height();
    $('.listDiv').height(wHeight-220);
    $('#foldList').height(wHeight-220);

    function pageChange(e,d){
    	// nowPage = d;
		$("#foldList").hide().removeAttr('show');
		$('#fileList').css('float','none').css('width','100%');    	
    }

    function schoolChange(e,d){
    	if(typeof d == 'object'){
    		nowSchool = 1;
    		nowAuth = d.auth;
    	}else{
    		nowSchool = d;
    		nowAuth = 0;
    	}
    }

    var handlers = {
    	'page:change' : pageChange,
    	'bind:school' : schoolChange
    }

    for(var i in handlers){
    	handerObj.bind(i,handlers[i]);
    }
});

define('upload',['config','cache'],function(config,Cache){
	var	handerObj = $(Schhandler)
		setting = 0;

	$('.btn-upload').bind('click',function(){
		$('#uploadFile').slideDown(400);
		$('body').append('<div class="modal-backdrop fade in"></div>');
	});

	$('#uploadFile').bind('click',function(e){
		var t = $(e.target),
			cmd = t.attr("cmd");
		switch(cmd){
			case 'close':
				if($('#uploader_filelist .plupload_delete').length > 0){
					$('#uploadFile .modal-body').slideUp(400,function(){
						//window.location.reload();
					});
				}else if($('#uploader_filelist .plupload_uploading').length > 0){
					alert('还有文件正在上传,请等待文件上传完成再关闭上传窗口');
					return;
				}else{
					$('#uploadFile').slideUp(400);
					$('#uploader_filelist').html('');
				};
				$('.modal-backdrop').remove();
				break;
			case 'min':
				$('#uploadFile .modal-body').slideToggle(400,function(e){
					if(t.text() == '-'){
						t.text('o');
						$('.modal-backdrop').remove();
					}else{
						t.text('-');	
						$('body').append('<div class="modal-backdrop fade in"></div>');
						//plupload_uploading
					}
				});
				break;
		}
	});
	//'/cgi/gupload?gid='+nowGroupId+'&csrf_test_name='+$.cookie('csrf_cookie_name'),

	//console.log(upload_url);
    var upload_settings = {
        // General settings
        runtimes : 'html5,flash,silverlight,html4',
        url : config.cgi.upload,
        rename : true,
        dragdrop: true,

        file_data_name: 'file',

        flash_swf_url : '../../js/lib/moxie.swf',
        silverlight_xap_url : '../../js/lib/moxie.xap'
    };

    // var userAgent = navigator.userAgent; 
    // if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !(userAgent.indexOf("Opera") > -1)){
    // 	upload_settings.runtimes = 'flash';
    // } 
    if (!$.support.leadingWhitespace) {
	//if ($.browser.msie) {    	
    	upload_settings.runtimes = 'flash';
    }

    // if (upload_chunk == 1) {
    //     upload_settings.chunk_size = '1mb';
    // }

	var myinfo = Cache.get('myinfo');

    function paramChange(e,d){
    	var url = config.cgi.upload+'?';
    	if(d.gid){
    		url += 'groupId='+d.gid+'&';
    	}	
    	if(d.fdid){
    		url += 'folderId='+d.fdid;
    	}

    	upload_settings.url = url;
    	
    	if(!setting){
		    $("#uploader").pluploadQueue(upload_settings).unbind('allcompleta').bind('allcomplete',function(){
		    	if($('.plupload_failed').length == 0){
		    		$('#uploadFile .close-upload').click();
		    	}
			});
		}else{
			handerObj.triggerHandler('plup:changeSet',url);
		}
		handerObj.triggerHandler('plup:sizechange',d);
		setting = 1;
    }

	handerObj.bind('upload:param',paramChange);
	
});
define('msg',['config','cache','helper/view'],function(config,Cache,View){
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
;(function() {

  requirejs.config({
    baseUrl: 'js/school',
    paths: {
      jquery: '../lib/jquery'
    }    
  });

  require(['config','helper/router','helper/util','view.nav','view.file','view.fold','view.my','view.group','view.mail','view.coll','view.prep','view.recy','view.share','view.school','view.log','view.data','bind','upload','msg'], function(config,router,util,nav) {

    var handerObj = $(Schhandler);

    
    if(!util.getCookie('skey')){
      window.location = config.cgi.gotologin;
      return;
    }

    nav.init(); 

    var router = new router();

    var ftarget = $('#fileList'),
        fatarget = $('#fileActZone'),
        sctarget = $('#searchZone'),
        ltarget = $('#logBlock'),
        sttarget = $('#sectionTit'),
        dtarget = $('#dataBlock'),
        mtarget = $('#boxList'),
        btarget = $('#btnZone'),
        starget = $('#shareBox');

    function showModel(cmd){
      switch(cmd){
        case 'my':
          sttarget.show();
          btarget.show();
          ftarget.show();
          starget.hide();
          mtarget.hide(); 
          ltarget.hide();
          dtarget.hide();
          sctarget.show();        
          break;
        case 'myprep':
          sttarget.show();
          sctarget.show();
          ltarget.hide();
          btarget.show();
          ftarget.show();
          starget.hide();
          dtarget.hide();
          mtarget.hide();         
          break;
        case 'group':
          sttarget.show();
          sctarget.show();
          ltarget.hide();
          btarget.show();
          ftarget.show();
          starget.hide();
          dtarget.hide();
          mtarget.hide();         
          break;
        case 'groupprep':
          sttarget.show();
          sctarget.show();
          ltarget.hide();
          btarget.hide();
          ftarget.show();
          starget.hide();
          dtarget.hide();
          mtarget.hide();         
          break;
        case 'school':
          sttarget.show();
          sctarget.show();
          ltarget.hide();
          btarget.show();
          ftarget.show();
          starget.hide();
          dtarget.hide();
          mtarget.hide();        
          break;
        case 'mailbox':
          sttarget.show();
          sctarget.show();
          ltarget.hide();
          btarget.hide();
          ftarget.hide();
          starget.hide();
          dtarget.hide();
          mtarget.show(); 
          break;        
        case 'log':
          sttarget.hide();
          sctarget.hide();
          btarget.hide();
          ftarget.hide();
          starget.hide();
          mtarget.hide(); 
          dtarget.hide();
          ltarget.show();        
          break;
        case 'share':
          sttarget.show();
          sctarget.show();
          btarget.hide();
          ftarget.hide();
          starget.show();
          mtarget.hide(); 
          dtarget.hide(); 
          ltarget.hide();      
          break;
        case 'coll':
          sttarget.show();
          sctarget.show();
          btarget.hide();
          ftarget.hide();
          starget.hide();
          mtarget.show(); 
          dtarget.hide();       
          ltarget.hide();
          break;
        case 'recy':
          sttarget.show();
          sctarget.show();
          btarget.hide();
          ftarget.hide();
          starget.hide();
          mtarget.show(); 
          dtarget.hide(); 
          ltarget.hide();      
          break;
        case 'data':
          sttarget.hide();
          sctarget.hide();
          btarget.hide();
          ftarget.hide();
          starget.hide();
          mtarget.hide(); 
          dtarget.show();
          ltarget.hide();          
          break;
      }
    }


    //路由模块
    var opt = {
      routes : {
        "mailbox=:id" : 'mailbox',
        'mycoll=:id' : 'coll',
        'myshare' : 'share',
        'myrecy=:id' : 'recy',
        'recy=:id' : 'recy',
        "gid=:id" : 'group',
        'groupprep=:id' : 'groupprep',
        "gid=:id&fdid=:fdid" : 'group',
        "myprep=:1" : 'myPrep', //备课
        "school=:1" : 'school',
        "mylog=:1" : 'log',
        "data=:1" : 'data',
        "my" : 'myFile',     //个人文件
        "key=:id" : 'myFile',     //个人文件
        "" : 'myFile', // 无hash的情况，首页
        "fdid=:id" : 'myFile'
      },
      school : function(data){
        showModel('school');
        var gid = data.gid,
            uid = data.uid || 0,
            fdid = data.fdid || 0;
        var od = parseInt(data.od) || 0,
            on = data.on || 0,
            key = data.key || 0,
            type = data.type || 0;
        var d = {
          uid : uid,
          fdid : fdid,
          type : type
        }
        if(Math.abs(od)){
          d.order = [on,od];
        } 
        if(key){
          d.key = key;
        }  
        handerObj.triggerHandler('page:change'); 
        handerObj.triggerHandler('school:init',d);              
      },
      mailbox : function(data){
        showModel('mailbox');
        $('.tool-zone').removeClass('hide');
        fatarget.addClass('hide');       

        var cate = data.mailbox;
        var od = parseInt(data.od) || 0,
            type = data.type || 0,
            on = data.on || 0,
            key = data.key || 0; 
        var d = {
          type : type,
          cate : cate
        }
        if(key){
          d.key = key;
        }
        if(Math.abs(od)){
          d.order = [on,od];
        }               
        handerObj.triggerHandler('page:change');   
        handerObj.triggerHandler('mail:init',d);
        handerObj.triggerHandler('bind:school',0);   
        handerObj.triggerHandler('model:change','mail');
      },
      share : function(data){
        showModel('share');
        $('.tool-zone').removeClass('hide');
        fatarget.addClass('hide');       

        handerObj.triggerHandler('page:change');   
        handerObj.triggerHandler('share:init');
        handerObj.triggerHandler('model:change','share');
      },      
      coll : function(data){
        showModel('coll');
        $('.tool-zone').removeClass('hide');
        fatarget.addClass('hide');

        var od = parseInt(data.od) || 0,
            on = data.on || 0,
            type = data.type || 0,
            key = data.key || 0;     
        var d = {
          type : type
        }
        if(Math.abs(od)){
          d.order = [on,od];
        } 
        if(key){
          d.key = key;
        }

        handerObj.triggerHandler('page:change');   
        handerObj.triggerHandler('coll:init',d);
        handerObj.triggerHandler('model:change','coll');
      },
      recy : function(data){
        showModel('recy');
        $('.tool-zone').removeClass('hide');
        fatarget.addClass('hide');

        var od = parseInt(data.od) || 0,
            on = data.ordername || 0,
            type = data.type || 0,
            gid = data.gid || 0,
            school = data.school || 0,
            key = data.key || 0;   
        var d = {
          type : type
        }
        if(Math.abs(od)){
          d.order = [on,od];
        } 
        if(gid){
          d.gid = gid;
        }
        if(school){
          d.school = school;
        }
        if(key){
          d.key = key;
        }
        handerObj.triggerHandler('page:change');   
        handerObj.triggerHandler('recy:init',d);
        handerObj.triggerHandler('model:change','recy');
      },
      group : function(data){
        showModel('group');
 
        $('.tool-zone').removeClass('hide');
        fatarget.addClass('hide');

        var gid = data.gid,
            uid = data.uid || 0,
            fdid = data.fdid || 0;
        var od = parseInt(data.od) || 0,
            on = data.on || 0,
            key = data.key || 0,
            type = data.type || 0;
        var d = {
          gid : gid,
          uid : uid,
          fdid : fdid,
          type : type
        }
        if(Math.abs(od)){
          d.order = [on,od];
        }     
        if(key){
          d.key = key;
        }

        handerObj.triggerHandler('page:change');   
        handerObj.triggerHandler('group:init',d);  
        handerObj.triggerHandler('bind:school',0);   
        handerObj.triggerHandler('model:change','file'); 
        //handerObj.triggerHandler('upload:param',d);    
      },
      myFile : function(data){
        showModel('my');

        $('.tool-zone').removeClass('hide');
        fatarget.addClass('hide');

        var fdid = data.fdid;
        var od = parseInt(data.od) || 0,
            on = data.on || 0,
            key = data.key || 0,
            type = data.type || 0;
        var d = {
          fdid : fdid,
          type : type
        }
        if(Math.abs(od)){
          d.order = [on,od];
        }
        if(key){
          d.key = key;
        }

        handerObj.triggerHandler('page:change');   
        handerObj.triggerHandler('my:init',d);
        handerObj.triggerHandler('bind:school',0);   
        handerObj.triggerHandler('model:change','file');  
        //.triggerHandler('upload:param',d);
      },
      groupprep : function(data){

        $('.tool-zone').removeClass('hide');
        fatarget.addClass('hide');
        var fdid = data.fdid || 0,
            gid = data.gid || 0,
            pid = data.pid || 0,
            uid = data.uid || 0,
            grade = data.grade || 0,
            tag = data.tag || 0,
            od = parseInt(data.od) || 0,
            type = data.type || 0,
            on = data.on || 0,
            key = data.key || 0;
        var d = {
          fdid : fdid,
          gid : gid,
          pid : pid,
          tag : tag,
          uid : uid,
          type : type,
          grade : grade
        }
        if(Math.abs(od)){
          d.order = [on,od];
        }
        if(key){
          d.key = key;
        }        
 
        handerObj.triggerHandler('groupprep:init',d);
        //handerObj.triggerHandler('group:init',d);  
        handerObj.triggerHandler('bind:school',0);   
        handerObj.triggerHandler('model:change','file');           
      },
      log : function(data){
        showModel('log');
        var d = {
          gid: data.gid || 0
        }
        handerObj.triggerHandler('log:init',d);
      },
      data : function(data){
        showModel('data');
        var d = {
          fdid: data.fdid || 0
        }
        handerObj.triggerHandler('data:init',d);
      },
      myPrep : function(data){
        showModel('myprep');

        $('.tool-zone').removeClass('hide');
        fatarget.addClass('hide');

        var fdid = data.fdid || 0,
            gid = data.gid || 0,
            od = parseInt(data.od) || 0,
            on = data.on || 0,
            type = data.type || 0,
            key = data.key || 0;
        var d = {
          fdid : fdid,
          gid : gid,
          type : type
        }
        if(Math.abs(od)){
          d.order = [on,od];
        }
        if(key){
          d.key = key;
        }
        handerObj.triggerHandler('prep:init',d);
        handerObj.triggerHandler('bind:school',0);   
        handerObj.triggerHandler('model:change','file');     
      }
    };


    handerObj.bind('site:start',function(){
      router.extend(opt);
      router.start();    
    });
   
  });
})();
define("../main", function(){});
