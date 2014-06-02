define(function(){

	var CGI_PATH = '/api/';

	return {
		pageNum : 10,
		cgi : {
			login : CGI_PATH + 'user/login',
			logout : CGI_PATH + 'user/logout',
			valid : CGI_PATH + 'user/validate',
			usersearch : CGI_PATH + 'user/search',

			deps : CGI_PATH + 'user/departments',

			create : CGI_PATH + 'manage/createUser',
			modify : CGI_PATH + 'manage/modifyUser',
			resetpwd : CGI_PATH + 'manage/resetUserPwd',

			info : CGI_PATH + 'user/info',
			umodify : CGI_PATH + 'user/modify',

			createorgan : CGI_PATH + 'organization/create',
			adduser : CGI_PATH + 'organization/addUser',
			removeuser : CGI_PATH + 'organization/removeUser',
			deleteuser : CGI_PATH + 'organization/delete',
			organmodify : CGI_PATH + 'organization/modify'
		}

	}
});