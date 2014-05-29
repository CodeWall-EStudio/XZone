define(function(){

	var CGI_PATH = '/api/';

	return {

		cgi : {
			login : CGI_PATH + 'user/login',
			logout : CGI_PATH + 'user/logout'
		}

	}
});