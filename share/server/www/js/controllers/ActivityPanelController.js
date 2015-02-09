angular.module('ts.controllers.activityPanel', [
        'ts.utils.constants',
        'ts.services.activity',
        'ts.services.utils'
    ])
    .controller('ActivityPanelController', [
        '$rootScope', '$scope', '$http', 'ActivityService', 'UtilsService', 'CMD_SHOW_ACTIVITY_PANEL',
        function($rootScope, $scope, $http, ActivityService, UtilService, CMD_SHOW_ACTIVITY_PANEL){
            var modal                       = $('#createActivityModal'),
                usersInput                  = $('input[data-role="tagsinput"]'),
                datetimePicker              = document.getElementById('na_date'),
                fieldset                    = document.getElementById('activityFormAllFields'),
                fieldsetForOpenActivities   = document.getElementById('activityFormFieldsForOpenActivities'),
                defaults = {
                    panelTitle: '创建活动',
                    confirmBtnTitle: '创建活动',
                    cancelBtnTitle: '取消',
                    activityContent: {
                        info: {
                            type: 1
                        },
                        users: {
                            invitedUsers: []
                        }
                    }
                };

            $rootScope.$on(CMD_SHOW_ACTIVITY_PANEL, function(event, data){
                //initialize $scope
                data = data || {};
                $scope.panelTitle       = data.panelTitle || defaults.panelTitle;
                $scope.confirmBtnTitle  = data.confirmBtnTitle || defaults.confirmBtnTitle;
                $scope.cancelBtnTitle   = data.cancelBtnTitle || defaults.cancelBtnTitle;
                $scope.activity         = data.activity || cloneDefaulActivityContent();
                $scope.invitedUsers     = $scope.activity.users.invitedUsers.join(',');

                //get config
                var config = $scope.config ? $scope.config.activityConfig : {},
                    info = $scope.activity.info;
                //find grade index
                for(var i=0; i<config.classes.length; ++i){
                    var grade = config.classes[i];
                    if(grade.grade == info['grade']){
                        $scope.grade = i;
                        $scope.cls = grade.cls.indexOf(info['class']);
                        console.log($scope.grade, $scope.cls);
                        break;
                    }
                }

                //初始化日期時間
                var ts = $scope.activity.info.date,
                    now = new Date(),
                    date = (ts ? new Date(ts) : now);
                date.setSeconds(0);
                date.setMilliseconds(0);
                $scope.activity.info.date = UtilService.time.dateToDatetimePickerValue(date);
                datetimePicker.setAttribute('min', UtilService.time.dateToDatetimePickerValue(now));

                //初始化授權用戶
                _.each($scope.activity.users.invitedUsers, function(item){
                    usersInput.tagsinput('add', item);
                });

                //show the panel's dom
                $scope.showActivityPanel();
            });

            function getNickForUid(uid){
                var profile = $rootScope.profiles[uid];
                return profile ? profile.nick + '(' + uid + ')' : uid;
            }

            modal.on('hidden.bs.modal', function () {
                //$scope.$apply(function(){
                resetFields();
                //});
            });

            $scope.$watch('grade', function(newValue){
                //$scope.cls = 0;
            });

            $scope.showActivityPanel = function(){
                $('#createActivityModal').modal('show');
                if(!$scope.activity._id || $scope.activity.active){
                    fieldsetForOpenActivities.removeAttribute('disabled');
                }
                else{
                    fieldsetForOpenActivities.setAttribute('disabled', 'disabled');
                }
            };

            $scope.createActivity = function(){
                $scope.errMsg = '';
                disableFields();

                var config = $scope.config ? $scope.config.activityConfig : {},
                    gradeConfig = config.classes[$scope.grade],
                    subjectConfig = config.subjects[$scope.subject],
                    params = {
                    uids:       $scope.invitedUsers || '',
                    title:      $scope.activity.info.title || '',
                    type:       $scope.activity.info.type|1,
                    desc:       $scope.activity.info.desc || '',
                    date:       UtilService.time.datetimePickerValueToTs($scope.activity.info.date),
                    teacher:    $scope.activity.info.teacher || '',
                    grade:      gradeConfig ? gradeConfig.grade : '',
                    'class':    gradeConfig ? gradeConfig.cls[$scope.cls] : '',
                    subject:    subjectConfig || '',
                    domain:     $scope.activity.info.domain || ''
                };
                ActivityService.createActivity(
                    params,
                    handleActivityCreatedOrUpdatedSuccess,
                    handleActivityCreatedOrUpdatedFail
                );
            };

            $scope.updateActivity = function(){
                $scope.errMsg = '';
                disableFields();

                var config = $scope.config ? $scope.config.activityConfig : {};
                var params = {
                    uids: $scope.invitedUsers || ''
                };
                if($scope.activity.active){
                    params['title']     = $scope.activity.info.title || '';
                    params['type']      = $scope.activity.info.type || '';
                    params['desc']      = $scope.activity.info.desc || '';
                    params['date']      = UtilService.time.datetimePickerValueToTs($scope.activity.info.date);
                    params['teacher']   = $scope.activity.info.teacher || '';
                    params['grade']     = config.classes[$scope.grade].grade || '';
                    params['class']     = config.classes[$scope.grade].cls[$scope.cls] || '';
                    params['subject']   = config.subjects[$scope.subject] || '';
                    params['domain']    = $scope.activity.info.domain || '';
                }
                ActivityService.updateActivity(
                    $scope.activity._id,
                    params,
                    handleActivityCreatedOrUpdatedSuccess,
                    handleActivityCreatedOrUpdatedFail
                );
            };

            $scope.handleConfirmBtnClick = function(){
                if($scope.activity._id) $scope.updateActivity();
                else                    $scope.createActivity();
            };

            function cloneDefaulActivityContent(){
                return $.extend(true, {}, defaults.activityContent);
            }

            function fetchActivityConfig(){
                ActivityService.fetchActivityConfig(
                    function(data, status){
                        $scope.config = data;
                        /*$scope.grade = 0;
                        $scope.cls = 0;
                        $scope.subject = 0;*/
                    }
                )
            }

            function handleActivityCreatedOrUpdatedSuccess(data, status){
                console.log(data, status);
                enableFields();
                hideModal();
            }
            function handleActivityCreatedOrUpdatedFail(data, status){
                data = data || {c:-1, msg:'UNKNOWN'};
                var message = '其他未知错误';
                switch(data.c){
                    case 1:     message = '后台其他错误'; break;
                    case 10:    message = '用户尚未登录'; break;
                    case 10000: message = '用户权限填写不正确'; break;
                    case 10010: message = '活动标题填写不正确'; break;
                    case 10020: message = '活动类型填写不正确'; break;
                    case 10040: message = '活动日期填写不正确，必须晚于当前时间！'; break;
                    case 10050: message = '出课教师填写不正确'; break;
                    case 10060: message = '年级填写不正确'; break;
                    case 10070: message = '班级填写不正确'; break;
                    case 10080: message = '学科填写不正确'; break;
                    case 10090: message = '课题填写不正确'; break;
                }
                //$scope.errMsg = status + ' - [' + data.c + '] ' + data.m;
                $scope.errMsg = '[' + status + '|' + data.c + ']' + message;
                enableFields();
            }

            function enableFields(){
                fieldset.removeAttribute('disabled');
            }
            function disableFields(){
                fieldset.setAttribute('disabled', 'disabled');
            }

            function hideModal(){
                modal.modal('hide');
            }

            function resetFields(){
                $scope.activity = cloneDefaulActivityContent();
                $scope.grade = $scope.cls = $scope.subject = 0;
                $scope.errMsg = '';
                usersInput.tagsinput('removeAll');
            }

            function dateToDatetimePickerValue(date, includeSeconds){
                //toISOString 會得出一個中央時區既時間（timezone=0）
                //我地呢度算上時區，最後得出一個本地的時間
                date.setMinutes(date.getMinutes() - timezoneOffset);
                if(!includeSeconds){
                    date.setSeconds(0);
                    date.setMilliseconds(0);
                }
                return date.toISOString().split('.')[0];
            }

            fetchActivityConfig();
        }
    ]);