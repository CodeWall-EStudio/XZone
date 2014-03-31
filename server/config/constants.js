// 权限的常量
var i = 0;
exports.AUTH_USER = 0;
exports.AUTH_GROUP_MANAGER = Math.pow(2, i++);
exports.AUTH_DEPART_MANAGER = Math.pow(2, i++);
exports.AUTH_MANAGER = Math.pow(2, i++);
exports.AUTH_SYS_MANAGER = Math.pow(2, i++);

// 用户角色的常量
i = 0;
exports.ROLE_NORMAL = 0;
exports.ROLE_MANAGER = Math.pow(2, i++);
exports.ROLE_FILE_CREATOR = Math.pow(2, i++);
exports.ROLE_FOLDER_CREATOR = Math.pow(2, i++);
exports.ROLE_GROUP_CREATOR = Math.pow(2, i++);
exports.ROLE_GROUP_MEMBER = Math.pow(2, i++);
exports.ROLE_GROUP_MANAGER = Math.pow(2, i++);
exports.ROLE_DEPARTMENT_CREATOR = Math.pow(2, i++);
exports.ROLE_DEPARTMENT_MEMBER = Math.pow(2, i++);
exports.ROLE_DEPARTMENT_MANAGER = Math.pow(2, i++);
exports.ROLE_PREPARE_MEMBER = Math.pow(2, i++);

// 文件夹属性
i = 0;
exports.FOLDER_NORMAL = 0;
exports.FOLDER_GROUP = Math.pow(2, i++);
exports.FOLDER_DEPARTMENT = Math.pow(2, i++);
exports.FOLDER_DEPARTMENT_PUBLIC = Math.pow(2, i++);
exports.FOLDER_DEPARTMENT_PRIVATE = Math.pow(2, i++);
exports.FOLDER_PREPARE = Math.pow(2, i++);
exports.FOLDER_SCHOOL = Math.pow(2, i++);

// group 属性, 0是学校 1是小组 2是部门 3是备课
exports.GROUP_SCHOOL = 0;
exports.GROUP_GROUP = 1;
exports.GROUP_DEPARTNMENT = 2;
exports.GROUP_PREPARE = 3;

