// 权限的常量
exports.AUTH_USER = 0;
exports.AUTH_GROUP_MANAGER = 1;
exports.AUTH_DEPART_MANAGER = 2;
exports.AUTH_MANAGER = 4;
exports.AUTH_SYS_MANAGER = 8;

// 用户角色的常量
exports.ROLE_NORMAL = 0;

// 一般访问者, 只有读权限
exports.ROLE_VISITOR = 1;

// 系统管理员, 超级管理员
exports.ROLE_MANAGER = 2;

exports.ROLE_FILE_CREATOR = 4;
exports.ROLE_FOLDER_CREATOR = 8;

exports.ROLE_GROUP_CREATOR = 16;
exports.ROLE_GROUP_MEMBER = 32;
exports.ROLE_GROUP_MANAGER = 64;

exports.ROLE_DEPARTMENT_CREATOR = 128;
exports.ROLE_DEPARTMENT_MEMBER = 256;
exports.ROLE_DEPARTMENT_MANAGER = 512;

// 备课组成员
exports.ROLE_PREPARE_MEMBER = 1024;

// ROLE_FOLDER_MANAGER === 系统管理员 | 超级管理员 | 小组管理员 | 部门管理员 | 文件夹创建者
exports.ROLE_FOLDER_MANAGER = exports.ROLE_MANAGER
        | exports.ROLE_GROUP_MANAGER
        | exports.ROLE_DEPARTMENT_MANAGER
        | exports.ROLE_FOLDER_CREATOR;

exports.ROLE_GROUPS_MANAGER = exports.ROLE_FOLDER_MANAGER;

// ROLE_FOLDER_MEMBER === 管理员们 | 小组成员 | 部门成员
exports.ROLE_FOLDER_MEMBER = exports.ROLE_FOLDER_MANAGER
        | exports.ROLE_GROUP_MEMBER
        | exports.ROLE_DEPARTMENT_MEMBER;

// 文件夹属性

exports.FOLDER_NORMAL = 0;

// 个人的私人文件夹
exports.FOLDER_PRIVATE = 1;
exports.FOLDER_GROUP = 2;

exports.FOLDER_DEPARTMENT = 4;
exports.FOLDER_DEPARTMENT_PUBLIC = 8;
exports.FOLDER_DEPARTMENT_PRIVATE = 16;
exports.FOLDER_DEPARTMENT_ROOT = 32;

exports.FOLDER_PREPARE = 64;
exports.FOLDER_SCHOOL = 128;

// group 属性, 0是学校 1是小组 2是部门 3是备课
exports.GROUP_SCHOOL = 0;
exports.GROUP_GROUP = 1;
exports.GROUP_DEPARTNMENT = 2;
exports.GROUP_PREPARE = 3;

