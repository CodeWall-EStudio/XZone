;(function() {

  requirejs.config({
    baseUrl: 'js/school',
    paths: {
      jquery: '../lib/jquery'
    }    
  });

  require(['config','helper/router','helper/util','view.nav','view.file','view.fold','view.my','view.group','view.mail','view.coll','view.prep','view.recy','view.share','bind','upload'], function(config,router,util,nav) {

    var handerObj = $(Schhandler);

    
    if(!util.getCookie('skey')){
      window.location = config.cgi.gotologin;
      return;
    }

    nav.init(); 

    var router = new router();

    var ftarget = $('#fileList'),
        mtarget = $('#boxList'),
        starget = $('#shareBox');


    //路由模块
    var opt = {
      routes : {
        "mailbox=:id" : 'mailbox',
        'mycoll=:id' : 'coll',
        'myshare' : 'share',
        'myrecy=:id' : 'recy',
        "gid=:id" : 'group',
        'groupprep=:id' : 'groupprep',
        "gid=:id&fdid=:fdid" : 'group',
        "myprep=:1" : 'myPrep', //备课
        "my" : 'myFile',     //个人文件
        "key=:id" : 'myFile',     //个人文件
        "" : 'myFile', // 无hash的情况，首页
        "fdid=:id" : 'myFile'
      },
      mailbox : function(data){

        ftarget.hide();
        starget.hide();
        mtarget.show();        

        var type = data.mailbox;
        var od = data.od || 0,
            on = data.on || 0,
            key = data.key || 0; 
        var d = {
          type : type
        }
        if(key){
          d.key = key;
        }
        if(od){
          d.order = {};
          d.order[on] = od;
        }               
        handerObj.triggerHandler('page:change');   
        handerObj.triggerHandler('mail:init',d);
        handerObj.triggerHandler('model:change','mail');
      },
      share : function(data){
        ftarget.hide();
        starget.show();
        mtarget.hide();        

        handerObj.triggerHandler('page:change');   
        handerObj.triggerHandler('share:init');
        handerObj.triggerHandler('model:change','share');
      },      
      coll : function(data){
        ftarget.hide();
        starget.hide();
        mtarget.show();
        var od = data.od || 0,
            on = data.on || 0,
            key = data.key || 0;     
        var d = {}
        if(od){
          d.order = {};
          d.order[on] = od;
        } 
        if(key){
          d.key = key;
        }

        handerObj.triggerHandler('page:change');   
        handerObj.triggerHandler('coll:init',d);
        handerObj.triggerHandler('model:change','coll');
      },
      recy : function(data){

        ftarget.hide();
        starget.hide();
        mtarget.show();

        var od = data.order || 0,
            on = data.ordername || 0,
            key = data.key || 0;   
        var d = {}
        if(od){
          d.order = {};
          d.order[on] = od;
        } 
        if(key){
          d.key = key;
        }
        handerObj.triggerHandler('page:change');   
        handerObj.triggerHandler('recy:init',d);
        handerObj.triggerHandler('model:change','recy');
      },
      group : function(data){

        ftarget.show();
        starget.hide();
        mtarget.hide(); 

        var gid = data.gid,
            fdid = data.fdid || 0;
        var od = data.od || 0,
            on = data.on || 0,
            key = data.key || 0;
        var d = {
          gid : gid,
          fdid : fdid
        }
        if(od){
          d.order = {};
          d.order[on] = od;
        }     
        if(key){
          d.key = key;
        }

        handerObj.triggerHandler('page:change');   
        handerObj.triggerHandler('group:init',d);  
        handerObj.triggerHandler('model:change','file');     
      },
      myFile : function(data){

        ftarget.show();
        starget.hide();
        mtarget.hide(); 

        var fdid = data.fdid;
        var od = data.od || 0,
            on = data.on || 0,
            key = data.key || 0;
        var d = {
          fdid : fdid
        }
        if(od){
          d.order = {};
          d.order[on] = od;
        }
        if(key){
          d.key = key;
        }

        handerObj.triggerHandler('page:change');   
        handerObj.triggerHandler('my:init',d);
        handerObj.triggerHandler('model:change','file');     
      },
      groupprep : function(data){
        ftarget.show();
        starget.hide();
        mtarget.hide(); 
        var fdid = data.fdid || 0,
            gid = data.gid || 0,
            pid = data.pid || 0,
            grade = data.grade || 0,
            tag = data.tag || 0,
            od = data.od || 0,
            on = data.on || 0,
            key = data.key || 0;
        var d = {
          fdid : fdid,
          gid : gid,
          pid : pid,
          tag : tag,
          grade : grade
        }
        if(od){
          d.order = {};
          d.order[on] = od;
        }
        if(key){
          d.key = key;
        }        
 
        handerObj.triggerHandler('groupprep:init',d);
        //handerObj.triggerHandler('group:init',d);  
        handerObj.triggerHandler('model:change','file');           
      },
      myPrep : function(data){

        ftarget.show();
        starget.hide();
        mtarget.hide(); 

        var fdid = data.fdid || 0,
            gid = data.gid || 0,
            od = data.od || 0,
            on = data.on || 0,
            key = data.key || 0;
        var d = {
          fdid : fdid,
          gid : gid
        }
        if(od){
          d.order = {};
          d.order[on] = od;
        }
        if(key){
          d.key = key;
        }        
 
        handerObj.triggerHandler('prep:init',d);
        handerObj.triggerHandler('model:change','file');     
      }
    };


    handerObj.bind('site:start',function(){
      router.extend(opt);
      router.start();    
    });
   
  });
})();