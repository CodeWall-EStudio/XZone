;(function() {

  requirejs.config({
    baseUrl: 'js/school',
    paths: {
      jquery: '../lib/jquery'
    }    
    // paths: {
    //   jquery: '../jquery',
    //   jqui: '../jqui'
    // }
    /*,
    shim: {
      jqui: {
        deps: ['jquery']
      },
      jqext : {
        deps : ['jquery']
      },
      jqjson : {
        deps : ['jquery']
      }      
    }
    */
  });

  require(['config','helper/router','helper/util','view.nav','view.file','view.fold','view.my','view.group','bind','upload'], function(config,router,util,nav,vf,vfo,vm,vg) {

    var handerObj = $(Schhandler);

    if(!util.getCookie('skey')){
      //window.location = config.cgi.login;
    }

    nav.init(); 

    var router = new router();

    var opt = {
      routes : {
        "groupid=:id" : 'group',
        "groupid=:id&fdid=:fdid" : 'group',
        "myprep" : 'myPrep', //备课
        "my" : 'myFile',     //个人文件
        "" : 'myFile', // 无hash的情况，首页
        "fdid=:id" : 'myFile'
      },
      group : function(data){
        var gid = data.groupid,
            fdid = data.fdid || 0,
            od = data.order || 0,
            on = data.ordername || 0;
        var d = {
          gid : gid,
          fdid : fdid
        }
        if(od){
          d.order = {};
          d.order[on] = od;
        }        
        handerObj.triggerHandler('group:init',d);       
      },
      myFile : function(data){
        var fdid = data.fdid,
            od = data.order || 0,
            on = data.ordername || 0;
        var d = {
          fdid : fdid
        }
        if(od){
          d.order = {};
          d.order[on] = od;
        }
        handerObj.triggerHandler('my:init',d);
        handerObj.triggerHandler('file:init',d);
        handerObj.triggerHandler('fold:init',d);
      },
      myPrep : function(){
        handerObj.triggerHandler('myfile:prep');
      }
    };

    router.extend(opt);
    router.start();    
  });
})();
  // var navCtrl = function($scope,$http){
  //   var obj = $http({
  //     method : 'GET',

  //     // url : config.cgi.info
  //     url : '/cgi/myinfo.php'
  //   });

  //   obj.success(function(data){
  //     var result = data.result;

  //     $scope.nick = result.nick;
  //     $scope.size = result.size;
  //     $scope.used = result.used;
  //     $scope.auth = result.auth;
  //     $scope.glist = result.gl;
  //     console.log($scope.glist);
  //   });

  // }


  //angular.bootstrap(document);