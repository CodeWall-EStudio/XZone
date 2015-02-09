angular.module('ap.controllers.main', [
        'ts.services.activity',
        'ts.services.user',
        'ts.services.utils'
    ])
    .controller('PlayerMainController', [
        '$rootScope', '$scope', '$location', '$sce', 'ActivityService', 'UserService', 'UtilsService',
        function($rootScope, $scope, $location, $sce, ActivityService, UserService, UtilsService){
            var aid = $location.search()['aid'],
                autoRefreshTimeout = 0,
                player = document.getElementById('player');

            $rootScope.username = UserService.nick();
            $rootScope.userCount = 0;
            $rootScope.uploadedUsers = []; //上傳過資源的用戶
            $rootScope.rawResources = [];
            $rootScope.resources = [];
            $rootScope.presources = []; //previewable resources
            $rootScope.highlightResource = {g:-1, r:-1};
            $rootScope.profiles = {};

            $rootScope.selectedMainVideo = null; //已选择的主视频
            $rootScope.editingOrder = false; //编辑顺序模式
            $rootScope.editingTime = false; //编辑时间模式
            $rootScope.mainVideos = [];

            $scope.selectedUser = null;
            $scope.selectedResource = null;
            $scope.selectedRIndex = -1;
            $scope.autoRefresh = true;

            $scope.shouldShowUploadMainButton = false;

            $scope.newCommentContent = '';
            $scope.addingNewComment = false;

            $scope.submitNewComment = function(){
                //先加入当前活动，成不成功就先不管了
                joinActivity(function(){
                    //然后提交新评论
                    if(!$scope.addingNewComment && $scope.newCommentContent.length){
                        $scope.addingNewComment = true;

                        var xhr = new XMLHttpRequest(),
                            form = new FormData();
                        form.append('type', 0);
                        form.append('content', $scope.newCommentContent);
                        xhr.addEventListener('load', function(){
                            switch(xhr.status){
                                case 400: alert('请求有误，无法添加评论'); break;
                                case 404: alert('您是否已经加入了其他活动？请先在手机端退出其他活动才可以发表评论哦'); break;
                                case 500: alert('网络或服务器出错啦，请稍后再试'); break;
                                case 200:
                                case 201:
                                    getActivity();
                                    break;
                            }
                            $scope.addingNewComment = false;
                            $scope.newCommentContent = '';
                            $('#addCommentModal').modal('hide');
                        });
                        xhr.open('POST', '/activities/' + aid + '/resources');
                        xhr.send(form);
                    }
                });
            };
            function joinActivity(success){
                var xhr = new XMLHttpRequest();
                xhr.addEventListener('load', function(){
                    if(success) success();
                });
                xhr.open('POST', '/activities/' + aid + '/participators');
                xhr.send();
            }

            var dontNeedTimelineRepaint = false;

            $rootScope.updateMainVideos = function(videos){
                $rootScope.mainVideos = _.map(videos, function(video){
                    if(!video.url){
                        video.url = $sce.trustAsResourceUrl(video.src);
                    }
                    return video;
                });
                console.log('[MainVideos]', $rootScope.mainVideos);
            };

            $scope.$watch('selectedResource', function(newValue){
                if(newValue && newValue.type == 2){
                    setTimeout(function(){
                        var el = document.getElementById('videoPlayer');
                        el.src = newValue.content;
                    }, 100);
                }
            });

            $rootScope.uid2nick = function(uid){
                if($rootScope.profiles[uid]){
                    return $rootScope.profiles[uid].nick;
                }
                return uid;
            };

            //计算时间轴开始时间（也就是第一个资源上传的时间）
            $rootScope.timelineStartTime = function(){
                var group = _.last($rootScope.resources),
                    res = group ? _.last(group.resources) : undefined;
                return res ? res.date : 0;
            };

            $rootScope.selectedMainVideoStartTime = function(){
                var t = $rootScope.timelineStartTime();
                if($rootScope.selectedMainVideo){
                    t += $rootScope.selectedMainVideo.startTime*1000;
                }
                return t;
            };

            $rootScope.selectedMainVideoStopTime = function(){
                if($rootScope.selectedMainVideo){
                    return $rootScope.selectedMainVideoStartTime() + $rootScope.selectedMainVideo.duration*1000;
                }
                return 0;
            };

            $scope.selectMainVideo = function(video){
                player.pause();
                $rootScope.selectedMainVideo = video;

                if(video){
                    var date = new Date($rootScope.selectedMainVideoStartTime());
                    $rootScope.selectedMainVideoStartDate = {
                        y: date.getFullYear(),
                        M: date.getMonth()+1,
                        d: date.getDate(),
                        h: date.getHours(),
                        m: date.getMinutes(),
                        s: date.getSeconds()
                    };
                }
            };

            $scope.editMainVideoName = function(video){
                var newName = prompt('请输入“' + video.name + '”的新名称：');
                if(newName){
                    video.name = newName;
                    updateMainVideosInfo(
                        video._id,
                        {name: newName},
                        function(xhr, e, json){
                            console.log(xhr.status, json);
                        },
                        function(xhr, e){
                            console.error(xhr.status, e);
                        }
                    );
                }
            };

            $scope.removeMainVideo = function(video, i){
                if(confirm('确定删除主视频“' + video.name + '”?')){
                    $rootScope.mainVideos.splice(i, 1);
                    $rootScope.selectedMainVideo = $rootScope.mainVideos[0];
                    $rootScope.editingOrder = ($rootScope.mainVideos[0] != undefined);
                    $rootScope.editingTime = false;

                    var cgi = '/activities/' + aid + '/videos/' + video._id,
                        xhr = new XMLHttpRequest();
                    xhr.open('DELETE', cgi);
                    xhr.send();
                }
            };

            $scope.toggleVideoPlayer = function(){
                if(player.paused) player.play();
                else player.pause();
            };

            $scope.enterEditOrderMode = function(enter){
                $rootScope.editingOrder = enter;
                if(enter) player.pause();
                else $scope.updateMainVideosOrder();
            };

            $scope.enterEditTimeMode = function(video, save){
                $rootScope.editingTime = video ? true : false;
                if(video) $rootScope.selectedMainVideo = video;
                else if(save) $scope.updateMainVideoTiming();
            };

            $scope.updateMainVideosLocalOrder = function(index, up){
                var video = $rootScope.mainVideos.splice(index, 1)[0],
                    pos = up ? index - 1 : index + 1;
                $rootScope.mainVideos.splice(pos, 0, video);
            };

            $scope.updateMainVideosOrder = function(){
                updateMainVideosInfo(
                    $rootScope.mainVideos[0]['_id'],
                    {orders: _.map($rootScope.mainVideos, function(video){
                        return video['_id'];
                    }).join(',')},
                    function(xhr, e, json){
                        console.log(xhr.status, json);
                    },
                    function(xhr, e){
                        console.log(xhr.status, e);
                    }
                );
            };

            $scope.updateMainVideoTiming = function(){
                var beginning = $rootScope.timelineStartTime(),
                    beginDate = new Date(beginning),
                    date = new Date();
                date.setFullYear($rootScope.selectedMainVideoStartDate.y);
                date.setMonth($rootScope.selectedMainVideoStartDate.M-1);
                date.setDate($rootScope.selectedMainVideoStartDate.d);
                date.setHours($rootScope.selectedMainVideoStartDate.h);
                date.setMinutes($rootScope.selectedMainVideoStartDate.m);
                date.setSeconds($rootScope.selectedMainVideoStartDate.s);
                date.setMilliseconds(beginDate.getMilliseconds());

                var startTime = (date.getTime() - beginning)/1000;
                if(startTime >= 0){
                    $rootScope.selectedMainVideoStartDate = {
                        y: date.getFullYear(),
                        M: date.getMonth()+1,
                        d: date.getDate(),
                        h: date.getHours(),
                        m: date.getMinutes(),
                        s: date.getSeconds()
                    };
                    $rootScope.selectedMainVideo.startTime = startTime;
                    updateMainVideosInfo(
                        $rootScope.selectedMainVideo['_id'],
                        {startTime: startTime},
                        function(xhr, e, json){
                            console.log(xhr.status, json);
                        },
                        function(xhr, e){
                            console.error(xhr.status, e);
                        }
                    );
                }
                else {
                    alert('主视频开始录制时间必须晚于时间轴开始时间！');
                    var d = new Date($rootScope.selectedMainVideoStartTime());
                    $rootScope.selectedMainVideoStartDate = {
                        y: d.getFullYear(),
                        M: d.getMonth()+1,
                        d: d.getDate(),
                        h: d.getHours(),
                        m: d.getMinutes(),
                        s: d.getSeconds()
                    };
                }
            };

            function updateMainVideosInfo(vid, query, onData, onError){
                var cgi = '/activities/' + aid + '/videos/' + vid,
                    xhr = new XMLHttpRequest(),
                    form = new FormData();

                _.each(query, function(value, name){
                    form.append(name, value);
                });

                console.log('updating main videos', cgi, query);
                xhr.addEventListener('load', function(e){
                    if(onData) onData(xhr, e, JSON.parse(xhr.responseText));
                });
                xhr.addEventListener('error', function(e){
                    if(onError) onError(xhr, e);
                });
                xhr.open('PUT', cgi);
                xhr.send(form);
            }

            $scope.showResourceDetail = function(resource, g, r){
                $scope.highlightSpecifyResource(resource, g, r, true);
                //如果是正在播放主视频，就不需要显示资源预览了
                if(resource.type && !$rootScope.selectedMainVideo){
                    $scope.selectedResource = resource;
                    $scope.selectedRIndex = $rootScope.presources.indexOf(resource);
                }
            };

            $scope.highlightSpecifyResource = function(resource, groupIndex, resourceIndex, updatePlayTime){
                console.log('highlighting resource', groupIndex, resourceIndex);
                $rootScope.highlightResource = {g:groupIndex, r:resourceIndex};
                scrollToResource(resource, true, true);

                if(updatePlayTime && $rootScope.selectedMainVideo && resource){
                    var resourceTs = resource.date,
                        selectedMainVideoTs0 = $rootScope.selectedMainVideoStartTime(),
                        selectedMainVideoTs1 = selectedMainVideoTs0 + $rootScope.selectedMainVideo.duration;
                    console.log(resourceTs, selectedMainVideoTs0, selectedMainVideoTs1);
                    if(resourceTs < selectedMainVideoTs0) resourceTs = selectedMainVideoTs0;
                    else if(resourceTs > selectedMainVideoTs1) resourceTs = selectedMainVideoTs1;
                    player.currentTime = (resourceTs - selectedMainVideoTs0);
                    player.play();
                }
            };

            $scope.hasPreviousPreviewableResource = function(){
                return $scope.selectedRIndex > 0;
            };
            $scope.hasNextPreviewableResource = function(){
                return $scope.selectedRIndex < $rootScope.presources.length-1;
            };

            $scope.selectPreviousPreviewableResource = function(){
                if($scope.selectedRIndex > 0){
                    -- $scope.selectedRIndex;
                    $scope.selectedResource = $rootScope.presources[$scope.selectedRIndex];
                }
            };
            $scope.selectNextPreviewableResource = function(){
                if($scope.selectedRIndex < $rootScope.presources.length-1){
                    ++ $scope.selectedRIndex;
                    $scope.selectedResource = $rootScope.presources[$scope.selectedRIndex];
                }
            };

            $scope.filterByUser = function(uid){
                $scope.selectedUser = uid;

                $('.resourceGroup').css('display', 'none');
                setTimeout(function(){
                    //刷新webkit box的高度
                    $('.resourceGroup').css('display', '-webkit-box');
                    $scope.$digest();
                    refreshAllNextItemLineHeight();
                }, 0);
            };

            $scope.nextLineHeight = function(gindex, rindex){
                if(rindex){
                    var el = $('.resourceItem[data-gindex="' + gindex + '"][data-rindex="' + rindex + '"]'),
                        height = el.outerHeight();
                    return height ? height - 3 : 0;
                }
                return 0;
            };

            $scope.isFirstResourceInGroup = function(gindex, rindex){
                if(rindex == 0) return true;
                else {
                    //找出当前的资源节点
                    var selector = '.resourceItem[data-gindex="' + gindex + '"][data-rindex="' + rindex + '"]',
                        resourceEl = document.querySelector(selector);
                    if(resourceEl){
                        //找出其父节点和第一个可见的子节点
                        var groupEl = resourceEl.parentElement,
                            firstResourceEl = groupEl.querySelectorAll('.resourceItem:not(.ng-hide)')[0];
                        return resourceEl == firstResourceEl;
                    }
                    return false;
                }
            };

            $scope.resourceShouldBeVisible = function(resource){
                return (!$scope.selectedUser || $scope.selectedUser == resource.user);
            };

            $scope.groupContainsResourceOfSelectedUser = function(group){
                if(!$scope.selectedUser) return true;
                return _.some(group.resources, function(resource){
                    return resource.user == $scope.selectedUser;
                });
            };

            $scope.hideResourceDetail = function(){
                clearSelection();
            };

            $scope.toggleAuthRefresh = function(){
                $scope.autoRefresh = !$scope.autoRefresh;
                if($scope.autoRefresh){
                    getActivity();
                }
                else{
                    if(autoRefreshTimeout) {
                        clearTimeout(autoRefreshTimeout);
                        autoRefreshTimeout = 0;
                    }
                }
            };


            $scope.showUserStatistics = function(){
                $scope.stat = 2;

                //准备数据
                var stat = ActivityService.statistics.byUser($rootScope.activity, 10);
                stat = _.map(stat, function(item){
                    return {nick:$rootScope.uid2nick(item.uid), count:item.count};
                });
                console.log(stat);

                //开始绘制统计图
                AmCharts.makeChart('statBody', {
                    type: 'pie',
                    theme: 'light',
                    dataProvider: stat,
                    valueField: 'count',
                    titleField: 'nick'
                });
            };

            $scope.showTimeStatistics = function(){
                $scope.stat = 1;

                var stat = ActivityService.statistics.byTime($rootScope.activity),
                    beginning = stat.beginning,
                    items = stat.items;
                stat = _.map(items, function(resources, offset){
                    var date = new Date(parseInt(offset) + beginning),
                        dateStr = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + ' ' +
                                  date.getHours() + ':' + date.getMinutes();
                    return {date:dateStr, count:resources.length};
                });

                AmCharts.makeChart('statBody', {
                    type: 'serial',
                    theme: 'light',
                    dataProvider: stat,
                    valueAxes: [{
                        gridColor: '#FFFFFF',
                        gridAlpha: 0.2,
                        dashLength: 0,
                        labelsEnabled: false
                    }],
                    gridAboveGraphs: true,
                    startDuration: 1,
                    graphs: [{
                        balloonText: '[[category]]: <b>[[value]]</b>',
                        fillAlphas: 0.8,
                        lineAlpha: 0.2,
                        type: 'column',
                        valueField: 'count'
                    }],
                    chartCursor: {
                        categoryBalloonEnabled: false,
                        cursorAlpha: 0,
                        zoomable: false
                    },
                    categoryField: 'date',
                    categoryAxis: {
                        gridPosition: 'start',
                        gridAlpha: 0,
                        labelRotation: 45
                    }
                });
            };


            function clearSelection(){
                $scope.selectedResource = null;
                $scope.selectedRIndex = -1;
            }

            function getActivity(){
                ActivityService.getActivity(
                    aid,
                    function(data, status){
                        console.log('[PlayerMainController] get activity success', status, data);
                        if(status == 200 && !data.c){
                            $rootScope.profiles = data.profiles;
                            $rootScope.activity = data.r;
                            addFetchedResourcesToRootScope($rootScope.activity.resources);

                            $rootScope.updateMainVideos(data.r.videos || []);
                            /*if(!$rootScope.mainVideos.length){
                                $rootScope.mainVideos = $rootScope.updateMainVideos(data.r.videos || []);
                            }*/

                            if($rootScope.activity.active){
                                //计算用户数
                                $rootScope.userCount = $rootScope.activity.users.participators.length;

                                //如果是正在展示的活動，則固定每5s刷一次資源列表
                                if($scope.autoRefresh){
                                    autoRefreshTimeout = setTimeout(function(){
                                        getActivity();
                                    }, 5000);
                                }
                            }
                            else{
                                //计算用户数
                                var users = _.countBy($rootScope.activity.resources, function(resource){
                                    return resource.user;
                                });
                                $rootScope.userCount = _.keys(users).length;
                            }

                            $scope.shouldShowUploadMainButton = UserService.activity.isCreatorOfActivity($rootScope.activity);
                        }
                        else{
                            //TODO handle error
                        }
                    },
                    function(data, status){
                        //TODO handle server exception
                        console.error('[PlayerMainController] get activity fail', status, data);
                    }
                );
                console.log('[PlayerMainController] getting info of activity ' + aid);
            }

            function addFetchedResourcesToRootScope(resources){
                //过滤出新的资源
                var localLatestGroup = $rootScope.resources[0],
                    localLatestTs = localLatestGroup ? localLatestGroup.resources[0].date : 0,
                    newResources = _.filter(resources, function(resource){ return resource.date > localLatestTs; });
                console.log('new resources', newResources);
                for(var i=0; i<newResources.length; ++i)
                {
                    //计算新资源的时间戳（以每分钟为单位），把新资源插入到按分钟分组的资源分组里
                    var r = newResources[i],
                        d = new Date(r.date);
                    d.setSeconds(0);
                    d.setMilliseconds(0);
                    var ts = d.getTime();

                    if($rootScope.resources[0] && $rootScope.resources[0].ts == ts){
                        //如果新资源的时间戳和本地最新的资源分钟时间戳一样，则插入到该分组中
                        $rootScope.resources[0].resources.splice(0, 0, r);
                    }
                    else{
                        //否则插入一个新的分组
                        $rootScope.resources.splice(0, 0, {ts:ts, resources:[r]});
                    }

                    //单独过滤出图片和视频这些可以预览大图的资源，用来做上下翻页
                    if(r.type == 1 || r.type == 2){
                        $rootScope.presources.splice(0, 0, r);
                    }

                    //取出上傳資源的用戶
                    if($rootScope.uploadedUsers.indexOf(r.user) == -1){
                        $rootScope.uploadedUsers.push(r.user);
                        //TODO 排序？
                    }
                }


                console.log('resources', $rootScope.resources);
                console.log('presources', $rootScope.presources);
            }

            function findClosestResourceTimestamp(ts){
                //找出所有resource的时间戳，排序
                var timestamps = _.map($('.resourceItem'), function(item){
                    return parseInt(item.getAttribute('data-ts'));
                }).sort();

                //找出和ts最接近的时间戳，返回之
                for(var i=0; i<timestamps.length; ++i){
                    if(timestamps[i] >= ts){
                        return timestamps[i-1];
                    }
                }
                //否则返回最后一个时间戳
                return _.last(timestamps);
            }

            function initializeTimelineSync(){
                var video = document.querySelector('video');
                //監聽視頻的播放時間，找出時間軸上對應的資源
                video.addEventListener('timeupdate', function(e){
                    var ts = $rootScope.selectedMainVideoStartTime() + video.currentTime*1000,
                        closestResourceTs = findClosestResourceTimestamp(ts),
                        res = $('.resourceItem[data-ts=' + closestResourceTs + ']');
                    scrollToResourceElement(res, true);
                });
            }

            function scrollToResource(resource, compareIndex, dontHighlight){
                if(resource){
                    var res = $('.resourceItem[data-ts=' + resource.date + ']');
                    scrollToResourceElement(res, compareIndex, dontHighlight);
                }
            }

            function scrollToResourceElement(res, compareIndex, dontHighlight){
                if(!res) return;

                /*if(compareIndex){
                    var g = parseInt(res.attr('data-gindex')),
                        r = parseInt(res.attr('data-rindex'));
                    if($rootScope.highlightResource.g == g && $rootScope.highlightResource.r == r){
                        return;
                    }
                }*/

                var g = parseInt(res.attr('data-gindex')),
                    r = parseInt(res.attr('data-rindex')),
                    group = res.parents('.resourceGroup'),
                    gp = group.position(),
                    rp = res.position(),
                    gt = gp ? gp.top : 0,
                    rt = rp ? rp.top : 0,
                    timeline = $('#timeline');

                console.log(timeline.scrollTop(), gt, rt);
                timeline.scrollTop(timeline.scrollTop() + gt + rt);
                if(!dontHighlight){
                    $rootScope.$apply(function(){
                        $scope.highlightSpecifyResource(null, g, r);
                    });
                }

                res.width(res.width() + 1);
                setTimeout(function(){
                    res.width('auto');
                }, 100);
            }

            window.rs = $rootScope;
            window.utils = UtilsService;

            getActivity();
            initializeTimelineSync();
        }
    ]);


//圖片加載完成後，更新折線高度用的 //////////////////////////////////////////////////////////////////////////////////////////

/*function onImgLoad(e){
    var img = e.target,
        item = $(img).parents('.resourceItem')[0],
        gindex = parseInt(item.getAttribute('data-gindex')),
        rindex = parseInt(item.getAttribute('data-rindex'));
    updateNextItemLineHeight(gindex, rindex);
}

function updateNextItemLineHeight(gindex, rindex){
    var thisResourceItem = $('.resourceItem[data-gindex="' + gindex + '"][data-rindex="' + rindex + '"]'),
        nextLine = $('.resourceItem[data-gindex="' + gindex + '"][data-rindex="' + (rindex+1) + '"] .nextLine'),
        thisHeight = thisResourceItem.outerHeight();
    if(nextLine.length){
        nextLine.height(thisHeight - 3);
    }
}

function refreshAllNextItemLineHeight(){
    _.each(rs.resources, function(group, g){
        _.each(group.resources, function(item, r){
            if(item.type !== 0) updateNextItemLineHeight(g, r);
        });
    })
}*/