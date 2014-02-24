
// 默认每个用户的空间大小 3G
exports.DEFAULT_USER_SPACE = 3 * 1024 * 1024 * 1024;

// 需要转换成swf的文档类型配置
exports.DOC_TYPES = [
        'application/msword',
        'application/vnd.ms-word',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.openxmlformats-officedocument.presentationml.template',
        'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
        'application/kswps'
];

exports.PDF_TYPES = ['application/pdf'];


// 权限的常量
// 权限 0x0 普通 0x1 小组管理员 0x2 部门管理员 0x4 管理员 0x8 系统管理员
exports.AUTH_USER = 0x0;
exports.AUTH_GROUP_MANAGER = 0x1;
exports.AUTH_DEPART_MANAGER = 0x2;
exports.AUTH_MANAGER = 0x4;
exports.AUTH_SYS_MANAGER = 0x8;
