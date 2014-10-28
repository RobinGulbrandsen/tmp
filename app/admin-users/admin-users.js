var mod = angular.module('mollerarkivet.admin-users', [
    'mollerarkivet.common.error',
    'mollerarkivet.common.spinner',
    'mollerarkivet.common.resources.api',
    'mollerarkivet.common.resources.user',
    'mollerarkivet.common.authentication',
    'ui.router'
]);

mod.config(function config($stateProvider) {
    //list users template
    $stateProvider.state('users', {
        url: '/users',
        views: {
            "main": {
                controller: 'adminUsersCtrl',
                templateUrl: 'admin-users/admin-users.tpl.html'
            },
            "menu": {
                templateUrl: 'common/menu.tpl.html'
            }
        },
        data: { pageTitle: 'Redaktorer' }

    });
});

mod.controller('adminUsersCtrl', ['$scope', '$state', 'errorService', 'apiService', 'userRestApi', 'authService', 'mollerSpinnerService', adminUsersCtrl]);

function adminUsersCtrl($scope, $state, errorService, apiSerivce, userRestApi, authService, mollerSpinnerService) {
    $scope.loadingSpinnerShow = true;

    //initalize an empty list
    $scope.users = [];

    $scope.editUser = function (Id) {
        $state.go('users-edit', {"Id":Id} );
    };

    $scope.newUser = function () {
        $state.go('users-new');
    };

    $scope.deleteUser = function (Id,email) {
        //displays the error modal and does action based on the result
        errorService.confirmation(email).result
            .then(function (result) {
                var params = {
                    url: userRestApi.del + Id
                };

                //delete the user from the list if the user clicked ok to delete
                apiSerivce.del(params)
                    .then(function (result) {
                        refreshList();
                    }, function (error) {
                        if (error.status == 401) {
                            authService.logOut()
                                .then(function (success) {
                                    $state.go("login");
                            });   
                        }
                        else if (error.status == 422) {
                            errorService.deleteUserSelf();
                        }
                    });

            }, function (error) {
                //error handling
            });
    };

    //refresh and load list
    var refreshList = function () {
        var params = {
            url: userRestApi.get
        };

        apiSerivce.get(params).then(function (result) {
            $scope.loadingSpinnerShow = false;
            $scope.users = result.data;
        }, function (error) {
            $scope.loadingSpinnerShow = false;
            if (error.status == 401) {
                authService.logOut()
                    .then(function (success) {
                        $state.go("login");
                    });   
            }
            else if (error.status == 422) {
                errorService.deleteUserSelf();
            }

        });

    };

    var target = document.getElementById('loadingSpinner');
    new Spinner(mollerSpinnerService.blackSpinnerOptions()).spin(target);

    //load data on init
    refreshList();
}


