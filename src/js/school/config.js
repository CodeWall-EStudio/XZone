define(function() {
	var CGI_PATH = '/api/',
		EXT = '';//'.php';

	return {
		pagenum : 10,
		filetype : {
			0 : '全部类型',
			1 : '图片',
			2 : '文档',
			3 : '音乐',
			4 : '视频',
			5 : '应用',
			6 : '压缩包',
			7 : '其他',
			8 : 'txt文档'
		},
		cgi : {
			//个人资料
			getinfo : CGI_PATH+'user/',
			info : CGI_PATH+'user/login'+EXT,
			gotologin : CGI_PATH+'user/gotoLogin'+EXT,
			//login : CGI_PATH+'user/gotoLogin'+EXT,
			varify : CGI_PATH+'user/verify'+EXT,
			logout : CGI_PATH+'user/logoff'+EXT,
			userlist : CGI_PATH+'user/search'+EXT,
			usearch : CGI_PATH+'user/search'+EXT,
			departments : CGI_PATH+'user/departments'+EXT,
			info : CGI_PATH + 'user/info',
			umodify : CGI_PATH + 'user/modify',
			login : CGI_PATH + 'user/login',
			logout : CGI_PATH + 'user/logoff',
			valid : CGI_PATH + 'user/validate',

			create : CGI_PATH + 'manage/createUser',
			modify : CGI_PATH + 'manage/modifyUser',
			resetpwd : CGI_PATH + 'manage/resetUserPwd',

			orglist : CGI_PATH + 'organization/tree',
			createorgan : CGI_PATH + 'organization/create',
			adduser : CGI_PATH + 'organization/addUser',
			removeuser : CGI_PATH + 'organization/removeUser',
			orgdelete : CGI_PATH + 'organization/delete',
			organmodify : CGI_PATH + 'organization/modify',			

			//文件操作
			upload : '/upload'+EXT,
			filelist : CGI_PATH+'file/list'+EXT,
			filesearch : CGI_PATH+'file/search'+EXT,
			fileinfo : CGI_PATH+'file'+EXT,
			filedown : CGI_PATH+'file/download'+EXT,
			filemodify : CGI_PATH+'file/modify'+EXT,
			filecopy : CGI_PATH+'file/copy'+EXT,
			filemove : CGI_PATH+'file/move'+EXT,
			filedel : CGI_PATH+'file/delete'+EXT,
			fileshare : CGI_PATH+'file/share'+EXT,
			filesave : CGI_PATH+'file/save'+EXT,
			filereview : CGI_PATH+'file/preview'+EXT,	
			filequery : CGI_PATH+'file/query'+EXT,//order page pageNum type 1 查询我分享给小组的  groupid
			filestatus : CGI_PATH+'file/statistics'+EXT,
			mfilelist : CGI_PATH+'manage/listFiles',
			//batchDownload


			//文件夹
			foldinfo : CGI_PATH+'folder'+EXT,
			foldcreate : CGI_PATH+'folder/create'+EXT,
			foldmodify : CGI_PATH+'folder/modify'+EXT,
			foldlist : CGI_PATH+'folder/list'+EXT,
			foldsearch : CGI_PATH+'folder/search'+EXT,
			folddel : CGI_PATH+'folder/delete'+EXT,
			foldstatus : CGI_PATH+'folder/batchStatistics',


			//文件收藏
			favcreate : CGI_PATH+'fav/create'+EXT,
			favlist : CGI_PATH+'fav/list'+EXT,
			favdel : CGI_PATH+'fav/delete'+EXT,
			favsearch : CGI_PATH+'fav/search'+EXT,


			//回收站
			reclist : CGI_PATH+'recycle/list'+EXT,
			recrev : CGI_PATH+'recycle/revert'+EXT,
			recdel : CGI_PATH+'recycle/delete'+EXT,
			recsearch : CGI_PATH+'recycle/search'+EXT,

			//小组&部门
			groupcreate : CGI_PATH+'group/create'+EXT,
			groupmodify : CGI_PATH+'group/modify'+EXT,
			groupinfo : CGI_PATH+'group'+EXT,
			groupverify : CGI_PATH+'group/verify'+EXT,
			groupverlist : CGI_PATH+'group/verify/list'+EXT,

			//消息
			msgone : CGI_PATH+'message'+EXT,
			msgcreate : CGI_PATH+'message/create'+EXT,
			msgsearch : CGI_PATH+'message/search'+EXT,

			//空间组
			addsgroup : CGI_PATH+'sizegroup/create'+EXT,
			modifysgroup : CGI_PATH+'sizegroup/modify'+EXT,
			delsgroup : CGI_PATH+'sizegroup/delete'+EXT,
			sgrouplist : CGI_PATH+'sizegroup/search'+EXT,

			//留言板
			boardcreate : CGI_PATH+'board/create'+EXT,
			boardlist : CGI_PATH+'board/search'+EXT,
			boarddel : CGI_PATH+'board/delete'+EXT,
			boardverify : CGI_PATH+'board/verify'+EXT,

			//管理相关
			mlistgroup : CGI_PATH+'manage/listGroups'+EXT,
			mappgroup :　CGI_PATH+'manage/approveGroup'+EXT,
			mpreplist : CGI_PATH+'manage/listPrepares'+EXT,
			mnewgroup : CGI_PATH+'manage/createGroup'+EXT,
			mappfile : CGI_PATH+'manage/approveFile'+EXT,
			mstatic : CGI_PATH+'manage/statistics'+EXT,

			//用户 
			usersearch : CGI_PATH+'user/search'+EXT,
			usermodify : CGI_PATH+'manage/modifyUser'+EXT,

			//日志
			logsearch : CGI_PATH+'log/search'+EXT,
			

			//存储
			getstorge : CGI_PATH+'storage'+EXT,
			setstorge : CGI_PATH+'storage/set'+EXT

		},
		grade : {
			1 : '一年级',
			2 : '二年级',
			3 : '三年级',
			4 : '四年级',
			5 : '五年级',
			6 : '六年级'					
		},
		tag : {
			1 : '语文',
			2 : '数学',
			3 : '英语',
			4 : '体育',
			5 : '音乐',
			6 : '美术',
			7 : '科学',
			8 : '综合实践',
			9 : '信息技术'
		},
		msg : {
			0 : '操作成功!',
			10: '排序序号必须填写',
			11 : '组织名称必须填写',
			20 : '新密码和重复密码必须一致',
			21 : '请填写用户名和密码!',
			22 : '用户不存在',
			30 : '组织最多支持3级!', 
			50 : '你要上传的文件已经超过你的剩余空间!',
			60 : '你还没有选择要共享的目录',
			75 : '序号只能在1~99之间',
			76 : '名称不能少于2个字',
			77 : '参数不能为空',
			78 : '对不起，网络超时了，请稍后再试',
			79 : '已经有同名的项目了',
			100 : '对不起，您没有这个操作权限!',//后台出错啦!
			101 : '出错啦',
			1001 : '您还没有登录!',
			1004 : '没有找到资源!',
			1010 : '您没有查看该资源的权限!',
			1011 : '参数出错啦!',
			1013 : '出错啦',
			1014 : '同名啦,请修改名称!',
			1015 : '已经归档啦!',
			1016 : '该资源不能删除',
			1017 : '该目录下还有其他文件，无法删除!',
			1041 : '用户名或密码错误!',
			1043 : '用户不存在!',
			1050 : '时间交叉了!'
		}
	}
// module.exports = exports = {
//     SERVER_ERROR: 100,
//     NOT_SUPPORT: 101,

//     NOT_LOGIN: 1001,
//     TICKET_ERROR: 1002,
//     SKEY_EXPIRE: 1003,

//     NOT_FOUND: 1004,

//     NOT_AUTH: 1010,
//     PARAM_ERROR: 1011,
    
//     SPACE_FULL: 1013,
//     DUPLICATE: 1014,
//     NOT_MATCH: 1015,


//     SUCCESS: 0
// }
	
});