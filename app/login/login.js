var mod = angular.module('mollerarkivet.login', [
    'mollerarkivet.common.authentication',
    'ui.router',
    'mollerarkivet.common.error',
    'mollerarkivet.common.validators',
    'angularSpinner'
]);

mod.config(function config($stateProvider) {
    $stateProvider.state('login', {
        url: '/login',
        views: {
            "main": {
                controller: 'loginCtrl',
                templateUrl: 'login/login.tpl.html'
            }
        },
        data: { pageTitle: 'Logg inn' }
    });
});

mod.controller('loginCtrl', ['$scope', '$state', 'authService', 'errorService', 'validatorService', loginCtrl]);

function loginCtrl($scope, $state, authService, errorService, validatorService) {

    //Model for loginform with default grant_type for OAuth2
    $scope.loginform = {
        grant_type : "password"
    };

    
    //function for login - authenticate and send request to server for session token
    $scope.login = function () {
        //Setting up variables - init
        $scope.errorMessageEmail = false;
        $scope.errorMessagePassword = false;
        //password and email are valid until
        var emailValid = true;
        var passwordValid = true;
        
        //Validates email. if the email is not valid set emailvalid to false
        if (!$scope.loginform.Email || !validatorService.email($scope.loginform.Email)) {
            $scope.errorMessageEmail = true;
            emailValid = false;
        }

        //Validates password. set password to false if the field is empty.
        if (!$scope.loginform.Password) {
            $scope.errorMessagePassword = true;
            passwordValid = false;
        }

        //Check on valid email and password - send request
        if (emailValid && passwordValid) {

            var loading = errorService.loadingSpinner();

            authService.logIn($scope.loginform)
            .then(function (data) {
                loading.close();

                $state.go("documents");
                
            }, function (error) {
                loading.close();
                errorService.invalidCredentials();
                $scope.loginform.Password = "";
            });

        } else {
            $scope.loginform.Password = "";
        }
    };
}
