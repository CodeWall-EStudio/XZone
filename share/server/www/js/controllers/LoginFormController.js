angular.module('ts.controllers.loginForm', [
        'ts.utils.constants',
        'ts.services.user'
    ])
    .controller('LoginFormController', [
        '$rootScope', '$scope', 'UserService', 'CMD_SHOW_LOGIN_PANEL',
        function($rootScope, $scope, UserService, CMD_SHOW_LOGIN_PANEL){
            $scope.uid = '';
            $scope.pwd = '';
            $scope.errMsg = '';

            $scope.login = function(){
                function handleResult(data, status){
                    if(status == 200){
                        $('#loginModal').modal('hide');
                    }
                    else {
                        $scope.errMsg = '验证失败';
                        $scope.$digest();
                    }
                    //reset form
                    $scope.uid = $scope.pwd = $scope.errMsg = '';
                }

                if($scope.uid){
                    if($scope.pwd){
                        UserService.login(
                            $scope.uid, $scope.pwd,
                            handleResult, handleResult
                        );
                    }
                    else $scope.errMsg = '请输入密码'; }
                else $scope.errMsg = '请输入帐号名';
            };

            $rootScope.$on(CMD_SHOW_LOGIN_PANEL, function(){
                if(UserService.hasLoggedIn()){
                    if(confirm('确定要退出登录吗？')){
                        UserService.logout();
                    }
                    else return;
                }
                $('#loginModal').modal('show');
            });

            //NOTE 20140302 QQ登錄改造，改用QQ互聯OAUTH2登錄
            /*if(!UserService.hasLoggedIn()){
                $('#loginModal').modal('show');
            }*/
        }
    ]);