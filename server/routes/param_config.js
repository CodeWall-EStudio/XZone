

module.exports = {
    // file 
    '/api/file': { // 获取文件信息
        method: 'GET',
        params: [
            {
                name: 'fileId',
                type: 'file',
                required: true
            }
        ]
    },
    '/api/file/upload': { // 上传文件
        method: 'POST',
        params: [
            {
                name: 'name',
                required: true
            },
            {
                name: 'folderId',
                type: 'folder',
                required: true
            },
            {
                name: 'file_path'
            },
            {
                name: 'file_name'
            },
            {
                name: 'file_md5'
            },
            {
                name: 'file_content_type'
            },
            {
                name: 'file_size'
            }
        ]
    },
    '/api/file/download': { // 下载文件
        method: 'GET',
        params: [
            {
                name: 'fileId',
                type: 'file',
                required: true
            }
        ]
    },
    '/api/file/batchDownload': { // 批量下载
        method: 'POST',
        params: [
            {
                name: 'fileId', // fileId 必须为文件id 的数组
                type: '[file]',
                required: true
            }
        ]
    },
    '/api/file/preview': { // 预览
        method: 'GET',
        params: [
            {
                name: 'fileId',
                type: 'file'
            },
            {
                name: 'messageId',
                type: 'message'
            },
            {
                name: 'size', // 指定图片的预览图大小, 只有格式为图片时有用
                type: 'string'
            }
        ]
    },
    '/api/file/save': { // 保存收件箱的文件到自己的目录
        method: 'POST',
        params: [
            {
                name: 'messageId',
                type: 'message',
                required: true
            },
            {
                name: 'folderId', // 如果指定了这个值, 就保存到对应的目录
                type: 'folder'
            }
        ]
    },
    '/api/file/modify': {// 修改文件
        method: 'POST',
        params: [
            {
                name: 'fileId',
                type: 'file',
                required: true
            },
            {
                name: 'name',
                type: 'string'
            },
            {
                name: 'mark'
            },
            {
                name: 'content'
            }
        ]
    },
    '/api/file/copy': { // 批量复制文件
        method: 'POST',
        params: [
            {
                name: 'fileId',
                type: '[file]',
                required: true
            },
            {
                name: 'targetId',
                type: 'folder',
                required: true
            }
        ]
    },
    '/api/file/move': { // 批量移动文件
        method: 'POST',
        params: [
            {
                name: 'fileId',
                type: '[file]',
                required: true
            },
            {
                name: 'targetId',
                type: 'folder',
                required: true
            }
        ]
    },
    '/api/file/share': { // 批量共享文件给个人或小组, toUserId和 toGroupId中必须有且只有一个
        method: 'POST',
        params: [
            {
                name: 'fileId',
                type: '[file]',
                required: true
            },
            {
                name: 'toUserId',
                type: '[user]'
            },
            {
                name: 'toGroupId',
                type: '[group]'
            },
            {
                name: 'toFolderId',
                type: '[folder]'
            }
        ]
    },
    '/api/file/delete': { // 批量删除文件, 该操作不会真正删除文件, 而是放到回收站 method: 'POST',
        method: 'POST',
        params: [
            {
                name: 'fileId',
                type: '[file]',
                required: true
            }
        ]
    },
    '/api/file/search': { // 搜索文件
        method: 'GET',
        params: [
            {
                name: 'folderId',
                type: 'folder',
                required: true
            },
            {
                name: 'page',
                type: 'number',
                min: 0,
                required: true
            },
            {
                name: 'pageNum',
                type: 'number',
                min: 0,
                required: true
            },
            {
                name: 'keyword'
            },
            {
                name: 'creatorId', // 文件创建者
                type: 'user'
            },
            {
                name: 'type',
                min: 0,
                type: 'number'
            },
            {
                name: 'order', // 排序规则如: { createTime: -1 }
                type: 'object'
            },
            {
                name: 'status',
                type: 'number'
            }
        ]
    },
    '/api/file/query': { // 查询所有自己共享出去的文件
        method: 'GET',
        params: [
            {
                name: 'page',
                type: 'number',
                required: true
            },
            {
                name: 'pageNum',
                type: 'number',
                required: true
            },
            {
                name: 'groupId',
                type: 'group'
            },
            {
                name: 'cate',
                type: 'number'
            },
            {
                name: 'type',
                type: 'number'
            },
            {
                name: 'order',
                type: 'object'
            }
        ]
    },
    '/api/file/statistics': { // 统计指定文件夹下的文件个数, 类型和大小
        method: 'GET',
        params: [
            {
                name: 'folderId',
                type: 'folder',
                required: true
            }
        ]
    },

    // media
    '/api/media/upload': {
        method: 'POST',
        params: [
            {
                name: 'name',
                type: 'string',
                required: true
            },
            {
                name: 'activityId',
                type: 'string',
                required: true
            },
            {
                name: 'activityName',
                type: 'string'
            },
            {
                name: 'activityTime',
                type: 'string'
            },
            {
                name: 'file_path'
            },
            {
                name: 'file_name'
            },
            {
                name: 'file_md5'
            },
            {
                name: 'file_content_type'
            },
            {
                name: 'file_size'
            }
        ]
    },
    '/api/media/download': {
        method: 'GET',
        params: [
            {
                name: 'fileId',
                type: 'file',
                required: true
            }
        ]
    },

    // folder
    '/api/folder': {
        method: 'GET',
        params: [
            {
                name: 'folderId',
                type: 'folder',
                required: true
            }
        ]
    },
    '/api/folder/create': {
        method: 'POST',
        params: [
            {
                name: 'folderId',
                type: 'folder',
                required: true
            },
            {
                name: 'name',
                type: 'string',
                required: true
            },
            {
                name: 'closeTime',
                type: 'number',
                min: 0
            },
            {
                name: 'isOpen',
                type: 'number'
            },
            {
                name: 'isReadonly',
                type: 'number'
            }
        ]
    },
    '/api/folder/modify': {
        method: 'POST',
        params: [
            {
                name: 'folderId',
                type: 'folder',
                required: true
            },
            {
                name: 'name',
                type: 'string'
            },
            {
                name: 'mark',
                type: 'string'
            }
        ]
    },
    '/api/folder/delete': {
        method: 'POST',
        params: [
            {
                name: 'folderId',
                type: '[folder]',
                required: true
            }
        ]
    },
    '/api/folder/list': {
        method: 'GET',
        params: [
            {
                name: 'folderId',
                type: 'folder',
                required: true
            },
            {
                name: 'page',
                type: 'number'
            },
            {
                name: 'pageNum',
                type: 'number'
            },
            {
                name: 'creatorId', // 文件创建者
                type: 'user'
            },
            {
                name: 'order',
                type: 'object'
            }
        ]
    },
    '/api/folder/search': {
        method: 'GET',
        params: [
            {
                name: 'folderId',
                type: 'folder',
                required: true
            },
            {
                name: 'page',
                type: 'number',
                required: true
            },
            {
                name: 'pageNum',
                type: 'number',
                required: true
            },
            {
                name: 'keyword'
            },
            {
                name: 'creatorId', // 文件创建者
                type: 'user'
            },
            {
                name: 'type',
                type: 'number'
            },
            {
                name: 'order',
                type: 'object'
            }
        ]
    },
    '/api/folder/statistics': { // 统计制定文件夹下面又多少个子文件夹
        method: 'GET',
        params: [
            {
                name: 'folderId',
                type: 'folder',
                required: true
            }
        ]
    },
    '/api/folder/batchStatistics': { // 批量统计制定文件夹下面又多少个子文件夹
        method: 'GET,POST',
        params: [
            {
                name: 'folderId',
                type: '[folder]',
                required: true
            }
        ]
    },

    // fav
    '/api/fav/create': {
        method: 'POST',
        params: [
            {
                name: 'fileId',
                type: '[file]',
                required: true
            },
            {
                name: 'groupId',
                type: 'group'
            }
        ]
    },
    '/api/fav/delete': {
        method: 'POST',
        params: [
            {
                name: 'fileId',
                type: '[file]',
                required: true
            }
        ]
    },
    '/api/fav/search': {
        method: 'GET',
        params: [
            {
                name: 'page',
                type: 'number',
                required: true
            },
            {
                name: 'pageNum',
                type: 'number',
                required: true
            },
            {
                name: 'keyword'
            },
            {
                name: 'type',
                type: 'number'
            },
            {
                name: 'order',
                type: 'object'
            }
        ]
    },

    // group
    '/api/group': {
        method: 'GET',
        params: [
            {
                name: 'groupId',
                type: 'group',
                required: true
            }
        ]
    },
    '/api/group/create': {
        method: 'POST',
        params: [
            {
                name: 'name',
                type: 'string',
                required: true
            },
            {
                name: 'sizegroupId', // 指定所属的空间组
                type: 'sizegroup'
            },
            {
                name: 'type',
                type: 'number'
            },
            {
                name: 'content',
                type: 'string'
            },
            {
                name: 'parentId',
                type: 'group'
            },
            {   name: 'members',
                type: '[user]'
            },
            {
                name: 'managers',
                type: '[user]'
            },
            {
                name: 'pt',
                type: 'number'
            },
            {
                name: 'startTime', // 学年开始时间
                type: 'number'
            },
            {
                name: 'endTime', // 学年结束时间
                type: 'number'
            },
            {
                name: 'tag'
            },
            {
                name: 'grade'
            },
            {
                name: 'archivable', // 是否可归档, 创建后不可修改
                type: 'boolean',
                'default': false
            },
            {
                name: 'order', // 排序号, 默认 0, 优先排序
                type: 'number',
                'default': 0
            }
        ]
    },
    '/api/group/modify': {
        method: 'POST',
        params: [
            {
                name: 'groupId',
                type: 'group',
                required: true
            },
            {
                name: 'sizegroupId', // 指定所属的空间组
                type: 'sizegroup'
            },
            {
                name: 'name',
                type: 'string'
            },
            {
                name: 'content',
                type: 'string'
            },
            {   name: 'members',
                type: '[user]'
            },
            {
                name: 'managers',
                type: '[user]'
            },
            {
                name: 'startTime', // 学年开始时间
                type: 'number'
            },
            {
                name: 'endTime', // 学年结束时间
                type: 'number'
            },
            {
                name: 'status', // 状态: 0 已审核, 1 审核中, 2 已归档, 3 已关闭, 4 已删除; 需要 group 管理员以上权限
                type: 'number'
            },
            {
                name: 'order', // 排序号, 默认 0, 优先排序
                type: 'number',
                'default': 0
            },
            {
                name: 'tag'
            },
            {
                name: 'grade'
            }
        ]
    },
    '/api/group/list': {
        method: 'GET',
        params: []
    },

    // user
    '/api/user': {
        method: 'GET',
        params: []
    },

    '/api/user/login': {
        method: 'POST',
        params: [
            {
                name: 'name',
                type: 'string',
                required: true
            },
            {
                name: 'pwd',
                type: 'string',
                required: true
            },
            {
                name: 'json',
                type: 'boolean'
            }
        ]
    },

    '/api/user/info': {
        method: 'GET',
        params: [
            {
                name: 'userId',
                type: 'user',
                required: true
            }
        ]
    },

    '/api/user/gotoLogin': {
        method: 'GET',
        params: [
            {
                name: 'type'
            }
        ]
    },

    '/api/user/validate': {
        method: 'GET',
        params: [
            {
                name: 'skey'
            }
        ]
    },

    '/api/user/loginSuccess': {
        method: 'GET',
        params: [
            {
                name: 'ticket',
                required: true
            }
        ]
    },
    '/api/user/loginSuccessWithQQ': {
        method: 'GET',
        params: [
            {
                name: 'code',
                required: true
            },
            {
                name: 'state',
                required: true
            }
        ]
    },
    '/api/user/logoff': {
        method: 'GET',
        params: [
            {
                name: 'json',
                type: 'boolean'
            }
        ]
    },
    
    '/api/user/departments': {
        method: 'GET',
        params: [
        ]
    },
    '/api/user/modify': { // 只能修改自己的
        method: 'POST',
        params: [
            {
                name: 'nick'
            },
            {
                name: 'pwd'
            },
            {
                name: 'newPwd'
            }
        ]
    },
    '/api/user/search': {
        method: 'GET',
        params: [
            {
                name: 'page',
                type: 'number'
            },
            {
                name: 'pageNum',
                type: 'number'
            },
            {
                name: 'keyword'
            },
            {
                name: 'order',
                type: 'object'
            }
        ]
    },

    // recycle
    '/api/recycle/delete': {
        method: 'POST',
        params: [
            {
                name: 'fileId',
                type: '[file]',
                required: true
            },
            {
                name: 'groupId',
                type: 'group'
            }
        ]

    },
    '/api/recycle/revert': {
        method: 'POST',
        params: [
            {
                name: 'fileId',
                type: '[file]',
                required: true
            },
            {
                name: 'groupId',
                type: 'group'
            }
        ]

    },
    '/api/recycle/search': {
        method: 'GET',
        params: [
            {
                name: 'page',
                type: 'number',
                required: true
            },
            {
                name: 'pageNum',
                type: 'number',
                required: true
            },
            {
                name: 'groupId',
                type: 'group'
            },
            {
                name: 'keyword'
            },
            {
                name: 'type',
                type: 'number'
            },
            {
                name: 'order',
                type: 'object'
            }
        ]
    },

    // board
    '/api/board/create': {
        method: 'POST',
        params: [
            {
                name: 'content',
                required: true
            },
            {
                name: 'groupId',
                type: 'group',
                required: true
            },
            {
                name: 'parentId',
                type: 'board'
            },
            {
                name: 'resourceId',
                type: 'resource'
            }
        ]
    },
    '/api/board/approve': {
        method: 'POST',
        params: [
            {
                name: 'boardId',
                type: 'board',
                required: true
            },
            {
                name: 'validateText',
                type: 'string'
            },
            {
                name: 'validateStatus',
                type: 'number',
                required: true
            }
        ]
    },
    '/api/board/delete': {
        method: 'POST',
        params: [
            {
                name: 'boardId',
                type: 'board',
                required: true
            }
        ]
    },
    '/api/board/search': {
        method: 'GET',
        params: [
            {
                name: 'page',
                type: 'number',
                required: true
            },
            {
                name: 'pageNum',
                type: 'number',
                required: true
            },
            {
                name: 'groupId',
                type: 'group',
                required: true
            },
            {
                name: 'keyword'
            },
            {
                name: 'type',
                type: 'number'
            },
            {
                name: 'order',
                type: 'object'
            }
        ]
    },

    // message 
    '/api/message': {
        method: 'GET',
        params: [
            {
                name: 'messageId',
                type: 'message',
                required: true
            }
        ]
    },
    '/api/message/search': {
        method: 'GET',
        params: [
            {
                name: 'page',
                type: 'number',
                required: true
            },
            {
                name: 'pageNum',
                type: 'number',
                required: true
            },
            {
                name: 'cate',
                type: 'number',
                required: true
            },
            {
                name: 'keyword'
            },
            {
                name: 'type',
                type: 'number'
            },
            {
                name: 'order',
                type: 'object'
            }
        ]
    },


    // manage
    '/api/manage/listGroups': {
        method: 'GET',
        params: [
            {
                name: 'page',
                type: 'number',
                required: true
            },
            {
                name: 'pageNum',
                type: 'number',
                required: true
            },
            {
                name: 'order',
                type: 'object'
            },
            {
                name: 'status',
                type: 'number'
            },
            {
                name: 'type',
                type: 'number'
            },
            {
                name: 'keyword',
                type: 'string'
            },
            {
                // parent = true 返回有 parent 的
                // parent=false, 返回没有 parent 的
                // 不传 parent, 返回所有的
                name: 'parent',
                type: 'boolean'
            }
        ]
    },
    '/api/manage/approveGroup': {
        method: 'POST',
        params: [
            {
                name: 'groupId',
                type: 'group',
                required: true
            },
            {
                name: 'validateText',
                type: 'string'
            },
            {
                name: 'validateStatus',
                type: 'number',
                required: true
            }
        ]
    },
    '/api/manage/listPrepares': {
        method: 'GET',
        params: [
            {
                name: 'fetchChild', // 为 true 则返回每个学年下的课程和年纪
                type: 'boolean'
            }
        ]
    },
    '/api/manage/approveFile': {
        method: 'POST',
        params: [
            {
                name: 'fileId',
                type: 'file',
                required: true
            },
            {
                name: 'validateText',
                type: 'string'
            },
            {
                name: 'validateStatus',
                type: 'number',
                required: true
            }
        ]
    },
    '/api/manage/listFiles': {
        method: 'GET',
        params: [
            {
                name: 'page',
                type: 'number',
                required: true
            },
            {
                name: 'pageNum',
                type: 'number',
                required: true
            },
            {
                name: 'order',
                type: 'object'
            }
        ]
    },
    '/api/manage/modifyUser': {
        method: 'POST',
        params: [
            {
                name: 'userId',
                type: 'user',
                required: true
            },
            {
                name: 'sizegroupId',
                type: 'sizegroup'
            },
            {
                name: 'status',
                type: 'number'
            },
            {
                name: 'nick',
                type: 'string'
            },
            {
                name: 'auth',
                type: 'number'
            }
        ]
    },
    '/api/manage/createUser': {
        method: 'POST',
        params: [
            {
                name: 'name',
                type: 'string',
                required: true
            },
            {
                name: 'sizegroupId',
                type: 'sizegroup',
                required: true
            },
            {
                name: 'nick',
                type: 'string',
                required: true
            }
        ]
    },
    '/api/manage/resetUserPwd': {
        method: 'POST',
        params: [
            {
                name: 'userId',
                type: 'user',
                required: true
            }
        ]
    },

    // storage 
    '/api/storage': { // 通用存储接口
        method: 'GET',
        params: [
            {
                name: 'key',
                type: 'string',
                required: true
            }
        ]
    },
    '/api/storage/set': { // 限制为系统管理员
        method: 'POST',
        params: [
            {
                name: 'key',
                type: 'string',
                required: true
            },
            {
                name: 'value',
                type: 'string',
                required: true
            }
        ]
    },

    // sizegroup 空间组相关
    '/api/sizegroup/create': { // 添加空间组
        method: 'POST',
        params: [
            {
                name: 'name',
                type: 'string',
                required: true
            },
            {
                name: 'type',// 0 个人, 1 小组
                type: 'number',
                min: 0,
                required: true
            },
            {
                name: 'size',
                type: 'number',
                min: 0,
                required: true
            },
            {
                name: 'isDefault',
                type: 'boolean'
            }
        ]
    },
    '/api/sizegroup/modify': { // 修改后会同步到所有用到这个sizegroup 的用户
        method: 'POST',
        params: [
            {
                name: 'sizegroupId',
                type: 'sizegroup',
                required: true
            },
            {
                name: 'size',
                type: 'number'
            },
            {
                name: 'name',
                type: 'string'
            },
            {
                name: 'isDefault',
                type: 'boolean'
            }
        ]
    },
    '/api/sizegroup/delete': { // 如果有人在用, 就不能删除; 不能删除默认空间组
        method: 'POST',
        params: [
            {
                name: 'sizegroupId',
                type: 'sizegroup',
                required: true
            }
        ]
    },
    '/api/sizegroup/search': {
        method: 'GET',
        params: [
            {
                name: 'keyword', // 搜索 name 字段, 可选
                type: 'string'
            },
            {
                name: 'page',
                type: 'number'
            },
            {
                name: 'pageNum',
                type: 'number'
            },
            {
                name: 'order',
                type: 'object'
            }
        ]
    },

    '/api/log/search': {
        method: 'GET',
        params: [
            {
                name: 'page',
                type: 'number'
            },
            {
                name: 'pageNum',
                type: 'number'
            },
            {
                name: 'order',
                type: 'object'
            },
            {
                name: 'startTime',
                type: 'number'
            },
            {
                name: 'endTime',
                type: 'number'
            },
            {
                name: 'fileName',
                type: 'string'
            },
            //加上来源用户和来源小组 一次只需要用一个
            {
                name: 'fromUserId',
                type: 'string'
            },
            {
                name: 'fromGroupId',
                type: 'string'
            },
            {
                //操作类型 1: 上传, 2: 下载, 3: copy, 4: move, 5: modify
                //6: delete 7: 预览 8: 保存, 9: 分享给用户 10: 分享给小组, 
                //11: delete(移动到回收站) 12: 创建文件夹
                name: 'type',
                type: '[number]'
            },
            {
                name: 'fromGroupType',
                type: 'number'
            }
        ]
    },

    // organization
    '/api/organization/create': {
        method: 'POST',
        params: [{
            name: 'name',
            required: true
        },{
            name: 'order',
            type: 'number',
            required: true
        },{
            name: 'parentId',
            type: 'department',
            required: true
        }]
    },

    '/api/organization/modify': {
        method: 'POST',
        params: [
            {
                name: 'organizationId',
                type: 'department',
                required: true
            },{
                name: 'name'
            },{
                name: 'order',
                type: 'number'
            }
        ]
    },

    '/api/organization/delete': {
        method: 'POST',
        params: [
            {
                name: 'organizationId',
                type: 'department',
                required: true
            }
        ]
    },

    '/api/organization/addUser': {
        method: 'POST',
        params: [{
            name: 'userId',
            type: 'user',
            required: true
        },{
            name: 'organizationId',
            type: 'department',
            required: true
        }]
    },

    '/api/organization/removeUser': {
        method: 'POST',
        params: [{
            name: 'userId',
            type: 'user',
            required: true
        },{
            name: 'organizationId',
            type: 'department',
            required: true
        }]
    },

    '/api/organization/tree': {
        method: 'GET',
        params: []
    }
};

