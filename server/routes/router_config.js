
module.exports = {
    // file 
    '/api/file/upload': {
        method: 'POST',
        require: {
            folderId: ['string', 24]
        }
    },
    '/api/file/download': {
        method: 'GET',
        require: {
            fileId: ['string', 24]
        }
    },
    '/api/file/modify': {
        method: 'POST',
        require: {
            fileId: ['string', 24]
        }
    },
    '/api/file/copy': {
        method: 'POST',
        require: {
            fileId: ['string', 24],
            targetId: ['string', 24]
        },
        optional: {
            groupId: ['string', 24]
        }
    },
    '/api/file/move': {
        method: 'POST',
        require: {
            fileId: ['string', 24],
            targetId: ['string', 24]
        },
        optional: {
            groupId: ['string', 24]
        }
    },
    '/api/file/delete': {
        method: 'POST',
        require: {
            fileId: ['string', 24]
        }
    },
    '/api/file/search': {
        method: 'GET',
        require: {
            folderId: ['string', 24]
        },
        optional: {
            groupId: ['string', 24],
            keyword: ['string'],
            type: ['number', 0]
        }
    }

    // folder
};