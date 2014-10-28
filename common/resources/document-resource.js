var mod = angular.module('mollerarkivet.common.resources.document', []);

mod.value('documentRestApi', {
    get: 'documents/',
    post: 'documents/',
    put: 'documents/',
    del: 'documents/',
    attachement: '/attachment',
    status: 'status'
});