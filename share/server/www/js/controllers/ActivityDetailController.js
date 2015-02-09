angular.module('ts.controllers.activityDetail', [
        'ts.utils.constants',
        'ts.services.activity'
    ])
    .controller('ActivityDetailController', [
        '$rootScope', '$scope', 'ActivityService', 'EVENT_MODE_CHANGE', 'CMD_SHOW_ACTIVITY_PANEL',
        function($rootScope, $scope, ActivityService, EVENT_MODE_CHANGE, CMD_SHOW_ACTIVITY_PANEL){
            $scope.userCount = function(){
                if($rootScope.selectedActivity){
                    if($rootScope.selectedActivity.active){
                        //如果是开放的活动，则返回当前正在参与活动的用户数量
                        return $scope.participatorCount();
                    }
                    else{
                        //否则返回上传过资源的用户总数
                        return $scope.uploadedUserCount();
                    }
                }
                return 0;
            };

            $scope.participatorCount = function(){
                var a = $rootScope.selectedActivity;
                return (a && a.active) ? a.users.participators.length : 0;
            };

            $scope.uploadedUserCount = function(){
                if($rootScope.selectedActivity){
                    var users = _.countBy($rootScope.selectedActivity.resources, function(resource){
                        return resource.user;
                    });
                    return _.keys(users).length;
                }
                return 0;
            };

            $scope.resourceCount = function(type){
                if($rootScope.selectedActivity && $rootScope.selectedActivity.resources){
                    return _.reduce($rootScope.selectedActivity.resources, function(count, resource){
                        if(resource.type == type) count += 1;
                        return count;
                    }, 0);
                }
                return 0;
            };

            $scope.editActivity = function(){
                $rootScope.$emit(CMD_SHOW_ACTIVITY_PANEL, {
                    panelTitle: '编辑活动',
                    confirmBtnTitle: '保存',
                    activity: $.extend(true, {}, $rootScope.selectedActivity)
                });
            };

            $scope.closeActivity = function(){
                if(confirm('确定要关闭活动？')){
                    ActivityService.closeActivity($rootScope.selectedActivity._id);
                    //TODO how to refresh after successfully close the activity
                }
            };

            $scope.deleteActivity = function(){
                if(confirm('确定要删除活动？')){
                    ActivityService.deleteActivity($rootScope.selectedActivity._id, null, function(){
                        alert('删除活动失败，请注意：有资源或有用户加入的活动不能删除');
                    });
                }
            };

            $scope.handlePlayBtnClick = function(){
                var url = 'activity_play.html#?aid=' + $rootScope.selectedActivity._id;
                window.open(url, '_blank');
            };

            $rootScope.$on(EVENT_MODE_CHANGE, function(event, mode){
                ActivityService.selectActivity();
            });
        }
    ]);