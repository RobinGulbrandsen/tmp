var mod = angular.module('mollerarkivet.common.resources.api', [
    'mollerarkivet.common.authentication',
    'angularFileUpload'
]);

mod.value('apiOptions', {
    //rootUrl: 'http://localhost:62639/api/v1/', // Dev
    rootUrl: 'http://api.mollerarkivet.no/api/v1/', // Prod
    dataType: 'json'

});

mod.service('apiService', ['$http','$upload', 'apiOptions','authService', apiService]);

function apiService($http, $upload, apiOptions, authSerivce) {
    var getToken = function () {
        if (authSerivce.isLoggedIn()) {
            return authSerivce.retrieveAccessToken();
        }
        return "";
    };
    
    this.get = function (params) {
        return $http({
            headers: { 'Authorization' : "Bearer "+getToken()},
            url: this.buildAbsoluteRestUrl(params.url),
            method: 'get',
            dataType: apiOptions.dataType,
            params: params.params
        });
    };

    this.post = function (params) {
        return $http({
            headers: { 'Authorization': "Bearer " + getToken() },
            url: this.buildAbsoluteRestUrl(params.url),
            method: 'post',
            dataType: apiOptions.dataType,
            data: params.data
        });
    };

    this.del = function(params) {
        return $http({
            headers: { 'Authorization': "Bearer " + getToken() },
            url: this.buildAbsoluteRestUrl(params.url),
            method: 'delete',
            dataType: apiOptions.dataType
        });
    };

    this.put = function (params) {
        return $http({
            headers: { 'Authorization': "Bearer " + getToken() },
            url: this.buildAbsoluteRestUrl(params.url),
            method: 'put',
            dataType: apiOptions.dataType,
            data : params.data
         });
    };

    this.uploadFiles = function(params) {
        return $upload.upload({
            headers: { 'Authorization': "Bearer " + getToken() },
            url: this.buildAbsoluteRestUrl(params.url),
            method: 'post',
            dataType: "multipart/form-data",
            data: params.data,
            file: params.files
        });
    };

    this.buildAbsoluteRestUrl = function (resourceUrl) {
        return apiOptions.rootUrl + resourceUrl;
    };
}