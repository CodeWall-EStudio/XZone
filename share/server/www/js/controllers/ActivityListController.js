angular.module('ts.controllers.activityList', [
        'ts.services.activity'
    ])
    .controller('ActivityListController', [
        '$rootScope', '$scope', 'ActivityService',
        function($rootScope, $scope, ActivityService){
            $scope.selectActivity = function(id){
                ActivityService.selectActivityByID(id);
            };
        }
    ]);