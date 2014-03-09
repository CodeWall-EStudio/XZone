define([], function() {
  'use strict';

  var loop = function() {};

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
      if(!onError || typeof onError != 'function') onError = loop;
    }
    //var cacheKey = Cache.getKey(cgi,data);

    //$.extend(data, {uin: uin});
    // g_tk在query string上
    // if(method == 'GET') {
    //   $.extend(data, {g_tk: g_tk});
    // } else {
    //   var mark = '?',
    //     index = cgi.indexOf(mark);

    //   if(~index) mark = '&';
    //   cgi = cgi + mark + 'g_tk=' + g_tk;
    // }

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
      // var code = res.code,
      //   type = 1;

      // if('undefined' === typeof code) code = res.ret; // 拉腾讯软件的cgi
      // if(code) type = 3;
      
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