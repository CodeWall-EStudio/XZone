angular.module('ts.services.user', [
        'ts.utils.constants',
        'ts.services.utils'
    ])
    .service('UserService', [
        '$rootScope', '$http', 'UtilsService', 'BACKEND_SERVER', 'EVENT_LOGIN',
        function($rootScope, $http, UtilsService, BACKEND_SERVER, EVENT_LOGIN){
            function uid(){
                return UtilsService.cookie.get('uid');
            }

            function hasLoggedIn(){
                var uid = UtilsService.cookie.get('uid'),
                    skey = UtilsService.cookie.get('skey');
                return Boolean(uid && skey);
            }

            function isCreatorOfActivity(activity){
                var uid = UtilsService.cookie.get('uid'),
                    creator = activity.users.creator;
                return uid == creator;
            }

            function nick(){
                var s = localStorage['login_result'];
                var r = s ? JSON.parse(s) : {};
                return r ? r.nick : '';
            }

            function login(username, password, success, error){
                function handleResponse(data, status){
                    console.log('[UserService] login result:', data, status, document.cookie);
                    if(status == 200 && success){
                        localStorage['login_result'] = JSON.stringify(data);
                        success(data, status);
                    }
                    else if(error){
                        error(data, status);
                    }
                    $rootScope.$emit(EVENT_LOGIN, status, data);
                }
                $http.put(
                        BACKEND_SERVER + '/users/' + username + '/login',
                        'pwd=' + encodeURIComponent(password),
                        {
                            responseType: 'json',
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        }
                    )
                    .success(handleResponse)
                    .error(handleResponse);
            }

            function logout(){
                var d = (new Date()).toGMTString();
                document.cookie = 'uin=; path=/; expires=' + d;
                document.cookie = 'skey=; path=/; expires=' + d;
                localStorage.removeItem('login_result');
            }

            function fetchProfile(uid){

            }

            return {
                uid:            uid,
                hasLoggedIn:    hasLoggedIn,
                nick:           nick,
                login:          login,
                logout:         logout,
                fetchProfile:   fetchProfile,
                activity: {
                    isCreatorOfActivity: isCreatorOfActivity
                }
            };
        }
    ]);