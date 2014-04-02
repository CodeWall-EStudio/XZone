

module.exports = {
    // file 
    '/api/file': {
        method: 'GET',
        params: [
            {
                name: 'fileId',
                type: 'file',
                required: true
            }
        ]
    },
    '/api/file/upload': {
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
    '/api/file/download': {
        method: 'GET',
        params: [
            {
                name: 'fileId',
                type: 'file',
                required: true
            }
        ]
    },
    '/api/file/batchDownload': {
        method: 'POST',
        params: [
            {
                name: 'fileId',
                type: 'files',
                required: true
            }
        ]
    },
    '/api/file/preview': {
        method: 'GET',
        params: [
            {
                name: 'fileId',
                type: 'file',
                required: true
            }
        ]
    },
    '/api/file/save': {
        method: 'POST',
        params: [
            {
                name: 'messageId',
                type: 'message',
                required: true
            }/*,
            {
                name: 'folderId',
                type: 'folder'
            }*/
        ]
    },
    '/api/file/modify': {
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
    '/api/file/copy': {
        method: 'POST',
        params: [
            {
                name: 'fileId',
                type: 'files',
                required: true
            },
            {
                name: 'targetId',
                type: 'folder',
                required: true
            }/*,
            {
                name: 'groupId',
                type: 'group'
            }*/
        ]
    },
    '/api/file/move': {
        method: 'POST',
        params: [
            {
                name: 'fileId',
                type: 'files',
                required: true
            },
            {
                name: 'targetId',
                type: 'folder',
                required: true
            }/*,
            {
                name: 'groupId',
                type: 'group'
            }*/
        ]
    },
    '/api/file/share': {
        method: 'POST',
        params: [
            {
                name: 'fileId',
                type: 'files',
                required: true
            },
            {
                name: 'toUserId',
                type: 'users'
            },
            {
                name: 'toGroupId',
                type: 'groups'
            },
            {
                name: 'toFolderId',
                type: 'folders'
            }
        ]
    },
    '/api/file/delete': {
        method: 'POST',
        params: [
            {
                name: 'fileId',
                type: 'files',
                required: true
            },
            {
                name: 'groupId',
                type: 'group'
            }
        ]
    },
    '/api/file/search': {
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
            // {
            //     name: 'groupId',
            //     type: 'group'
            // },
            {
                name: 'keyword'
            },
            {
                name: 'type',
                min: 0,
                type: 'number'
            },
            {
                name: 'order',
                type: 'object'
            },
            {
                name: 'status',
                type: 'number'
            }
        ]
    },
    '/api/file/query': {
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
                name: 'file',
                type: 'fileId',
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
            }/*,
            {
                name: 'groupId',
                type: 'group'
            }*/
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
            // {
            //     name: 'groupId',
            //     type: 'group'
            // },
            {
                name: 'closeTime',
                type: 'number',
                min: 0
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
            // {
            //     name: 'groupId',
            //     type: 'group'
            // },
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
                type: 'folders',
                required: true
            }/*,
            {
                name: 'groupId',
                type: 'group'
            }*/
        ]
    },
    '/api/folder/list': {
        method: 'GET',
        params: [
            {
                name: 'folderId',
                type: 'folder',
                required: true
            }/*,
            {
                name: 'groupId',
                type: 'group'
            }
*/        ]
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
            /*{
                name: 'groupId',
                type: 'group'
            },*/
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

    // fav
    '/api/fav/create': {
        method: 'POST',
        params: [
            {
                name: 'fileId',
                type: 'files',
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
                type: 'files',
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
            // {
            //     name: 'groupId',
            //     type: 'group'
            // },
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
    '/api/group/create': {
        method: 'POST',
        params: [
            {
                name: 'name',
                type: 'string',
                required: true
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
                type: 'users'
            },
            {
                name: 'managers',
                type: 'users'
            }
        ]
    },
    '/api/group/modify': {
        method: 'POST',
        params: [
            {
                name: 'groupId',
                type: 'group'
            },
            {
                name: 'name',
                type: 'string'
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
                type: 'users'
            },
            {
                name: 'managers',
                type: 'users'
            }
        ]
    },
    '/api/group/': {
        method: 'GET',
        params: [
            {
                name: 'groupId',
                type: 'group'
            }
        ]
    },

    // user
    '/user/loginSuccessWithQQ': {
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

    // recycle
    '/api/recycle/delete': {
        method: 'POST',
        params: [
            {
                name: 'fileId',
                type: 'files',
                required: true
            }/*,
            {
                name: 'groupId',
                type: 'group'
            }
*/        ]

    },
    '/api/recycle/revert': {
        method: 'POST',
        params: [
            {
                name: 'fileId',
                type: 'files',
                required: true
            }/*,
            {
                name: 'groupId',
                type: 'group'
            }*/
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
            // {
            //     name: 'groupId',
            //     type: 'group'
            // },
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
    '/api/manage/listPrepares': {
        method: 'GET'
    }
};





