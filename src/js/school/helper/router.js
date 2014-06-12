define(function(){
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