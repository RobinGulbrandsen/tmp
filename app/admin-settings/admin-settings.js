var mod = angular.module('mollerarkivet.admin-settings', [
    'ui.router',
    'mollerarkivet.common.authentication',
    'mollerarkivet.common.resources.api',
    'mollerarkivet.common.resources.settings',
    'mollerarkivet.common.error',
    'mollerarkivet.common.spinner',
    'ui.bootstrap'
    ]);

mod.config(function config($stateProvider) {
    $stateProvider.state('settings', {
        abstract: true,
        url: '/settings',
        views: {
            "main": {
                controller: 'adminSettingsCtrl',
                templateUrl: 'admin-settings/admin-settings.tpl.html'
            },
            "menu": {
                templateUrl: 'common/menu.tpl.html'
            }
        },
        data: { pageTitle: 'Innstillinger' }
    })
    .state('settings.general', {
        url: '/general',
        templateUrl: 'admin-settings/admin-settings-general.tpl.html',
        controller: "adminSettingsGeneralCtrl"

    });
});

mod.controller('adminSettingsCtrl', ['$scope', adminSettingsCtrl]);

mod.controller('adminSettingsGeneralCtrl', ['$scope', '$q', '$translate', '$state', 'authService', 'apiService', 'settingsRestApi', 'errorService', 'mollerSpinnerService', adminSettingsGeneralCtrl]);


function adminSettingsCtrl($scope) {


}

function adminSettingsGeneralCtrl($scope, $q, $translate, $state, authService, apiService, settingsRestApi, errorService, mollerSpinnerService) {
    $scope.loadingSettings = false;

    var getDefaultSettings = function () {
        return {
            TimeStart: {
                Description: "loading",
                Value: "N/A"
            },
            TimeStop: {
                Description: "loading",
                Value: "0"
            },
            TimeCount: {
                Description: "loading",
                Value: "0"
            }
        };
    };
    $scope.settings = getDefaultSettings();

    var loadSettings = function () {
        var params = {
            url: settingsRestApi.get
        };
        $scope.loadingSettings = true;
        //get settings from the server
        apiService.get(params).then(function (result) {//sucess handling 
            $scope.loadingSettings = false;
            $scope.settings = result.data;

        }, function (error) { // error handling
            $scope.loadingSettings = false;
            //logout and redirect to login on 401
            if (error.status == 401) {
                authService.logOut().then(function () {
                    $state.go("login");
                });
            }
            else {
                errorService.errorCode(error.status);
            }
        });
    };
    
    //Triggers update of flickr
    $scope.updateFlickr = function () {
        $scope.loadingSettings = true;
        var params = {
            url: settingsRestApi.get
        };
        //get settings from the server
        apiService.get(params).then(function (result) {//sucess handling 
            if (result.data.TimeStop.Value == null) {
                $scope.loadingSettings = false;
                return;
            }
            $scope.settings = getDefaultSettings();

            params = {
                url: "flickr/collections"
            };
            apiService.post(params).then(function (result) {
                $scope.loadingSettings = false;
            }, function (error) {
                $scope.loadingSettings = false;
            });
        }, function (error) { // error handling
            $scope.loadingSettings = false;
            //logout and redirect to login on 401
            if (error.status == 401) {
                authService.logOut().then(function () {
                    $state.go("login");
                });
            }
            else {
                errorService.errorCode(error.status);
            }
        });
    };

    $scope.updateSettings = function () {
        loadSettings();
    };

    var target = document.getElementById('loadingSpinner');
    new Spinner(mollerSpinnerService.blackSpinnerOptions()).spin(target);

    loadSettings();
    /*
    //load the settings values from the api
    var loadSettings = function () {
        var params = {
            url: settingsRestApi.get
        };
        $scope.loadingSettings = true;
        //get settings from the server
        apiService.get(params).then(function (result) {//sucess handling 
            console.log(data);
            $scope.loadingSettings = false;
            $scope.settings = result.data;
            $scope.settings.CacheActive.Value = result.data.CacheActive.Value+"";
            
            //selecting the correct veky to display in the drop down menu based on the integer defined in timevalues
            angular.forEach(timeValues, function (value, key) {
                if ($scope.settings.CacheInterval.Value == value) {
                    angular.forEach($scope.cachingItems, function (item) {
                        if (item.value == key) {
                            $scope.selectedIntervalName = item.name;
                        }
                    });
                }
            });

            //FIX FOR TIME todo: remove
            var tStart = $scope.settings.TimeStart.Value + "";
            $scope.settings.TimeStart.Value = tStart.substring(0, 2) + ":" + tStart.substring(2, 4) + ":" + tStart.substring(4, 6);
            var tStop = $scope.settings.TimeStop.Value + "";
            $scope.settings.TimeStop.Value = tStop.substring(0, 2) + ":" + tStop.substring(2, 4) + ":" + tStop.substring(4, 6);

        }, function (error) { // error handling
            $scope.loadingSettings = false;
            //logout and redirect to login on 401
            if (error.status == 401) {
                authService.logOut().then(function () {
                    $state.go("login");
                });
            }
            else {
                errorService.errorCode(error.status);
            }
        });
    };
    
    //translations for the dropdown menu
    var schedulerTranslations = function () {

        //initiates variables and levels
        var promises = [];
        var translations = ["DAILY","WEEKLY"];

        //Creates promisses for each level to get the text
        angular.forEach(translations, function (translationIndex) {
            var deferred = $q.defer();
            var translationKey = "settings.scheduler." + translationIndex;

            //On return add caching 
            $translate(translationKey).then(function (data) {
                deferred.resolve({
                    value: translationIndex,
                    name: data
                });
            }, function () {
                deferred.reject(arguments);
            });

            //Adds the promise to the list
            promises.push(deferred.promise);
        });

        //when all promises are complete. return the data
        return $q.all(promises);
    };

    //load the languages
    schedulerTranslations().then(function (result) {
        $scope.cachingItems = result;
    }, function (error) {
        console.log(error);
    });
    */
    /*
    $scope.active = "1";
    var timeValues = {
        "DAILY": "86400",
        "WEEKLY": "604800"
    };
    $scope.times = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    $scope.selectTime = function (time) {
        $scope.settings.CacheTime.Value = time;
    };
    
    //whenever selecting a element in the schedule dropdown menu
    $scope.selectCache = function (cache) {
        //display the correct label
        $scope.selectedIntervalName = cache.name;
        //change the settings value
        $scope.settings.CacheInterval.Value = timeValues[cache.value];
    };

    //save the settings to the server
    $scope.saveSettings = function () {
        
        //convert $scope.settings to array. we don't need the label from the get method when updating the settings
        var settingsList = [];
        angular.forEach($scope.settings, function (value) {
            settingsList.push(value);
        });

        //setup the request information
        var params = {
            url: settingsRestApi.put,
            data: settingsList
        };

        var loadingSpinner = errorService.loadingSpinner();

        apiService.put(params).then(function (result) {
            loadingSpinner.close();
            //goto setting.genral page(this page) and do a hard reload
            $state.go("settings.general", {}, { reload: true });
        }, function (error) {
            loadingSpinner.close();
            if (error.status == 401) {
                authService.logOut().then(function () {
                    $state.go("login");
                });
            }
            else {
                errorService.errorCode(error.status);
            }
        });
        
    };
    */
}


