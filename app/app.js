var mod = angular.module('mollerarkivet', [
  'ui.router',
  'pascalprecht.translate',
  'templates-app',
  'templates-common',
  'mollerarkivet.login',
  'mollerarkivet.admin-users',
  'mollerarkivet.admin-users-new',
  'mollerarkivet.admin-users-edit',
  'mollerarkivet.admin-documents',
  'mollerarkivet.admin-documents-new',
  'mollerarkivet.admin-documents-edit',
  'mollerarkivet.admin-settings',
  'mollerarkivet.common.authentication',
  'mollerarkivet.common.error',
  'mollerarkivet.common.spinner',
  'ui.bootstrap'
]);



mod.controller('AppCtrl', ['$scope', '$state', 'appProperties', 'authService', 'errorService', AppCtrl]);

mod.value('appProperties', {
    appName: 'Mollerarkivet Administrasjonsportal',
    contactEmail: 'mollerarkivet@moller.no'
});




mod.config(function ($stateProvider, $urlRouterProvider,$translateProvider ) {
    $urlRouterProvider.otherwise('/login');

   $translateProvider.useStaticFilesLoader({
        prefix: 'assets/i18n/',
        suffix: '.json'
    });

   $translateProvider.preferredLanguage('nb');
   
});


function AppCtrl($scope, $state, appProperties, authService, errorService) {

    //Init variables
    $scope.appName = appProperties.appName;
    $scope.contactTranslations = {
        email: appProperties.contactEmail
    };

    $scope.collapse = function () {
        $scope.navCollapsed = true;
    };
    /*When there is a page change this will check if the user is logged in or not.
    and then being redirected to the appropiate page
    */
    $scope.$on('$stateChangeSuccess', function (event, toState) {
        //state changes if the user is not logged in
        if (!authService.isLoggedIn()) {

            //don't show the session expire modal when displaying the login screen
            if ($state.current.name !== "login") {

                //only show the session expired modal when the accesstoken is set
                if (authService.retrieveAccessToken()) {
                    errorService.sessionExpired();
                }

                //log out the user to clean the localstorage
                authService.logOut().then(function () {
                    $state.go("login");
                });
            }

        }
        //state changes when the user is logged in and tries to reach the login page.
        else {
            if ($state.current.name === "login") {
                $state.go("documents");
            }
        }

        //Universial function to show / hide menu on menu bar
        $scope.toogleBarIsVisible = authService.isLoggedIn();
        if (angular.isDefined(toState.data.pageTitle)) {
            var pageTitle = toState.data.pageTitle;

            $scope.pageTitle = pageTitle + ' | Mollerarkivet Administrasjonsportal';
    }
    });

    //Universial function to logout
    $scope.logout = function () {
        authService.logOut();
    };
}
