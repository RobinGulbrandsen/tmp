/*
* Tests the user resource api 
*/
describe("User resource api", function () {
       
    //setting up common operations which will be injected and run for each test
    var apiService;
    var userRestApi;

    //var url = 'http://localhost:62639/api/v1/'; // Dev
    var url = 'http://api.mollerarkivet.no/api/v1/'; // Prod

    //inject custom modules needed in the test
    beforeEach(module('mollerarkivet.common.resources.api'));
    beforeEach(module('mollerarkivet.common.resources.user'));

    //before each injects the services from the modules for each test
    beforeEach(inject(function (_apiService_ ,_userRestApi_) {
        apiService = _apiService_;
        userRestApi = _userRestApi_;
    }));

    //after each tes remove the services. 
    afterEach(function () {
        apiService = null;
        userRestApi = null;
    });

    //check if the services has been injected
    describe("injected service", function () {

        it("apiService should not be null", function () {
            expect(apiService).not.toBe(null);
        });

        it("userRestApi should not be null", function () {
            expect(userRestApi).not.toBe(null);
        });

    });

    //test for get request to userRestApi through apiRestServer
    describe("GET /users/", function () {

        it("should return '/users/' in userRestApi", function () {
            expect(userRestApi.get).toBe("users/");
        });

        //inject httpbackend to mock requests to the backend
        var http;

        //injects the $httpbackend mock from angular for each test case
        beforeEach(inject(function ($httpBackend) {
            http = $httpBackend;
        }));

        //remove the injected $httpbackend for each test case
        afterEach(function () {
            http = null;
        });

        it("should return 200 when requesting /api/users/", inject(function () {
            
            //arrange
            http.when("GET", url + "users/").respond(200);
            
            //arrange the data
            var data = {
                url: userRestApi.get
            };

            var result;

            //act
            apiService.get(data).then(function (res) {
                result = res;
            });
            
            //flush the httpbackend to send the request
            http.flush();

            //assert
            expect(result.status).toBe(200);

        }));

        it("should return empty list of users when requesting /api/users/", inject(function () {

            //arrange
            http.when("GET", url + "users/")
                .respond(200, [

                ]);

            //arrange the data
            var data = {
                url: userRestApi.get
            };

            var result;

            //act
            apiService.get(data).then(function (res) {
                result = res;
            });

            //flush the httpbackend to send the request
            http.flush();

            //assert
            expect(result.data.length).toBe(0);

        }));

        it("should return list of length 1 with users when requesting /api/users/", inject(function () {

            //arrange
            http.when("GET", url + "users/")
                .respond(200, [
                    {"Email":"test@moller.no"}
                ]);

            //arrange the data
            var data = {
                url: userRestApi.get
            };

            var result;

            //act
            apiService.get(data).then(function (res) {
                result = res;
            });

            //flush the httpbackend to send the request
            http.flush();

            //assert
            expect(result.data.length).toBe(1);

        }));

        it("should return list of length 4 with users when requesting /api/users/", inject(function () {

            //arrange
            http.when("GET", url + "users/")
                .respond(200, [
                    { "Email": "test@moller.no" },
                    { "Email": "test1@moller.no" },
                    { "Email": "test2@moller.no" },
                    { "Email": "test3@moller.no" }
                ]);

            //arrange the data
            var data = {
                url: userRestApi.get
            };

            var result;

            //act
            apiService.get(data).then(function (res) {
                result = res;
            });

            //flush the httpbackend to send the request
            http.flush();

            //assert
            expect(result.data.length).toBe(4);

        }));

        it("should return list with 1 user with Email = test@moller.no /api/users", inject(function () {

            //arrange
            http.when("GET", url + "users/")
                .respond(200, [
                    { "Email": "test@moller.no" }
                ]);

            //arrange the data
            var data = {
                url: userRestApi.get
            };

            var result;

            //act
            apiService.get(data).then(function (res) {
                result = res;
            });

            //flush the httpbackend to send the request
            http.flush();

            //assert
            expect(result.data[0].Email).toBe("test@moller.no");

        }));

        it("should return 401 Unauthorized when requesting /api/users/", inject(function () {

            //arrange
            http.when("GET", url + "users/").respond(401);

            //arrange the data
            var data = {
                url: userRestApi.get
            };

            var result;

            //act
            apiService.get(data).then(function (res) {
                result = res;
            }, function(err) {
                result = err;
            });

            //flush the httpbackend to send the request
            http.flush();

            //assert
            expect(result.status).toBe(401);

        }));
        
    });

    //test for get/:id request to userRestApi through apiRestServer
    describe("GET /users/:id", function () {

        //inject httpbackend to mock requests to the backend
        var http;

        //injects the $httpbackend mock from angular for each test case
        beforeEach(inject(function ($httpBackend) {
            http = $httpBackend;
        }));

        //remove the injected $httpbackend for each test case
        afterEach(function () {
            http = null;
        });

        it("should return 404 when requesting an user that doesn't exsist", inject(function () {

            //arrange
            http.when("GET", url + "users/3").respond(404);

            //arrange the data
            var data = {
                url: userRestApi.get +"3"
            };

            var result;

            //act
            apiService.get(data).then(function (res) {
                result = res;
            }, function (err) {
                result = err;
            });

            //flush the httpbackend to send the request
            http.flush();

            //assert
            expect(result.status).toBe(404);

        }));

        it("should return 401 when unauthorized to view the user", inject(function () {

            //arrange
            http.when("GET", url + "users/3").respond(401);

            //arrange the data
            var data = {
                url: userRestApi.get + "3"
            };

            var result;

            //act
            apiService.get(data).then(function (res) {
                result = res;
            }, function (err) {
                result = err;
            });

            //flush the httpbackend to send the request
            http.flush();

            //assert
            expect(result.status).toBe(401);

        }));

        it("should return 200 and an user when requesting user with id 3", inject(function () {

            //arrange
            http.when("GET", url + "users/3")
                .respond(200, {
                    Email: "test@moller.no"
                });

            //arrange the data
            var data = {
                url: userRestApi.get + "3"
            };

            var result;

            //act
            apiService.get(data).then(function (res) {
                result = res;
            }, function (err) {
                result = err;
            });

            //flush the httpbackend to send the request
            http.flush();

            //assert
            expect(result.status).toBe(200);

        }));

        it("should return 200 and an user with email 'test@moller.no' when requesting users/3", inject(function () {

            //arrange
            http.when("GET", url + "users/3")
                .respond(200, {
                    Email: "test@moller.no"
                });

            //arrange the data
            var data = {
                url: userRestApi.get + "3"
            };

            var result;

            //act
            apiService.get(data).then(function (res) {
                result = res;
            }, function (err) {
                result = err;
            });

            //flush the httpbackend to send the request
            http.flush();

            //assert
            expect(result.data.Email).toBe("test@moller.no");

        }));

    });

    //test for post request to the server. post request results in creating a new user
    describe("POST /users/", function () {

        //inject httpbackend to mock requests to the backend
        var http;

        //injects the $httpbackend mock from angular for each test case
        beforeEach(inject(function ($httpBackend) {
            http = $httpBackend;
        }));

        //remove the injected $httpbackend for each test case
        afterEach(function () {
            http = null;
        });

        it("should return 400 when posting to /users/ with unsupported fields", inject(function () {

            //arrange
            http.when("POST", url + "users/")
                .respond(400);

            //arrange the data
            var data = {
                url: userRestApi.post,
                data: {
                    "test":"test"
                }
            };

            var result;

            //act
            apiService.post(data).then(function (res) {
                result = res;
            }, function (err) {
                result = err;
            });

            //flush the httpbackend to send the request
            http.flush();

            //assert
            expect(result.status).toBe(400);

        }));

        it("should return 400 when posting to /users/ with missing Email field", inject(function () {

            //arrange
            http.when("POST", url + "users/")
                .respond(400, "missing Email field");

            //arrange the data
            var data = {
                url: userRestApi.post,
                data: {
                    "test": "test",
                    Password: "password",
                    ConfirmPassword: "password"
                }
            };

            var result;

            //act
            apiService.post(data).then(function (res) {
                result = res;
            }, function (err) {
                result = err;
            });

            //flush the httpbackend to send the request
            http.flush();

            //assert
            expect(result.status).toBe(400);

        }));

        it("should return 400 when posting to /users/ with missing Password field", inject(function () {

            //arrange
            http.when("POST", url + "users/")
                .respond(400, "missing Password field");

            //arrange the data
            var data = {
                url: userRestApi.post,
                data: {
                    Email: "test",
                    ConfirmPassword: "password"
                }
            };

            var result;

            //act
            apiService.post(data).then(function (res) {
                result = res;
            }, function (err) {
                result = err;
            });

            //flush the httpbackend to send the request
            http.flush();

            //assert
            expect(result.status).toBe(400);

        }));

        it("should return 400 when posting to /users/ with missing ConfirmPassword field", inject(function () {

            //arrange
            http.when("POST", url + "users/")
                .respond(400, "missing Password field");

            //arrange the data
            var data = {
                url: userRestApi.post,
                data: {
                    Email: "test",
                    Password:"passord"
                }
            };

            var result;

            //act
            apiService.post(data).then(function (res) {
                result = res;
            }, function (err) {
                result = err;
            });

            //flush the httpbackend to send the request
            http.flush();

            //assert
            expect(result.status).toBe(400);

        }));

        it("should return 400 when posting to /users/ when Password and ConfirmPassword don't match", inject(function () {

            //arrange
            http.when("POST", url + "users/").respond(400, "missing Password field");

            //arrange the data
            var data = {
                url: userRestApi.post,
                data: {
                    Email: "test",
                    Password: "passord",
                    ConfirmPassword: "passord1"
                }
            };

            var result;

            //act
            apiService.post(data).then(function (res) {
                result = res;
            }, function (err) {
                result = err;
            });

            //flush the httpbackend to send the request
            http.flush();

            //assert
            expect(result.status).toBe(400);

        }));

        it("should return 400 when posting to /users/ with invalid email adress", inject(function () {

            //arrange
            http.when("POST", url + "users/").respond(400, "invalid email");

            //arrange the data
            var data = {
                url: userRestApi.post,
                data: {
                    Email: "test@mollerno",
                    Password: "passord",
                    ConfirmPassword: "passord"
                }
            };

            var result;

            //act
            apiService.post(data).then(function (res) {
                result = res;
            }, function (err) {
                result = err;
            });

            //flush the httpbackend to send the request
            http.flush();

            //assert
            expect(result.status).toBe(400);

        }));

        it("should return 401 unauthorized when posting to /users/", inject(function () {

            //arrange
            http.when("POST", url + "users/").respond(401, "unauthorized");

            //arrange the data
            var data = {
                url: userRestApi.post,
                data: {
                    Email: "test@mollerno",
                    Password: "passord",
                    ConfirmPassword: "passord"
                }
            };

            var result;

            //act
            apiService.post(data).then(function (res) {
                result = res;
            }, function (err) {
                result = err;
            });

            //flush the httpbackend to send the request
            http.flush();

            //assert
            expect(result.status).toBe(401);

        }));

        it("should return 201 and password to be undefined in the return value when posting to /users/ with corrct Email Password and ConfirmPassword ", inject(function () {

            //arrange
            http.when("POST", url + "users/", data).respond(201, {Id:2, Email: "test@moller.no" });

            //arrange the data
            var data = {
                url: userRestApi.post,
                data: {
                    Email: "test@moller.no",
                    Password: "passord",
                    ConfirmPassword: "passord"
                }
            };

            var result;

            //act
            apiService.post(data).then(function (res) {
                result = res;
            }, function (err) {
                result = err;
            });

            //flush the httpbackend to send the request
            http.flush();

            //assert
            expect(result.data.Password).toBeUndefined();

        }));

        it("should return 201 and Id 2 when POST request to /users/", inject(function () {

            //arrange
            http.when("POST", url + "users/", data).respond(201, { Id: 2, Email: "test@moller.no" });

            //arrange the data
            var data = {
                url: userRestApi.post,
                data: {
                    Email: "test@moller.no",
                    Password: "passord",
                    ConfirmPassword: "passord"
                }
            };

            var result;

            //act
            apiService.post(data).then(function (res) {
                result = res;
            }, function (err) {
                result = err;
            });

            //flush the httpbackend to send the request
            http.flush();

            //assert
            expect(result.data.Id).toBe(2);

        }));

        it("should return 201 and Email to be the same as the returned Email when POST request to /users/", inject(function () {

            //arrange
            http.when("POST", url + "users/", data).respond(201, { Id: 2, Email: "test@moller.no" });

            //arrange the data
            var data = {
                url: userRestApi.post,
                data: {
                    Email: "test@moller.no",
                    Password: "passord",
                    ConfirmPassword: "passord"
                }
            };

            var result;

            //act
            apiService.post(data).then(function (res) {
                result = res;
            }, function (err) {
                result = err;
            });

            //flush the httpbackend to send the request
            http.flush();

            //assert
            expect(result.data.Email).toBe(data.data.Email);

        }));

    });

    //test delete request for an user entity
    describe("DELETE /users/:id", function () {

        //inject httpbackend to mock requests to the backend
        var http;

        //injects the $httpbackend mock from angular for each test case
        beforeEach(inject(function ($httpBackend) {
            http = $httpBackend;
        }));

        //remove the injected $httpbackend for each test case
        afterEach(function () {
            http = null;
        });

        it("should return 204 when deleteing user with id 3 at /users/3", inject(function () {

            //arrange
            http.when("DELETE", url + "users/3")
                .respond(204);

            //arrange the data
            var data = {
                url: userRestApi.del + "3"
            };

            var result;

            //act
            apiService.del(data).then(function (res) {
                result = res;
            }, function (err) {
                result = err;
            });

            //flush the httpbackend to send the request
            http.flush();

            //assert
            expect(result.status).toBe(204);

        }));

    });

    //test
    describe("PUT /users/:id", function () {

        //inject httpbackend to mock requests to the backend
        var http;

        //injects the $httpbackend mock from angular for each test case
        beforeEach(inject(function ($httpBackend) {
            http = $httpBackend;
        }));

        //remove the injected $httpbackend for each test case
        afterEach(function () {
            http = null;
        });

        it("Should return 200 when when PUT request to users/3", inject(function () {

            //arrange
            http.when("PUT", url + "users/3")
                .respond(200, {Id:3 ,Email: "test@moller.no"});

            //arrange the data
            var data = {
                url: userRestApi.put + "3",
                data: {
                    Id: 3,
                    Email: "test@mollerno",
                    Password: "passord",
                    ConfirmPassword: "passord"
                }
            };

            var result;

            //act
            apiService.put(data).then(function (res) {
                result = res;
            }, function (err) {
                result = err;
            });

            //flush the httpbackend to send the request
            http.flush();

            //assert
            expect(result.status).toBe(200);

        }));

        it("Should return 422 bad request when param and body id different", inject(function () {

            //arrange
            http.when("PUT", url + "users/3")
                .respond(422);

            //arrange the data
            var data = {
                url: userRestApi.put + "3",
                data: {
                    Id: 2,
                    Email: "test@mollerno",
                    Password: "passord",
                    ConfirmPassword: "passord"
                }
            };

            var result;

            //act
            apiService.put(data).then(function (res) {
                result = res;
            }, function (err) {
                result = err;
            });

            //flush the httpbackend to send the request
            http.flush();

            //assert
            expect(result.status).toBe(422);

        }));

        it("Should return 401 unauthorized when attempting to request PUT users/3 with invalid credentials", inject(function () {

            //arrange
            http.when("PUT", url + "users/3")
                .respond(401);

            //arrange the data
            var data = {
                url: userRestApi.put + "3",
                data: {
                    Id: 3,
                    Email: "test@mollerno",
                    Password: "passord",
                    ConfirmPassword: "passord"
                }
            };

            var result;

            //act
            apiService.put(data).then(function (res) {
                result = res;
            }, function (err) {
                result = err;
            });

            //flush the httpbackend to send the request
            http.flush();

            //assert
            expect(result.status).toBe(401);

        }));

    });

});