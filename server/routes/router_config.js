
module.exports = {
    // file 
    '/api/file/upload': {
        method: 'POST',
        require: {
            folderId: [String, 24]
        }
    },
    '/api/file/download': {
        method: 'GET',
        require: {
            fileId: [String, 24]
        }
    },
    '/api/file/modify': {
        method: 'POST',
        require: {
            fileId: [String, 24]
        }
    },
    '/api/file/copy': {
        method: 'POST',
        require: {
            fileId: [String, 24],
            targetId: [String, 24]
        },
        optional: {
            groupId: [String, 24]
        }
    },
    '/api/file/move': {
        method: 'POST',
        require: {
            fileId: [String, 24],
            targetId: [String, 24]
        },
        optional: {
            groupId: [String, 24]
        }
    },
    '/api/file/delete': {
        method: 'POST',
        require: {
            fileId: [String, 24]
        }
    },
    '/api/file/search': {
        method: 'GET',
        require: {
            folderId: [String, 24]
        },
        optional: {
            groupId: [String, 24],
            keyword: [String],
            type: [Number, 0]
        }
    }

    // folder
};