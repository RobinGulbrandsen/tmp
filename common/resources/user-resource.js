var mod = angular.module('mollerarkivet.common.resources.user', []);

mod.value('userRestApi', {
    get: 'users/',
    post: 'users/',
    del: 'users/',
    put: 'users/'
});