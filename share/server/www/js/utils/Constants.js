angular.module('ts.utils.constants', [])
    //env
    .constant('BACKEND_SERVER', location.hostname == 'localhost' ? 'http://localhost:8090' : '')

    //event
    .constant('EVENT_LOGIN', 'event.login') //登录结果
    .constant('EVENT_MODE_CHANGE', 'event.mode.change') //导航栏上切换了模式（查看/管理）

    //cmd
    .constant('CMD_SHOW_LOGIN_PANEL', 'cmd.login.panel.show') //展示登錄界面
    .constant('CMD_SHOW_ACTIVITY_PANEL', 'cmd.activity.panel.show') //展示活动创建/编辑面板