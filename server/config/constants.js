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

// 一般访问者, 只有读权限
exports.ROLE_VISITOR = Math.pow(2, i++);

// 系统管理员, 超级管理员
exports.ROLE_MANAGER = Math.pow(2, i++);

exports.ROLE_FILE_CREATOR = Math.pow(2, i++);
exports.ROLE_FOLDER_CREATOR = Math.pow(2, i++);

exports.ROLE_GROUP_CREATOR = Math.pow(2, i++);
exports.ROLE_GROUP_MEMBER = Math.pow(2, i++);
exports.ROLE_GROUP_MANAGER = Math.pow(2, i++);

exports.ROLE_DEPARTMENT_CREATOR = Math.pow(2, i++);
exports.ROLE_DEPARTMENT_MEMBER = Math.pow(2, i++);
exports.ROLE_DEPARTMENT_MANAGER = Math.pow(2, i++);

// 备课组成员
exports.ROLE_PREPARE_MEMBER = Math.pow(2, i++);

// ROLE_FOLDER_MANAGER === 系统管理员 | 超级管理员 | 小组管理员 | 部门管理员
exports.ROLE_FOLDER_MANAGER = exports.ROLE_MANAGER
        | exports.ROLE_GROUP_MANAGER
        | exports.ROLE_DEPARTMENT_MANAGER;

exports.ROLE_GROUPS_MANAGER = exports.ROLE_FOLDER_MANAGER;

// ROLE_FOLDER_MEMBER === 管理员们 | 文件夹创建者 | 小组成员 | 部门成员
exports.ROLE_FOLDER_MEMBER = exports.ROLE_FOLDER_MANAGER
        | exports.ROLE_FOLDER_CREATOR
        | exports.ROLE_GROUP_MEMBER
        | exports.ROLE_DEPARTMENT_MEMBER;

// 文件夹属性
i = 0;
exports.FOLDER_NORMAL = 0;

// 个人的私人文件夹
exports.FOLDER_PRIVATE = Math.pow(2, i++);
exports.FOLDER_GROUP = Math.pow(2, i++);

exports.FOLDER_DEPARTMENT = Math.pow(2, i++);
exports.FOLDER_DEPARTMENT_PUBLIC = Math.pow(2, i++);
exports.FOLDER_DEPARTMENT_PRIVATE = Math.pow(2, i++);
exports.FOLDER_DEPARTMENT_ROOT = Math.pow(2, i++);

exports.FOLDER_PREPARE = Math.pow(2, i++);
exports.FOLDER_SCHOOL = Math.pow(2, i++);

// group 属性, 0是学校 1是小组 2是部门 3是备课
exports.GROUP_SCHOOL = 0;
exports.GROUP_GROUP = 1;
exports.GROUP_DEPARTNMENT = 2;
exports.GROUP_PREPARE = 3;

