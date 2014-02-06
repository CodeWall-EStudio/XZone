define(function() {
	var CGI_PATH = '/api/',
		EXT = '';

	return {
		pagenum : 10,
		filetype : {
			1 : '图片',
			2 : '文档',
			3 : '音乐',
			4 : '视频',
			5 : '应用',
			6 : '压缩包',
			7 : '其他'
		},
		cgi : {
			//个人资料
			myinfo : '/cgi/myinfo.php',
			info : CGI_PATH+'user/login'+EXT,
			login : CGI_PATH+'user/gotoLogin'+EXT,
			varify : CGI_PATH+'user/verify'+EXT,
			logout : CGI_PATH+'user/logoff'+EXT,
			userlist : CGI_PATH+'user/list'+EXT,
			usearch : CGI_PATH+'user/search'+EXT,

			//文件操作
			upload : CGI_PATH+'file/upload'+EXT,
			filelist : CGI_PATH+'file/list'+EXT,
			filesearch : CGI_PATH+'file/search'+EXT,
			filereview : CGI_PATH+'file'+EXT,
			filedown : CGI_PATH+'file/download'+EXT,
			filemodify : CGI_PATH+'file/modify'+EXT,
			filecopy : CGI_PATH+'file/copy'+EXT,
			filemove : CGI_PATH+'file/move'+EXT,
			filedel : CGI_PATH+'file/delete'+EXT,
			fileshare : CGI_PATH+'file/share'+EXT,

			//文件夹
			foldinfo : CGI_PATH+'folder/info'+EXT,
			foldcreate : CGI_PATH+'folder/create'+EXT,
			foldmodify : CGI_PATH+'folder/modify'+EXT,
			foldlist : CGI_PATH+'folder/list'+EXT,
			foldsearch : CGI_PATH+'folder/search'+EXT,
			folddel : CGI_PATH+'folder/delete'+EXT,

			//文件收藏
			favcreate : CGI_PATH+'fav/create'+EXT,
			favlist : CGI_PATH+'fav/list'+EXT,
			favdel : CGI_PATH+'fav/del'+EXT,
			favsearch : CGI_PATH+'fav/search'+EXT,

			//回收站
			reclist : CGI_PATH+'recycle/list'+EXT,
			recrev : CGI_PATH+'recycle/revert'+EXT,
			recdel : CGI_PATH+'recycle/delete'+EXT,
			recsearch : CGI_PATH+'recycle/search'+EXT,

			//小组&部门
			groupcreate : CGI_PATH+'group/create'+EXT,
			groupmodify : CGI_PATH+'group/modify'+EXT,
			groupinfo : CGI_PATH+'group/info'+EXT,
			groupverify : CGI_PATH+'group/verify'+EXT,
			groupverlist : CGI_PATH+'group/verify/list'+EXT,

			//消息
			msgcreate : CGI_PATH+'message/create'+EXT,
			msgsearch : CGI_PATH+'message/search'+EXT,

			//留言板
			boardcreate : CGI_PATH+'board/create'+EXT,
			boardlist : CGI_PATH+'board/list'+EXT,
			boarddel : CGI_PATH+'board/delete'+EXT,
			boardverify : CGI_PATH+'board/verify'+EXT

		},
		msg : {
			100000 : '您还没有登录!',
			100001 : '您没有访问该资源的权限'
		}
	}
});