var underscore = angular.module('underscoreService', []);
underscore.factory('_', function () {
    return window._; 
});