
var ObjectID = ['string', 24];
var POST = 'POST';
var GET = 'GET';

module.exports = {
    // file 
    '/api/file/upload': {
        method: POST,
        require: {
            folderId: ObjectID,
            name: ['string']
        }
    },
    '/api/file/download': {
        method: GET,
        require: {
            fileId: ObjectID
        }
    },
    '/api/file/modify': {
        method: POST,
        require: {
            fileId: ObjectID
        }
    },
    '/api/file/copy': {
        method: POST,
        require: {
            fileId: ObjectID,
            targetId: ObjectID
        },
        optional: {
            groupId: ObjectID
        }
    },
    '/api/file/move': {
        method: POST,
        require: {
            fileId: ObjectID,
            targetId: ObjectID
        },
        optional: {
            groupId: ObjectID
        }
    },
    '/api/file/delete': {
        method: POST,
        require: {
            fileId: ObjectID
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
            type: ['number'],
            order: ['string']
        }
    },

    // folder
    '/api/folder/create': {
        method: POST,
        require: {
            folderId: ObjectID,
            name: ['string']
        },
        optional: {
            topId: ObjectID,
            groupId: ObjectID
        }
    },
    '/api/folder/delete': {
        method: POST,
        require: {
            folderId: ObjectID
        },
        optional: {
            groupId: ObjectID
        }
    },
    '/api/folder/modify': {
        method: POST,
        require: {
            folderId: ObjectID
        }    
    },
    '/api/folder/list': {
        method: GET,
        require: {
            folderId: ObjectID
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
            order: ['string']
        }
    },

    // fav
    '/api/fav/create': {
        method: POST,
        require: {
            fileId: ['array', 'string', 24]
        }  
    },
    '/api/fav/delete': {
        method: POST,
        require: {
            favId: ObjectID
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
            order: ['string']
        }
    },
};





