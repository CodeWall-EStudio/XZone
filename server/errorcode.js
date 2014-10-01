
module.exports = exports = {

    SERVER_ERROR: 100, // 服务器端错误
    NOT_SUPPORT: 101, // 不支持该Http方法, 如定义为POST的接口, 用GET方式调用了

    MEDIA_SUCCESS: 200, // 新媒体的成功码是 200

    NOT_LOGIN: 1001, // 没有登录
    TICKET_ERROR: 1002, // sso 登录的ticket验证出错
    SKEY_EXPIRE: 1003, // 登陆态过期了

    NOT_FOUND: 1004, // 没有找到[文件,小组,用户等]

    NOT_AUTH: 1010, // 没有权限调用该接口或没有权限访问[文件,文件夹,小组等]
    PARAM_ERROR: 1011, // 参数错误, 前端传给后台的参数格式不对, 或者参数值不对
    
    SPACE_FULL: 1013, // 空间满了, 超过限额了
    DUPLICATE: 1014, // [文件,文件夹,小组]重名了

    UNMODIFABLE: 1015,// 不能修改, 可能是被归档了
    UNDELETABLE: 1016, // 不能删除, 可能为文件夹被保护等, 如:多媒体的上传目录不能删除
    NOT_EMPTY: 1017, // 该目录是非空目录, 可能出现在删除小组目录时, 目录中有其他人创建的文件/文件夹, 此时无法删除

    FORBIDDEN: 1018, // 被禁止访问接口

    UNINSERTABLE: 1019, // 禁止添加

    LOGIN_FAILURE: 1040, // 登录失败
    ACCOUNT_ERROR: 1041, // 用户名或密码错误
    PASSWORD_ERROR: 1042, // 密码错误
    ACCOUNT_CLOSE: 1043, // 账号被关闭了

    TIME_DUPLICATE: 1050, // 创建学年时, 时间交叉了

    SUCCESS: 0
};