document.domain = '71xiaoxue.com';

angular.module('ap.controllers.videoUploader', [
        'ts.services.activity',
        'ts.services.user'
    ])
    .controller('MainVideoUploaderController', [
        '$rootScope', '$scope', '$location', 'ActivityService', 'UserService', 'UtilsService',
        function($rootScope, $scope, $location, ActivityService, UserService, UtilsService)
        {
            var mainVideoInput = document.getElementById('mainVideoFile');

            $scope.skey = UtilsService.cookie.get('skey');

            reset();

            $scope.onSelectedFile = function(){
                $scope.$apply(function(){
                    var files = mainVideoInput.files,
                        file = files ? files[0] : null;
                    console.log('[uploader] selected file', file);

                    if(file && file.type.split('/')[0] == 'video'){
                        //load the file and get duration info
                        $scope.videoFile = file;
                        var video = document.createElement('video'),
                            url = window['URL']['createObjectURL'](file);

                        video.addEventListener('loadedmetadata', function(){
                            $scope.$apply(function(){
                                $scope.videoIsReading = false;
                                $scope.videoDuration = video.duration;
                                console.log('[uploader] video duration = ' + video.duration);
                            });
                        });
                        video.src = url;
                        $scope.videoIsReading = true;
                        console.log('[uploader] reading video file ...');
                    }
                    else {
                        alert('对不起，您所选择的文件格式不支持 ')
                        $scope.videoFile = null;
                        $scope.videoDuration = 0;
                    }
                });
            };

            $scope.startUpload = function(){
                //$scope.videoIsUploading = true;
                //document.querySelector('#uploadMainVideoForm').submit();
                uploadVideoFile();
            };

            $scope.cancelUpload = function(){
                if($scope.videoIsUploading || $scope.videoIsUploading){
                    if(!confirm('确定要取消上传主视频？')){
                        return;
                    }
                }
                clearAndCloseModal();
            };

            $scope.submitLabel = function(){
                if($scope.videoIsReading) return '请稍候';
                if($scope.videoIsUploading) return '上传中 (' + ($scope.videoUploadProgress || 0) + '%)';
                if($scope.videoIsAdding) return '添加中';
                return '添加';
            };

            function clearAndCloseModal(){
                $scope.$apply(function(){
                    reset();
                    $('#uploadMainVideoModal').modal('hide');
                });
            }

            function uploadVideoFile(){
                if($scope.videoFile && $scope.videoDuration && $scope.videoName){
                    //构造请求
                    var form = new FormData(),
                        xhr = new XMLHttpRequest(),
                        api = 'http://szone.71xiaoxue.com/upload';
                    form.append('skey', UtilsService.cookie.get('skey'));
                    form.append('file', $scope.videoFile);
                    form.append('name', $scope.videoName);
                    form.append('media', 1);
                    form.append('activityId', $location.search()['aid']);

                    //更新上传进度
                    xhr.upload.addEventListener('progress', function(e){
                        $scope.$apply(function(){
                            $scope.videoUploadProgress = Math.floor(e.loaded / e.total * 100);
                        });
                    }, false);

                    xhr.addEventListener('load', function(e){
                        $scope.videoIsUploading = false;
                        console.log(xhr.status, xhr.responseText);
                        try{
                            var json = JSON.parse(xhr.responseText),
                                fid = json['data']['fid'];
                            addVideoToActivity(fid);
                        }
                        catch(exception){

                        }
                        $scope.$digest();
                    }, false);

                    xhr.addEventListener('error', function(e){
                        console.log('[uploader] upload video error', e);
                        clearAndCloseModal();
                        alert('主视频上传失败！');
                    }, false);

                    //start uploading the file
                    $scope.videoIsUploading = true;
                    $scope.videoUploadProgress = 0;
                    xhr.withCredentials = true;
                    xhr.open('POST', api);
                    xhr.send(form);
                    console.log('[uploader] uploading video ...');
                }
            }

            //function addVideoToActivity(){
            function addVideoToActivity(fileID){
                $scope.videoIsUploading = false;
                console.log('上传视频结果：', fileID);
                if(!fileID){
                    alert('上传视频失败，请稍后再试')
                }
                else if(!$scope.videoName){
                    alert('上传视频失败，请输入有效的视频名字');
                }
                else {
                    $scope.videoURL = 'http://szone.71xiaoxue.com/api/media/download?fileId=' + fileID;

                    var aid = $location.search()['aid'],
                        form = new FormData(),
                        xhr = new XMLHttpRequest();

                    form.append('src', $scope.videoURL);
                    form.append('name', $scope.videoName);
                    form.append('duration', $scope.videoDuration);

                    xhr.addEventListener('load', function(e){
                        $scope.videoIsAdding = false;
                        if(xhr.status == 201){
                            var json = JSON.parse(xhr.responseText),
                                retCode = json ? json['c'] : -1,
                                activity = json ? json['r'] : null;
                            console.log('[uploader] add success', json);
                            if(!retCode && activity){
                                $('#uploadMainVideoModal').modal('hide');
                                $rootScope.updateMainVideos(activity.videos);
                            }
                        }
                        else {
                            //TODO handle other status code
                            alert('添加主视频失败 (' + xhr.status + ')');
                        }
                        $rootScope.$digest();
                    });
                    xhr.addEventListener('error', function(e){
                        console.log('[uploader] add video error', e);
                        //TODO alert
                        $scope.$apply(function(){
                            reset();
                        });
                    });
                    $scope.videoIsAdding = true;
                    xhr.open('POST', '/activities/' + aid + '/videos');
                    xhr.send(form);
                    console.log('[uploader] adding video to activity', aid);
                }
            }
            window.addVideoToActivity = addVideoToActivity;

            function reset(){
                //local file info
                $('#mainVideoFile').val(null);
                $scope.videoFile = null;
                $scope.videoName = null;
                $scope.videoDuration = 0;

                //upload status & result
                $scope.videoIsReading = false;
                $scope.videoIsUploading = false;
                $scope.videoIsAdding = false;
                $scope.videoUploadProgress = 0;
                $scope.videoURL = null;
            }

            window.$scope = $scope;
        }
    ]);