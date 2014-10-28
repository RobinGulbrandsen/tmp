var mod = angular.module('mollerarkivet.admin-users-edit', [
    'ui.router',
    'ui.utils',
    'mollerarkivet.common.validators',
    'mollerarkivet.common.error',
    'mollerarkivet.common.resources.api',
    'mollerarkivet.common.resources.user',
    'mollerarkivet.common.authentication'
]);

mod.config(function config($stateProvider) {

    //config for the user.edit module
    $stateProvider.state('users-edit', {
        url: '/users/edit/:Id',
        views: {
            "main": {
                controller: 'adminUsersEditCtrl',
                templateUrl: 'admin-users/admin-users-edit.tpl.html'
            },
            "menu": {
                templateUrl: 'common/menu.tpl.html'
            }
        },
        data: { pageTitle: 'Endre redaktor' }

    });
});

mod.controller('adminUsersEditCtrl', ['$scope', '$state', '$stateParams','errorService', 'apiService', 'userRestApi','validatorService','authService', adminUsersEditCtrl]);

function adminUsersEditCtrl($scope, $state, $stateParams, errorService, apiService, userRestApi, validatorSerivce, authService) {
    var Id = $stateParams.Id;

    //if the Id param is not defined. don't show the user edit page and go the user list
    if (!Id) {
        $state.go('users');
    }
    $scope.editButtonDisabled = true;
    $scope.passwordStrength = false;
    $scope.user = {};


    //watch the password field for strength
    $scope.$watch('user.Password', function () {
        var password = $scope.user.Password;
        if (password) {
            $scope.passwordStrength = !validatorSerivce.password(password);
        }
        else {
            $scope.passwordStrength = false;
        }
    });

    //message when ConfirmPassword is being changed in the gui
    $scope.$watch('user.ConfirmPassword', function () {
        var password = $scope.user.Password;
        var confirmPassword = $scope.user.ConfirmPassword;
        if (validatorSerivce.password(password) && password === confirmPassword) {
            $scope.editButtonDisabled = false;
        } else {
            $scope.editButtonDisabled = true;
        }
        
    });
    
    //refreshes and load user
    var refreshUser = function () {
        var params = {
            url: userRestApi.get + Id
        };
        apiService.get(params).then(function (result) {
            $scope.user = result.data;
        }, function (error) {
            if (error.status == 401) {
                authService.logOut().then(function () {
                    $state.go("login");
                });
            }
            else if (error.status == 422) {
                errorService.notFound(Id);
                $state.go("users");
            }
        });
        
    };

    //update function for user
    $scope.updateUser = function () {
        //validate the strength of the password
        var password = $scope.user.Password;
        var confirmPassword = $scope.user.Password;

        if (checkPassword(password, confirmPassword)) {
            var params = {
                url: userRestApi.put,
                data: {
                    Id: Id,
                    Password: password,
                    ConfirmPassword: confirmPassword
                }
            };

            //display the loading spinner
            var loadingSpinner = errorService.loadingSpinner();
            //send the request to the server
            apiService.put(params)
                .then(function (result) {
                    loadingSpinner.close();
                    refreshUser();
                    $state.go("users");

                }, function (error) {
                    loadingSpinner.close();
                    errorService.errorCode(error.status);
                });
        }

    };

    //validate the fields
    var checkPassword = function (password, confirmPassword) {
        return validatorSerivce.password(password) && password === confirmPassword;
    };

    /*
    * cancel button to go back
    */
    $scope.cancel = function () {
        $state.go('users');
    };

    //loads the user
    refreshUser();

}

