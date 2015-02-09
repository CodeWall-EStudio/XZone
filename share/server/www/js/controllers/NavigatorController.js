angular.module('ts.controllers.navigator', [
        'ts.services.user'
    ])
    .controller('NavigatorController', [
        '$rootScope', '$scope', 'UserService', 'EVENT_LOGIN', 'CMD_SHOW_LOGIN_PANEL',
        function($rootScope, $scope, UserService, EVENT_LOGIN, CMD_SHOW_LOGIN_PANEL){
            function getNickname(){
                $scope.nickname = UserService.nick();
            }

            $rootScope.$on(EVENT_LOGIN, function(event, status){
                if(status == 200){
                    getNickname();
                }
            });

            getNickname();
        }
    ]);