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
        fatarget = $('#fileActZone'),
        mtarget = $('#boxList'),
        btarget = $('#btnZone'),
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
        btarget.hide();
        ftarget.hide();
        starget.hide();
        mtarget.show(); 
        $('.tool-zone').removeClass('hide');
        fatarget.addClass('hide');       

        var type = data.mailbox;
        var od = parseInt(data.od) || 0,
            on = data.on || 0,
            key = data.key || 0; 
        var d = {
          type : type
        }
        if(key){
          d.key = key;
        }
        if(Math.abs(od)){
          d.order = [on,od];
        }               
        handerObj.triggerHandler('page:change');   
        handerObj.triggerHandler('mail:init',d);
        handerObj.triggerHandler('model:change','mail');
      },
      share : function(data){
        btarget.hide();
        ftarget.hide();
        starget.show();
        mtarget.hide(); 
        $('.tool-zone').removeClass('hide');
        fatarget.addClass('hide');       

        handerObj.triggerHandler('page:change');   
        handerObj.triggerHandler('share:init');
        handerObj.triggerHandler('model:change','share');
      },      
      coll : function(data){
        btarget.hide();
        ftarget.hide();
        starget.hide();
        mtarget.show();
        $('.tool-zone').removeClass('hide');
        fatarget.addClass('hide');

        var od = parseInt(data.od) || 0,
            on = data.on || 0,
            key = data.key || 0;     
        var d = {}
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
        btarget.hide();
        ftarget.hide();
        starget.hide();
        mtarget.show();
        $('.tool-zone').removeClass('hide');
        fatarget.addClass('hide');

        var od = parseInt(data.od) || 0,
            on = data.ordername || 0,
            key = data.key || 0;   
        var d = {}
        if(Math.abs(od)){
          d.order = [on,od];
        } 
        if(key){
          d.key = key;
        }
        handerObj.triggerHandler('page:change');   
        handerObj.triggerHandler('recy:init',d);
        handerObj.triggerHandler('model:change','recy');
      },
      group : function(data){
        btarget.show();
        ftarget.show();
        starget.hide();
        mtarget.hide(); 
        $('.tool-zone').removeClass('hide');
        fatarget.addClass('hide');

        var gid = data.gid,
            fdid = data.fdid || 0;
        var od = parseInt(data.od) || 0,
            on = data.on || 0,
            key = data.key || 0;
        var d = {
          gid : gid,
          fdid : fdid
        }
        if(Math.abs(od)){
          d.order = [on,od];
        }     
        if(key){
          d.key = key;
        }

        handerObj.triggerHandler('page:change');   
        handerObj.triggerHandler('group:init',d);  
        handerObj.triggerHandler('model:change','file'); 
        handerObj.triggerHandler('upload:param',d);    
      },
      myFile : function(data){

        btarget.show();
        ftarget.show();
        starget.hide();
        mtarget.hide(); 
        $('.tool-zone').removeClass('hide');
        fatarget.addClass('hide');

        var fdid = data.fdid;
        var od = parseInt(data.od) || 0,
            on = data.on || 0,
            key = data.key || 0;
        var d = {
          fdid : fdid
        }
        if(Math.abs(od)){
          d.order = [on,od];
        }
        if(key){
          d.key = key;
        }

        handerObj.triggerHandler('page:change');   
        handerObj.triggerHandler('my:init',d);
        handerObj.triggerHandler('model:change','file');  
        //.triggerHandler('upload:param',d);
      },
      groupprep : function(data){
        btarget.hide();
        ftarget.show();
        starget.hide();
        mtarget.hide(); 
        $('.tool-zone').removeClass('hide');
        fatarget.addClass('hide');
        var fdid = data.fdid || 0,
            gid = data.gid || 0,
            pid = data.pid || 0,
            uid = data.uid || 0,
            grade = data.grade || 0,
            tag = data.tag || 0,
            od = parseInt(data.od) || 0,
            on = data.on || 0,
            key = data.key || 0;
        var d = {
          fdid : fdid,
          gid : gid,
          pid : pid,
          tag : tag,
          uid : uid,
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
        handerObj.triggerHandler('model:change','file');           
      },
      myPrep : function(data){
        btarget.show();
        ftarget.show();
        starget.hide();
        mtarget.hide(); 
        $('.tool-zone').removeClass('hide');
        fatarget.addClass('hide');

        var fdid = data.fdid || 0,
            gid = data.gid || 0,
            od = parseInt(data.od) || 0,
            on = data.on || 0,
            key = data.key || 0;
        var d = {
          fdid : fdid,
          gid : gid
        }
        if(Math.abs(od)){
          d.order = [on,od];
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