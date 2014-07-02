/**
 * 常用公用方法
 */
define(['../config'], function(config) {
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
