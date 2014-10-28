var mod = angular.module('mollerarkivet.common.authentication', []);

mod.factory('authService', ['$rootScope', '$q', '$http',
  authService]);

function authService($rootScope, $q, $http) {

    var sendLogInToServer = function (data) {
        //var loginUrl ="http://localhost:62639/api/v1/login"; //dev
        var loginUrl ="http://api.mollerarkivet.no/api/v1/login"; //prod
        
        return $http({
            url: loginUrl,
            dataType: "json",
            method: "POST",
            data: data
        });

    };

    return {

        /*
        * logins the user. takes data as parameter. 
        * data should have fields {"grant_type":"password","Password":"yourPassword","Email":"yourEmail"}
        */
        logIn: function (data) {

            var self = this;
            /*
                login returns a promise object which will be resolved or rejected based on invalid input, 
                invalid login or a successful login
            */
            var deferred = $q.defer();

            //validate the data for required fields. if not reject the promise
            if (self.validator(data)) {

                /*send the http request to the server. on success resolve and save the data to localstorage
                error from the server will be rejected.
                */
                sendLogInToServer(data)
                    .success(function (data, status) {
                        self.saveLoginInformation(data);
                        deferred.resolve(data);
                    })
                    .error(function (data, status) {
                        deferred.reject({
                            errorMessage: "Invalid username or password",
                            status: status
                        });
                    });
            }
            else {
                deferred.reject({
                    errorMessage: "Missing fields username, password or grant_type = 'password'"
                });
            }

            //returns the promise and the user will either wait for the ayns operation to be resolved or rejected
            return deferred.promise;
        },

        /*
        *uses promise if there should be extended with async operations and behave the same as login
        */
        logOut: function () {
      
            var deferred = $q.defer();

            this.deleteLogInInformation();
            deferred.resolve("Logging out");

            return deferred.promise;
        },

        /*
        * Checks if the user is logged in based on the keys stored in the localstorage
        * Checks the timestamp value on the .expire key
        */
        isLoggedIn: function () {
            //retrieve access token and session expire value
            var sessionExpires = this.retrieveSessionExpires();
            var access_token = this.retrieveAccessToken();
            //the time at this moment
            var timeNow = new Date();

            //not defined return false. the browser won't complain about null values
            if (!sessionExpires) {
                return false;
            }

            //convert the string value in session expires to date
            var sessionTimeExpires = new Date(sessionExpires);

            //if access token and sessionexpores and timenow is less than the exire time return true
            if(access_token && sessionTimeExpires && ( timeNow < sessionTimeExpires ) ){
                return true;
            }
            
            return false;
        },

        /*
        * checks if the required fields are defined before sending the login request to the server
        */
        validator: function (data) {
            if (data.Email && data.Password && data.grant_type && data.grant_type === "password" ) {
                return true;
            }
            return false;
        },
        
        /*
        * Save the login informatin in localstorage
        */
        saveLoginInformation: function (login_information) {
            localStorage.setItem("login_information", JSON.stringify(login_information));
        },

        /*
        * retrieves only the accesstoken from localstorage
        */
        retrieveAccessToken: function () {
            var result = localStorage.getItem("login_information");
            if (result == null) {
                return "";
            }
            return JSON.parse(result).access_token;
        },

        /*
        *retireves only the session expires from localstorage
        */
        retrieveSessionExpires: function () {
            var result = localStorage.getItem("login_information");
            if (result == null) {
                return "";
            }
            var parse = JSON.parse(result);
            if (parse[".expires"] == null) {
                return "";
            }
            return parse[".expires"];
        },

        /*
        * delete login information from the localstorage
        */
        deleteLogInInformation: function () {
            localStorage.removeItem("login_information");
        }
        
    };

}

