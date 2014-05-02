;(function() {

  requirejs.config({
    baseUrl: 'js/school',
    paths: {
      jquery: '../lib/jquery'
    }    
  });

  require(['config','helper/router','helper/util','view.nav','view.file','view.fold','view.my','view.group','view.mail','view.coll','view.prep','view.recy','view.share','view.school','view.log','bind','upload','msg'], function(config,router,util,nav) {

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
          sctarget.show();        
          break;
        case 'myprep':
          sttarget.show();
          sctarget.show();
          ltarget.hide();
          btarget.show();
          ftarget.show();
          starget.hide();
          mtarget.hide();         
          break;
        case 'group':
          sttarget.show();
          sctarget.show();
          ltarget.hide();
          btarget.show();
          ftarget.show();
          starget.hide();
          mtarget.hide();         
          break;
        case 'groupprep':
          sttarget.show();
          sctarget.show();
          ltarget.hide();
          btarget.hide();
          ftarget.show();
          starget.hide();
          mtarget.hide();         
          break;
        case 'school':
          sttarget.show();
          sctarget.show();
          ltarget.hide();
          btarget.show();
          ftarget.show();
          starget.hide();
          mtarget.hide();        
          break;
        case 'mailbox':
          sttarget.show();
          sctarget.show();
          ltarget.hide();
          btarget.hide();
          ftarget.hide();
          starget.hide();
          mtarget.show(); 
          break;        
        case 'log':
          sttarget.hide();
          sctarget.hide();
          btarget.hide();
          ftarget.hide();
          starget.hide();
          mtarget.hide(); 
          ltarget.show();        
          break;
        case 'share':
          sttarget.show();
          sctarget.show();
          btarget.hide();
          ftarget.hide();
          starget.show();
          mtarget.hide();  
          ltarget.hide();      
          break;
        case 'coll':
          sttarget.show();
          sctarget.show();
          btarget.hide();
          ftarget.hide();
          starget.hide();
          mtarget.show();        
          ltarget.hide();
          break;
        case 'recy':
          sttarget.show();
          sctarget.show();
          btarget.hide();
          ftarget.hide();
          starget.hide();
          mtarget.show();  
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
        "my" : 'myFile',     //个人文件
        "key=:id" : 'myFile',     //个人文件
        "" : 'myFile', // 无hash的情况，首页
        "fdid=:id" : 'myFile'
      },
      school : function(data){
        showModel('school');
        var gid = data.gid,
            fdid = data.fdid || 0;
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
            fdid = data.fdid || 0;
        var od = parseInt(data.od) || 0,
            on = data.on || 0,
            key = data.key || 0,
            type = data.type || 0;
        var d = {
          gid : gid,
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