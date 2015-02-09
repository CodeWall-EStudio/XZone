(function(){

    angular.module('teacherSpace', [
        'ts.controllers.main',
        'ts.controllers.navigator',
        'ts.controllers.toolbar',
        'ts.controllers.activityList',
        'ts.controllers.activityDetail',
        'ts.controllers.activityPanel',
        'ts.controllers.loginForm',
        'ts.directives.ngEnter'
    ]);
})();