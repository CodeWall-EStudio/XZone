
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
			mfilelist : CGI_PATH+'manage/listFiles',
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
/**
 * 常用公用方法
 */
define('helper/util',['../config'], function(config) {
	var handerObj = $(Schhandler);
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

	var getServerTime = function(str){
		var tmp = str.split(/\r\n/);
		var tmp1 = tmp[0].split('Date:');
		var nowtime = + new Date(tmp1[1]);
		handerObj.triggerHandler('cache:set',{key: 'nowtime',data: nowtime});
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
	util.getServerTime = getServerTime;

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
define('model.review',['config','helper/request','helper/util'],function(config,request,util){
	var	handerObj = $(Schhandler);

	function getFile(obj,callback){
		var opt = {
			cgi : config.cgi.filesearch,
			data : obj
		}
		var success = function(d){
			if(d.err == 0){
				if(typeof callback === 'function'){
					callback(d.result);
				}else{
					handerObj.triggerHandler('review:fileload',d.result);
				}
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);
	}

	function getMailFile(obj,callback){
		var opt = {
			cgi : config.cgi.msgsearch,
			data : obj
		}
		var success = function(d){
			if(d.err == 0){
				if(typeof callback === 'function'){
					callback(d.result);
				}else{
					handerObj.triggerHandler('review:fileload',d.result);
				}
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);		
	}

	function getCollFile(obj,callback){
		var opt = {
			cgi : config.cgi.favsearch,
			data : d
		}	

		var success = function(d){
			if(d.err == 0){
				if(typeof callback === 'function'){
					callback(d.result);
				}else{
					handerObj.triggerHandler('review:fileload',d.result);
				}
			}else{
				handerObj.triggerHandler('msg:error',d.err);
			}
		}
		request.get(opt,success);
	}

	return {
		getfile : getFile,
		getmailfile : getMailFile,
		getcollfile : getCollFile
	}
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

  require(['config','helper/util','helper/request','helper/view','model.review','msg'], function(config,util,request,View,Review) {

    var handerObj = $(Schhandler);
    var nowType = null;
    
    if(!util.getCookie('skey')){
      window.location = config.cgi.gotologin;
      return;
    }

    function convent(data){
      var obj = {};
      obj.fid = data.resource._id;
      obj.type = data.resource.type || data.type;
      obj.name = data.name;
      obj.id = data._id;
      obj.mail = mail;
      return obj;
    }

    function render(data){
      //图片
      var view = new View({
        target : $('#reviewDiv'),
        tplid : 'review',
        after : function(){
          if(data.type == 2){
              var purl = encodeURIComponent(config.cgi.filereview+'?fileId='+data.id);
              if(mail){
                purl = encodeURIComponent(config.cgi.filereview+'?messageId='+data.id)
              }
              $('#documentViewer').FlexPaperViewer(
                { config : {
                    SWFFile : purl,
                    jsDirectory : '/js/lib/flex/',
                    Scale : 0.8,
                    ZoomTransition : 'easeOut',
                    ZoomTime : 0.5,
                    ZoomInterval : 0.2,
                    FitPageOnLoad : true,
                    FitWidthOnLoad : false,
                    FullScreenAsMaxWindow : false,
                    ProgressiveLoading : false,
                    MinZoomSize : 0.2,
                    MaxZoomSize : 5,
                    SearchMatchAll : false,
                    InitViewMode : 'Portrait',
                    RenderingOrder : 'flash',
                    StartAtPage : '',
                    ViewModeToolsVisible : true,
                    ZoomToolsVisible : true,
                    NavToolsVisible : true,
                    CursorToolsVisible : true,
                    SearchToolsVisible : true,
                    WMode : 'window',
                    localeChain: 'zh_CN'
                }}
              );            
          }else if(data.type == 1){
               var num = 0;
// 　　　　angle:0,  //起始角度
// 　　　　　animateTo:180,  //结束的角度
// 　　　　　duration:500， //转动时间               
            $('.to-left').bind('click',function(){
              $('#reviewImg').rotate({
                angle: (num)*90,
                animateTo: (num-1)*90,
              });
              num--;              

            });
            $('.to-right').bind('click',function(){
            
              $('#reviewImg').rotate({                          
                    angle: num*90,
                    animateTo: (num+1)*90,
                  });
              num++;              
            }); 
            $('.zoom-in').bind('click',function(){
              $('#reviewImg').css('width',function(i,v){
                var nv = parseInt(v,10);
                return nv*0.8;
              }); 
            });
            $('.zoom-out').bind('click',function(){
              $('#reviewImg').css('width',function(i,v){
                var nv = parseInt(v,10);
                return nv*1.2;
              }); 
            }); 
          }
        },
        data : {
          data : data,
          url : config.cgi.filereview
        }
      });
      view.createPanel();
    }

    function getReview(id,data){
      var opt = {
        cgi : config.cgi.filereview,
        data : {
          fileId : id
        }
      } 
      var success = function(d){
        if(d.err == 0){
          $.extend(data,d.result);
          render(data);
        }else{
          handerObj.triggerHandler('msg:error',d.err);
        }
      }
      request.get(opt,success);            
    }

    function getFile(id){
      var obj = {}
          url = config.cgi.fileinfo;
      if(mail){
        obj.messageId = id;
        url = config.cgi.msgone;
      }else{
        obj.fileId = id;
      }
      var opt = {
        cgi : url,
        data : obj
      }
      var success = function(d){
        if(d.err == 0){
          var finfo = convent(d.result.data);
          if(finfo.type == 8){
            var to = {};
            if(mail){
              to.messageId = id;
            }else{
              to.fileId = id;
            }
            $.get(config.cgi.filereview,to,function(d){
              finfo.text = d;
              render(finfo);
            },'text');
          }else{
            render(finfo);
          }
          //getReview(id,finfo);
          //render(finfo);
        }else{
          handerObj.triggerHandler('msg:error',d.err);
        }
      }
      request.get(opt,success); 
    }

    var total = 0;
    var id = util.getParam('id');
    var mail = util.getParam('mail');
    var cate = util.getParam('cate');
    var coll = util.getParam('coll')
    var gid = util.getParam('gid');
    var fdid = util.getParam('fdid');
    var page = parseInt(util.getParam('page')) || 0;
    var key = util.getParam('key');
    var ods = util.getParam('ods');
    var isMove = false; //切换预览
    var isInit = false; //是否已经初始化
    if(page){
      page -=1;
    }
    var oldpage = page;
    var isLoad = false;   //加载中

    function next(i){
      var t = $('#reviewFileList');
      var rw = t.parent()[0].clientWidth;
      var tw = t.width();
      var nl = i*48+48;
      var tl = t[0].offsetLeft - 36;
      if(tw-rw>0){
        if((tw-rw)%nl === 0 && (tw-rw)%480 === 0){
          tl -=rw;
          t.css('marginLeft',tl+'px');
        }
      }
    }

    function prev(i){
      var t = $('#reviewFileList');
      var rw = t.parent()[0].clientWidth;
      var tl = t[0].offsetLeft - 36; 
      if(i === 0 || i === 10){
          tl += rw;
          if(tl>0){
            tl = 0;
          }
          t.css('marginLeft',tl+'px');
      }   
    }

    //节流
    function lookMove(){
      isMove = true;
      setTimeout(function(){
        isMove = false;
      },500);
    }

    //console.log(mail,coll,gid,fdid,page);
    function renderBlock(list,id){
      var tplid = 'review.block';
      var target = $("#reviewBlock");
      if(page !== oldpage){
        tplid = 'review.list';
        target = $('#reviewFileList');
      }
      var obj = {
        target : target,
        tplid : tplid,
        data : {
          list : list,
          page : page,
          id : id
        },
        after : function(){
          var l = $('#reviewFileList li').length;
          $('#reviewFileList').width(48*l); 
        }      
      };

      if(!isInit){
        isInit = true;
        obj.handlers = {
          'li' : {
            'click': function(e){
              if(isMove){
                return;
              }
              lookMove();
              var t = $(this);
              var id = t.attr('data-id');
              if(id){
                $("#reviewBlock li").removeClass('selected');
                t.addClass('selected');
                getFile(id);
              }
            }
          },
          '.ar-arrow' : {
            'click' : function(){
              if(isMove){
                return;
              }
              lookMove();
              var t = $("#reviewBlock li");
              var l = $("#reviewBlock li").length;
              var idx = 0;
              $("#reviewBlock li").each(function(i){
                if($(this).hasClass('selected')){
                  idx = i;
                }
              });
              next(idx);
              if(idx<l-1){
                  $("#reviewBlock li").removeClass('selected');
                  var nt = $("#reviewBlock li").eq(idx+1);
                  var id = nt.attr('data-id');
                  nt.addClass('selected');  
                  if(id){
                    getFile(id);
                  }
              }else{
                if($("#reviewBlock li").length < total){
                  page++;
                  loadFile();
                }else{
                  handerObj.triggerHandler('msg:show',{
                    type: 'error',
                    msg : '已经是最后一个文件了!'
                  });
                }
              }
            }
          },
          '.al-arrow' : {
            'click' : function(){
              if(isMove){
                return;
              }
              lookMove();              
              var t = $("#reviewBlock li");
              var l = $("#reviewBlock li").length;
              var idx = 0;
              $("#reviewBlock li").each(function(i){
                if($(this).hasClass('selected')){
                  idx = i;
                }
              });
              prev(idx);
              if(idx>0){
                  $("#reviewBlock li").removeClass('selected');
                  var nt = $("#reviewBlock li").eq(idx-1);
                  var id = nt.attr('data-id');
                  nt.addClass('selected');  
                  if(id){
                    getFile(id);
                  }              
              }else{
                if(page>0){
                  page--;
                  loadFile();
                }else{
                  handerObj.triggerHandler('msg:show',{
                    type: 'error',
                    msg : '已经是第一个文件了!'
                  });
                }
              }
            }
          }
        }        
      }

      var view = new View(obj);
      if(page === oldpage){
        view.createPanel();  
      }else if(page < oldpage){
        view.beginPanel();
        var tl = target[0].offsetLeft - 36; 
        var rw = target.parent()[0].clientWidth;
        target.css('marginLeft',tl-rw+"px");
        $('.al-arrow').click();
      }else{
        view.appendPanel();
        $('.ar-arrow').click();
      }
      oldpage = page;
    }

    function fileLoad(d){
      isLoad = false;
      total = d.total;
      renderBlock(d.list,id);
    }

    function mailLoad(d){
      isLoad = false;
      total = d.total;
      renderBlock(d.list,id);
    }

    function collLoad(d){
      isLoad = false;
      total = d.total;
      renderBlock(d.list,id);
    }    

    //拉文件列表
    function loadFile(){
      if(isLoad){
        return;
      }
      isLoad = true;
      if(fdid){
        Review.getfile({
          page : page,
          pageNum : 10,
          folderId : fdid,
          order : ods,
          key : key,
        },fileLoad);
      }else if(mail){
        Review.getmailfile({
          page : page,
          pageNum : 10,
          order : ods,
          key : key,          
          cate : cate,
          order : ods
        },mailLoad);
      }else if(coll){
        Review.getcollfile({
          page : page,
          pageNum : 10,
          order : ods,
          key : key,          
          cate : cate,
          order : ods
        },collLoad);
      }      
    }
    
    loadFile();
    getFile(id);
   
  });
})();
define("../review", function(){});
