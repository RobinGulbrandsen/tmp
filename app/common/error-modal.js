var mod = angular.module('mollerarkivet.common.error', [
    'ui.router',
    'ui.bootstrap'
]);

mod.factory('errorService', ['$rootScope', '$modal',errorService]);

function errorService($rootScope, $modal) {
    var template = {
        backdrop: 'static',
        windowClass: "modal-center"
    };

    return {
        invalidCredentials: function () {
            template.templateUrl = 'common/error-modal-login.tpl.html';
            template.controller = function ($scope, $modalInstance) {
                $scope.ok = function () {
                    $modalInstance.close();
                };
            };
            template.controller.$inject = ['$scope', '$modalInstance'];
            return $modal.open(template);
        },

        deleteUserSelf: function () {
            template.templateUrl = 'common/error-modal-user-delete.tpl.html';
            template.controller = function ($scope, $modalInstance) {
                $scope.ok = function () {
                    $modalInstance.close();
                };
            };
            template.controller.$inject = ['$scope', '$modalInstance'];
            return $modal.open(template);
        },

        userExists: function (message) {
            template.templateUrl = 'common/error-modal-user-exists.tpl.html';
            template.controller = function ($scope, $modalInstance) {
                $scope.message = message;
                $scope.ok = function () {
                    $modalInstance.close();
                };
            };
            template.controller.$inject = ['$scope', '$modalInstance'];
            return $modal.open(template);
        },

        sessionExpired: function () {
            template.templateUrl = 'common/error-modal-session.tpl.html';
            template.controller = function ($scope, $modalInstance) {
                $scope.ok = function () {
                    $modalInstance.close();
                };
            };
            template.controller.$inject = ['$scope', '$modalInstance'];
            return $modal.open(template);
        },

        serverError: function () {
            template.templateUrl = 'common/error-modal-500.tpl.html';
            template.controller = function ($scope, $modalInstance) {
                $scope.ok = function () {
                    $modalInstance.close();
                };
            };
            template.controller.$inject = ['$scope', '$modalInstance'];
            return $modal.open(template);
        },

        badRequest: function () {
            template.templateUrl = 'common/error-modal-400.tpl.html';
            template.controller = function ($scope, $modalInstance) {
                $scope.ok = function () {
                    $modalInstance.close();
                };
            };
            template.controller.$inject = ['$scope', '$modalInstance'];
            return $modal.open(template);
        },

        unauthorized: function () {
            template.templateUrl = 'common/error-modal-401.tpl.html';
            template.controller = function ($scope, $modalInstance) {
                $scope.ok = function () {
                    $modalInstance.close();
                };
            };
            template.controller.$inject = ['$scope', '$modalInstance'];
            return $modal.open(template);
        },

        notFound: function (message) {
            template.templateUrl = 'common/error-modal-404.tpl.html';
            template.controller = function ($scope, $modalInstance) {
                $scope.message = message;
                $scope.ok = function () {
                    $modalInstance.close();
                };
            };
            template.controller.$inject = ['$scope', '$modalInstance'];
            return $modal.open(template);
        },
        confirmation: function (message) {
            template.templateUrl = 'common/error-modal-confirmation.tpl.html';
            template.controller = function ($scope, $modalInstance) {
                $scope.error = message;
                $scope.ok = function () {
                    $modalInstance.close();
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss("cancel");
                };
            };
            template.controller.$inject = ['$scope', '$modalInstance'];
            return $modal.open(template);
        },

        loadingSpinner : function() {
            template.windowClass = "modal-center modal-center-hide";
            template.templateUrl = 'common/loading-spinner-modal.tpl.html';
            return $modal.open(template);

        },

        errorCode: function (status) {
            switch(status){
                case 400:
                    return this.badRequest();
                case 401:
                    return this.unauthorized();
                case 404:
                    return this.notFound();
                case 422:
                    return this.notFound();
                case 500:
                    return this.serverError();
                    
            }
        }

    };
}