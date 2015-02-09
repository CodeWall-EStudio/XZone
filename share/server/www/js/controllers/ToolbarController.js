angular.module('ts.controllers.toolbar', [
        'ts.utils.constants'
    ])
    .controller('ToolbarController', [
        '$rootScope', '$scope', 'EVENT_MODE_CHANGE', 'CMD_SHOW_ACTIVITY_PANEL',
        function($rootScope, $scope, EVENT_MODE_CHANGE, CMD_SHOW_ACTIVITY_PANEL){
            $scope.authorizationTypes = [
                {label:'授权我参与的', value:'invited'},
                {label:'公开的', value:'public'},
                {label:'全部权限', value:null}
            ];
            $scope.statuses = [
                {label:'开放的', value:'active'},
                {label:'关闭的', value:'closed'},
                {label:'全部状态', value:null}
            ];

            $scope.aTypeIndex = 2;
            $scope.statusIndex = 2;
            $scope.searchKeyword = '';

            $scope.showCreateActivityModal = function(event){
                if(!event.currentTarget.classList.contains('disabled')){
                    $rootScope.$emit(CMD_SHOW_ACTIVITY_PANEL);
                }
            };

            $scope.updateQueryAndSearch = function(field, value){
                if(field){
                    $scope[field] = value;
                }

                var query = {},
                    selectedAType = $scope.authorizationTypes[$scope.aTypeIndex].value,
                    selectedStatus = $scope.statuses[$scope.statusIndex].value;

                if(selectedAType)                   query['authorize'] = selectedAType;
                if(selectedStatus)                  query['status'] = selectedStatus;
                if($scope.searchKeyword)            query['kw'] = $scope.searchKeyword;

                //TODO 改成抛事件
                $rootScope.fetchActivities(query);
            };

            $rootScope.$on(EVENT_MODE_CHANGE, function(event, mode){
                $scope.updateQueryAndSearch();
            });
        }
    ]);