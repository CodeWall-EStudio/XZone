var config = require('../config');

var ObjectID = ['string', 24];
var ArrayObjectID = ['array', 'string', 24];
var POST = 'POST';
var GET = 'GET';

module.exports = {
    // file 
    '/api/file': {
        method: GET,
        require: {
            fileId: ObjectID
        }
    },
    '/api/file/upload': {
        method: POST,
        require: {
            name: ['string', 1]
        },
        all: {
            folderId: ObjectID
        }
    },
    '/api/file/download': {
        method: GET,
        require: {
            fileId: ObjectID
        }
    },
    '/api/file/batchDownload': {
        method: POST,
        require: {
            fileId: ArrayObjectID
        }
    },
    '/api/file/preview': {
        method: GET,
        require: {
            fileId: ObjectID
        }
    },
    '/api/file/save': {
        method: POST,
        require: {
            messageId: ObjectID
        },
        optional: {
            folderId: ObjectID
        }
    },
    '/api/file/modify': {
        method: POST,
        require: {
            fileId: ObjectID
        },
        optional: {
            name: ['string', 1],
            groupId: ObjectID
        }
    },
    '/api/file/copy': {
        method: POST,
        require: {
            fileId: ArrayObjectID,
            targetId: ObjectID
        },
        optional: {
            groupId: ObjectID
        }
    },
    '/api/file/move': {
        method: POST,
        require: {
            fileId: ArrayObjectID,
            targetId: ObjectID
        },
        optional: {
            groupId: ObjectID
        }
    },
    '/api/file/share': {
        method: POST,
        require: {
            fileId: ArrayObjectID
        },
        optional: {
            toUserId: ArrayObjectID,
            toGroupId: ArrayObjectID,
            toFolderId: ArrayObjectID
        }
    },
    '/api/file/delete': {
        method: POST,
        require: {
            fileId: ArrayObjectID
        },
        optional: {
            groupId: ObjectID
        }
    },
    '/api/file/search': {
        method: GET,
        require: {
            folderId: ObjectID,
            page: ['number', 0],
            pageNum: ['number', 0]
        },
        optional: {
            groupId: ObjectID,
            keyword: ['string'],
            type: ['number', 0],
            order: ['object']
        }
    },
    '/api/file/query': {
        method: GET,
        require: {
            page: ['number', 0],
            pageNum: ['number', 0]
        },
        optional: {
            type: ['number', 0],
            groupId: ObjectID,
            order: ['object']
        }
    },

    // media
    '/api/media/upload': {
        method: POST,
        require: {
            name: ['string', 1],
            activityId: ['string', 1]
        }
    },
    '/api/media/download': {
        method: GET,
        require: {
            fileId: ObjectID
        }
    },

    // folder
    '/api/folder/create': {
        method: POST,
        require: {
            folderId: ObjectID,
            name: ['string', 1]
        },
        optional: {
            groupId: ObjectID,
            closeTime: ['number'],
            prepare: ObjectID
        }
    },
    '/api/folder': {
        method: GET,
        require: {
            folderId: ObjectID
        },
        optional: {
            groupId: ObjectID
        }
    },
    '/api/folder/delete': {
        method: POST,
        require: {
            folderId: ArrayObjectID
        },
        optional: {
            groupId: ObjectID
        }
    },
    '/api/folder/modify': {
        method: POST,
        require: {
            folderId: ObjectID
        },
        optional: {
            name: ['string', 1],
            groupId: ObjectID
        }
    },
    '/api/folder/list': {
        method: GET,
        require: {
            folderId: ObjectID
        },
        optional: {
            groupId: ObjectID
        }
    },
    '/api/folder/search': {
        method: GET,
        require: {
            folderId: ObjectID,
            page: ['number', 0],
            pageNum: ['number', 0]
        },
        optional: {
            groupId: ObjectID,
            keyword: ['string'],
            type: ['number'],
            order: ['object']
        }
    },

    // fav
    '/api/fav/create': {
        method: POST,
        require: {
            fileId: ArrayObjectID
        },
        optional: {
            groupId: ObjectID
        }
    },
    '/api/fav/delete': {
        method: POST,
        require: {
            fileId: ArrayObjectID
        }  
    },
    '/api/fav/search': {
        method: GET,
        require: {
            page: ['number', 0],
            pageNum: ['number', 0]
        },
        optional: {
            groupId: ObjectID,
            keyword: ['string'],
            type: ['number'],
            order: ['object']
        }
    },

    // group
    '/api/group/create': {
        method: POST,
        require: {
            name: ['string']
        },
        optional: {
            type: ['number'],
            content: ['string'],
            members: ArrayObjectID,
            managers: ArrayObjectID,
            parentId: ObjectID
        }
    },
    '/api/group/modify': {
        method: POST,
        require: {
            groupId: ObjectID
        },
        optional: {
            name: ['string'],
            content: ['string'],
            members: ArrayObjectID,
            managers: ArrayObjectID
        }
    },
    '/api/group/': {
        method: GET,
        require: {
            groupId: ObjectID
        }
    },

    // user
    '/user/loginSuccessWithQQ': {
        method: GET,
        require: {
            code: ['string', 1],
            state: ['string', 1]
        }
    },

    // recycle
    '/api/recycle/delete': {
        method: POST,
        require: {
            fileId: ArrayObjectID
        },
        optional: {
            groupId: ObjectID
        }

    },
    '/api/recycle/revert': {
        method: POST,
        require: {
            fileId: ArrayObjectID
        },
        optional: {
            groupId: ObjectID
        }

    },
    '/api/recycle/search': {
        method: GET,
        require: {
            page: ['number', 0],
            pageNum: ['number', 0]
        },
        optional: {
            groupId: ObjectID,
            keyword: ['string'],
            type: ['number'],
            order: ['object']
        }
    },

    // board
    '/api/board/create': {
        method: POST,
        require: {
            content: ['string', 1],
            groupId: ObjectID
        },
        optional: {
            parentId: ObjectID,
            resourceId: ObjectID
        }
    },
    '/api/board/approve': {
        method: POST,
        require: {
            boardId: ObjectID,
            validateText: ['string', 0],
            validateStatus: ['number', 0]
        }
    },
    '/api/board/delete': {
        method: POST,
        require: {
            boardId: ObjectID
        }
    },
    '/api/board/search': {
        method: GET,
        require: {
            page: ['number', 0],
            pageNum: ['number', 0],
            groupId: ObjectID
        },
        optional: {
            keyword: ['string'],
            order: ['object']
        }
    },

    // message 
    '/api/message/search': {
        method: GET,
        require: {
            cate: ['number', 0],
            page: ['number', 0],
            pageNum: ['number', 0]
        },
        optional: {
            type: ['number', 0],
            keyword: ['string'],
            order: ['object']
        }
    },


    // manage
    '/api/manage/listGroups': {
        method: GET,
        require: {
            page: ['number', 0],
            pageNum: ['number', 0]
        },
        optional: {
            order: ['object']
        }
    },
    '/api/manage/approveGroup': {
        method: POST,
        require: {
            groupId: ObjectID,
            validateText: ['string', 1],
            validateStatus: ['number', 0]
        }
    },
    '/api/manage/approveFile': {
        method: POST,
        require: {
            fileId: ObjectID,
            validateText: ['string', 1],
            validateStatus: ['number', 0]
        }
    },
    '/api/manage/listPrepares': {
        method: GET
    }
};





