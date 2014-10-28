var mod = angular.module('mollerarkivet.admin-users-new', [
    'ui.router',
    'mollerarkivet.common.validators',
    'mollerarkivet.common.error',
    'mollerarkivet.common.resources.api',
    'mollerarkivet.common.resources.user',
    'mollerarkivet.common.authentication'

]);

mod.config(function config($stateProvider) {

    //config for the user-new module
    $stateProvider.state('users-new', {
        url: '/users/new',
        views: {
            "main": {
                controller: 'adminUsersNewCtrl',
                templateUrl: 'admin-users/admin-users-new.tpl.html'
            },
            "menu": {
                templateUrl: 'common/menu.tpl.html'
            }
        },
        data: { pageTitle: 'Ny redaktor' }

    });
});

mod.controller('adminUsersNewCtrl', ['$scope', '$state','apiService','userRestApi','validatorService','errorService','authService', adminUsersNewCtrl]);

function adminUsersNewCtrl($scope, $state, apiService, userRestApi, validatorSerivce, errorService, authService) {
    //variables for showing and disabling elements in the gui
    $scope.saveButtonDisabled = true;
    $scope.passwordStrength = false;
    $scope.emailValid = false;
    $scope.user = {};

    //watch the email field
    $scope.$watch('user.Email', function () {
        var email = $scope.user.Email;
        if (email) {
            $scope.emailValid = !validatorSerivce.email(email);
        }
        else {
            $scope.emailValid = false;
        }
        enableSaveButton();
    });

    //watch the password field for strength
    $scope.$watch('user.Password', function () {
        var password = $scope.user.Password;
        if (password) {
            //display error message if password is not strong enough
            $scope.passwordStrength =!validatorSerivce.password(password);
        }
        else {
            $scope.passwordStrength = false;
        }
        enableSaveButton();
    });

    //message when ConfirmPassword is being changed in the gui
    $scope.$watch('user.ConfirmPassword', function () {
        enableSaveButton();
    });


    //sends and save user on the server
    $scope.saveUser = function () {
        var email = $scope.user.Email;
        var password = $scope.user.Password;
        var confirmPassword = $scope.user.ConfirmPassword;

        //validate fields required
        if (validatorSerivce.password(password) && password === confirmPassword && validatorSerivce.email(email)) {

            //build the request url and data
            var params = {
                url: userRestApi.post,
                data: {
                    Password: password,
                    ConfirmPassword: confirmPassword,
                    Email: email
                }
            };
            //show the loading spinner
            var loadingSpinner = errorService.loadingSpinner();

            //send the request to the server
            apiService.post(params)
            .then(function (result) {
                //close the spinng, clean form and go to state
                loadingSpinner.close();
                cleanForm();
                $state.go("users");

            }, function (error) {
                loadingSpinner.close();
                //redirect on 401
                if (error.status == 401) {
                    authService.logOut().then(function () {
                        $state.go("login");
                    });
                }

                //if 422 user exsits or has exsitsed
                else if (error.status == 422) {
                    errorService.userExists(email);
                }

                //close the loading spinner and display the error message
                else {
                    errorService.errorCode(error.status);
                }
                
            });
        }
        else{
            //handle some errors with validation
        }
    };

    //returns to users page
    $scope.cancel = function () {
        $state.go('users');
    };

    //clean the form
    var cleanForm = function () {
        $scope.user = {};
    };

    //check if the save button can be enabled
    var enableSaveButton = function () {
        var email = $scope.user.Email;
        var password = $scope.user.Password;
        var confirmPassword = $scope.user.ConfirmPassword;

        if (validatorSerivce.password(password) && password === confirmPassword && validatorSerivce.email(email)) {
            $scope.saveButtonDisabled = false;
        }
        else {
            $scope.saveButtonDisabled = true;
        }
        
    };

}
