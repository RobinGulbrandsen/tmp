describe("authService", function () {
    var auth;
    //var url = 'http://localhost:62639/api/v1/login'; //dev
    var url = "http://api.mollerarkivet.no/api/v1/login"; //prod

    beforeEach(module('mollerarkivet.common.authentication'));

    //inject the authservice into each test
    beforeEach(inject(function (authService, $injector) {
        auth = authService;     
    }));

    //after each test clean service and set to null
    afterEach(function () {
        auth = null;
    });

    /**
    * validator
    */
    describe("validator", function () {

        it("should return false when missing email field", inject(function () {
            //arrange
            var data = {
            };
            
            //act
            var result = auth.validator(data);

            //assert
            expect(result).toBe(false);
        }));

        it("should return false when email field is null", inject(function () {
            //arrange
            var data = {
                Email : null
            };

            //act
            var result = auth.validator(data);

            //assert
            expect(result).toBe(false);
        }));

        it("should return false when missing password field", inject(function () {
            //arrange
            var data = {
            };

            //act
            var result = auth.validator(data);

            //assert
            expect(result).toBe(false);
        }));

        it("should return false when password field is null", inject(function () {
            //arrange
            var data = {
                Password : null
            };

            //act
            var result = auth.validator(data);

            //assert
            expect(result).toBe(false);
        }));

        it("should return false when missing grant_type field", inject(function () {
            //arrange
            var data = {
            };

            //act
            var result = auth.validator(data);

            //assert
            expect(result).toBe(false);
        }));

        it("should return false when grant type is null", inject(function () {
            //arrange
            var data = {
                Email: "test@moller.no",
                Password: "weakpassword",
                grant_type : null
            };

            //act
            var result = auth.validator(data);

            //assert
            expect(result).toBe(false);
        }));

        it("should return false when grant_type is not set to 'password'", inject(function () {
            //arrange
            var data = {
                Email: "test@moller.no",
                Password: "weakpassword",
                grant_type: "email"
            };

            //act
            var result = auth.validator(data);

            //assert
            expect(result).toBe(false);
        }));

        it("should return true when grant_type is set to 'password'", inject(function () {
            //arrange
            var data = {
                Email: "test@moller.no",
                Password: "weakpassword",
                grant_type: "password"
            };

            //act
            var result = auth.validator(data);

            //assert
            expect(result).toBe(true);
        }));


        it("should return false when email field is empty", inject(function () {
            //arrange
            var data = {
                Email: "",
                Password: "weakpassword",
                grant_type: "password"
            };

            //act
            var result = auth.validator(data);

            //assert
            expect(result).toBe(false);
        }));

        it("should return false when password field is empty string", inject(function () {
            //arrange
            var data = {
                Email: "test@moller.no",
                Password: "",
                grant_type: "password"
            };

            //act
            var result = auth.validator(data);

            //assert
            expect(result).toBe(false);
        }));
        
    });

    /*
    *LogIn
    */
    describe("logIn", function () {

        it("should be defined", inject(function () {
            expect(auth.logIn).toBeDefined();
        }));
        
        it("should return a promise to be defined", inject(function () {
            //arrange
            var data = { 
            };

            //act
            var promise = auth.logIn(data);
            
            //assert
            expect(promise).toBeDefined();
        }));

        it("should return a reject error with missing fields userName, password and grant_type", inject(function ($q, $rootScope) {
            //arrange
            var data = {
            };
            var result;

            //act
            var promise = auth.logIn(data);
            
            promise.then(function (res) {
                result = res;
            }, function (err) {
                result = err;
            });

            $rootScope.$digest();
            
            //assert
            expect(result.errorMessage).toBeDefined();

        }));

        it("should return an error when invalid login credentials", inject(function ($q, $rootScope, $httpBackend) {

            //arrange

            //mocks the reueqst to the server. this test will return 400 when there is a invaldi login information
            $httpBackend.when('POST', url).respond(400);
            var data = {
                Email: "test@test.moller.no",
                Password: "WeakPassword666",
                grant_type: "password"
            };
            var result;

            //act
            var promise = auth.logIn(data);
            promise.then(function (res) {
                result = res;
            }, function (err) {
                result = err;
            });

            //flush has to be calld to make the http request method to be called in logIn
            $httpBackend.flush();
            
            //digest has to called to make the promise to be either resolved or rejected
            $rootScope.$digest();

            //assert.
            expect(result.status).toBe(400);

        }));

        it("should return 'accesstoken' to be defined when requesting with the correct credentials", inject(function ($q, $rootScope, $httpBackend) {

            //arrange
            //mocks the reuest to the server. this test will return 200 when the login credntials is correct
            $httpBackend.when('POST', url)
                .respond(200, {
                   "access_token": "aVeryLongKeyThatWillBeStoredInLocalStorage",
                   ".expires": "adate"
                });

            var data = {
                Email: "test@test.moller.no",
                Password: "WeakPassword666",
                grant_type: "password"
            };
            var result;

            //act
            var promise = auth.logIn(data);
            promise.then(function (res) {
                result = res;
            }, function (err) {
                result = err;
            });

            //flush has to be calld to make the http request method to be called in logIn
            $httpBackend.flush();

            //digest has to called to make the promise to be either resolved or rejected
            $rootScope.$digest();

            //assert.
            expect(result.access_token).toBeDefined();

        }));

        it("should return '.expires' to be defined when requesting with the correct credentials", inject(function ($q, $rootScope, $httpBackend) {

            //arrange
            //mocks the reuest to the server. this test will return 200 when the login credntials is correct
            $httpBackend.when('POST', url)
                .respond(200, {
                    "access_token": "aVeryLongKeyThatWillBeStoredInLocalStorage",
                    ".expires": "adate"
                });

            var data = {
                Email: "test@test.moller.no",
                Password: "WeakPassword666",
                grant_type: "password"
            };
            var result;

            //act
            var promise = auth.logIn(data);
            promise.then(function (res) {
                result = res;
            }, function (err) {
                result = err;
            });

            //flush has to be calld to make the http request method to be called in logIn
            $httpBackend.flush();

            //digest has to called to make the promise to be either resolved or rejected
            $rootScope.$digest();
            
            //assert.
            expect(result[".expires"]).toBeDefined();

        }));

    });

    /*
    * checks if the user is logged in
    */
    describe("isLoggedIn", function () {

        it("isLoggedIn should be defined", inject(function () {
            expect(auth.isLoggedIn).toBeDefined();
        }));

        it("return false when access token is not set", inject(function () {
            //arrange
            var data = {
                ".expires": new Date(2014,07,01,12,0,0,0)
            };

            //act
            auth.saveLoginInformation(data);
            var result = auth.isLoggedIn();

            //assert
            expect(result).toBe(false);
            
        }));

        it("return false when .expires is not set", inject(function () {
            //arrange
            var data = {
                "access_token": "aVeryLongKeyThatWillBeStoredInSessionStorage"
            };

            //act
            auth.saveLoginInformation(data);
            var result = auth.isLoggedIn();

            //assert
            expect(result).toBe(false);

        }));

        it("return false when the time at the moment is greater than .expires' time", inject(function () {
            //arrange
            var data = {
                "access_token": "aVeryLongKeyThatWillBeStoredInSessionStorage",
                ".expires": new Date(2014, 01, 01, 12, 0, 0, 0)
            };

            //act
            auth.saveLoginInformation(data);
            var result = auth.isLoggedIn();

            //assert
            expect(result).toBe(false);

        }));

        it("return true when .expires has not expired", inject(function () {
            //arrange
            var date = new Date();
            date.setDate(date.getDate() + 10);
            var data = {
                "access_token": "aVeryLongKeyThatWillBeStoredInSessionStorage",
                ".expires": date
            };
 
            //act
            auth.saveLoginInformation(data);
            var result = auth.isLoggedIn();

            //assert
            expect(result).toBe(true);

        }));
   
    });

    /*
       save and retrieve access token
    */
    describe("accessToken", function () {

        it("saveAccessToken should be defined ", inject(function () {
            expect(auth.saveLoginInformation).toBeDefined();
        }));

        it("retrieveAccessToken should be defined ", inject(function () {
            expect(auth.retrieveAccessToken).toBeDefined();
        }));

        it("saved access token should be the same as the retrieved access token", function () {
            //arrange
            var data = {
                "access_token": "AVeryLongKeyStoredInLocalStorage",
                ".expires": "adatewhichwouldbeonaformat"
            };
            var result;

            //act
            auth.saveLoginInformation(data);
            result = auth.retrieveAccessToken();

            //assert
            expect(data.access_token).toBe(result);

        });

        it("saved .expires value should be the same as the retrieved .expires value", function () {
            //arrange
            var data = {
                "access_token": "AVeryLongKeyStoredInLocalStorage",
                ".expires": "adatewhichwouldbeonaformat"
            };
            var result;

            //act
            auth.saveLoginInformation(data);
            result = auth.retrieveSessionExpires();

            //assert
            expect(data[".expires"]).toBe(result);

        });

    });

    /**
        logOut
    */

    describe("logOut", function () {

        it("function should be defined", inject(function () {
            expect(auth.logOut).toBeDefined();
        }));

        it("should return a promise to be defined when logging out", inject(function ($q, $rootScope) {
            //arrange
            var promise;
            var result;

            //act
            promise = auth.logOut();
            promise.then(function (res) {
                result = res;
            });

            //assert
            expect(promise).toBeDefined();

        }));

        it("should return a result to be defined when logging out", inject(function ($q, $rootScope) {
            //arrange
            var promise;
            var result;

            //act
            promise = auth.logOut();
            promise.then(function (res) {
                result = res;
            });
 
            $rootScope.$digest();

            //assert
            expect(result).toBeDefined();

        }));

    });

});