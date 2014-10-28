/*
test document resource api
*/
describe("document resource api", function() {
    //variables used in each test case
    var apiService;
    var documentRestApi;

    //var url = 'http://localhost:62639/api/v1/'; // Dev
    var url = 'http://api.mollerarkivet.no/api/v1/'; // Prod

    //inject modules into the test suite
    beforeEach(module('mollerarkivet.common.resources.api'));
    beforeEach(module('mollerarkivet.common.resources.document'));

    //inject the services into each test case
    beforeEach(inject(function (_apiService_, _documentRestApi_) {
        apiService = _apiService_;
        documentRestApi = _documentRestApi_;
    }));

    //clean and load the service for each test case.
    afterEach(function() {
        apiService = null;
        documentRestApi = null;
    });

    //check if the services has been injected
    describe("injected service", function () {

        it("apiService should not be null", function () {
            expect(apiService).not.toBe(null);
        });

        it("userRestApi should not be null", function () {
            expect(documentRestApi).not.toBe(null);
        });

    });

    //POST documents
    describe("POST documents/", function() {

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


        it("should return 400 when posting with unsupported fields", inject(function () {
            //arrange httpbackend
            http.when("POST", url + "documents/")
                .respond(400);

            //arrange the data
            var data = {
                url:documentRestApi.post,
                data:{
                    "test": "test",
                    "unsupported fields": "should not be supported"
                }
            };

            //arrange the result
            var result;
               
            //act and set the result baesd on error or success
            apiService.post(data).then(function(res) {
                result = res;
            }, function(error) {
                result = error;
            });

            //needs to flush the request to send apiService post
            http.flush();

            //assert
            expect(result.status).toBe(400);
        }));


        it("should return 400 when missing field Title", inject(function () {
            //arrange httpbackend
            http.when("POST", url + "documents/")
                .respond(400);

            //arrange the data
            var data = {
                url: documentRestApi.post,
                data: {
                    "test": "test",
                    "Description": "should not return 400 when missing the Title field which is required"
                }
            };

            //arrange the result
            var result;

            //act and set the result baesd on error or success
            apiService.post(data).then(function (res) {
                result = res;
            }, function (error) {
                result = error;
            });

            //needs to flush the request to send apiService post
            http.flush();

            //assert
            expect(result.status).toBe(400);
        }));

        it("should return 400 when field Title is an empty string", inject(function () {
            //arrange httpbackend
            http.when("POST", url + "documents/")
                .respond(400);

            //arrange the data
            var data = {
                url: documentRestApi.post,
                data: {
                    "Title": ""
                }
            };

            //arrange the result
            var result;

            //act and set the result baesd on error or success
            apiService.post(data).then(function (res) {
                result = res;
            }, function (error) {
                result = error;
            });

            //needs to flush the request to send apiService post
            http.flush();

            //assert
            expect(result.status).toBe(400);
        }));

        it("should return 400 when field Title is null", inject(function () {
            //arrange httpbackend
            http.when("POST", url + "documents/")
                .respond(400);

            //arrange the data
            var data = {
                url: documentRestApi.post,
                data: {
                    "Title": null
                }
            };

            //arrange the result
            var result;

            //act and set the result baesd on error or success
            apiService.post(data).then(function (res) {
                result = res;
            }, function (error) {
                result = error;
            });

            //needs to flush the request to send apiService post
            http.flush();

            //assert
            expect(result.status).toBe(400);
        }));


        it("should return 200 when title is not null or empty string", inject(function () {
            //arrange httpbackend
            http.when("POST", url + "documents/")
                .respond(200);

            //arrange the data
            var data = {
                url: documentRestApi.post,
                data: {
                    "Title": "mollervedtekter1950"
                }
            };

            //arrange the result
            var result;

            //act and set the result baesd on error or success
            apiService.post(data).then(function (res) {
                result = res;
            }, function (error) {
                result = error;
            });

            //needs to flush the request to send apiService post
            http.flush();

            //assert
            expect(result.status).toBe(200);
        }));

        it("should return 400 when description is set but no title", function() {
            //arrange httpbackend
            http.when("POST", url + "documents/")
                .respond(400);

            //arrange the data
            var data = {
                url: documentRestApi.post,
                data: {
                    "Title": "",
                    "Description": "Mollervedtekter 1950"
                }
            };

            //arrange the result
            var result;

            //act and set the result baesd on error or success
            apiService.post(data).then(function (res) {
                result = res;
            }, function (error) {
                result = error;
            });

            //needs to flush the request to send apiService post
            http.flush();

            //assert
            expect(result.status).toBe(400);
        });

        it("should return 400 when Tags is null", function () {
            //arrange httpbackend
            http.when("POST", url + "documents/")
                .respond(400);

            //arrange the data
            var data = {
                url: documentRestApi.post,
                data: {
                    "Title": "Mollervedtekter",
                    "Description": "Mollervedtekter 1950",
                    "Tags": null
        }
            };

            //arrange the result
            var result;

            //act and set the result baesd on error or success
            apiService.post(data).then(function (res) {
                result = res;
            }, function (error) {
                result = error;
            });

            //needs to flush the request to send apiService post
            http.flush();

            //assert
            expect(result.status).toBe(400);
        });

        it("should return 200 when Tags is an empty string", function () {
            //arrange httpbackend
            http.when("POST", url + "documents/")
                .respond(200);

            //arrange the data
            var data = {
                url: documentRestApi.post,
                data: {
                    "Title": "Mollervedtekter",
                    "Description": "Mollervedtekter 1950",
                    "Tags": ""
                }
            };

            //arrange the result
            var result;

            //act and set the result baesd on error or success
            apiService.post(data).then(function (res) {
                result = res;
            }, function (error) {
                result = error;
            });

            //needs to flush the request to send apiService post
            http.flush();

            //assert
            expect(result.status).toBe(200);
        });

        it("should return 200 when description is an empty string", function () {
            //arrange httpbackend
            http.when("POST", url + "documents/")
                .respond(200);

            //arrange the data
            var data = {
                url: documentRestApi.post,
                data: {
                    "Title": "Mollervedtekter",
                    "Description": "",
                    "Tags": "Vedtekter"
                }
            };

            //arrange the result
            var result;

            //act and set the result baesd on error or success
            apiService.post(data).then(function (res) {
                result = res;
            }, function (error) {
                result = error;
            });

            //needs to flush the request to send apiService post
            http.flush();

            //assert
            expect(result.status).toBe(200);
        });

        it("should return 200 when description is an empty string", function () {
            //arrange httpbackend
            http.when("POST", url + "documents/")
                .respond(200);

            //arrange the data
            var data = {
                url: documentRestApi.post,
                data: {
                    "Title": "Mollervedtekter",
                    "Description": "",
                    "Tags": "Vedtekter"
                }
            };

            //arrange the result
            var result;

            //act and set the result baesd on error or success
            apiService.post(data).then(function (res) {
                result = res;
            }, function (error) {
                result = error;
            });

            //needs to flush the request to send apiService post
            http.flush();

            //assert
            expect(result.status).toBe(200);
        });

        it("should return 400 when Published is set to null", function () {
            //arrange httpbackend
            http.when("POST", url + "documents/")
                .respond(400);

            //arrange the data
            var data = {
                url: documentRestApi.post,
                data: {
                    "Title": "Mollervedtekter",
                    "Description": "",
                    "Tags": "Vedtekter",
                    "Published":null
                }
            };

            //arrange the result
            var result;

            //act and set the result baesd on error or success
            apiService.post(data).then(function (res) {
                result = res;
            }, function (error) {
                result = error;
            });

            //needs to flush the request to send apiService post
            http.flush();

            //assert
            expect(result.status).toBe(400);
        });

        it("should return 200 when Published is set to true", function () {
            //arrange httpbackend
            http.when("POST", url + "documents/")
                .respond(200);

            //arrange the data
            var data = {
                url: documentRestApi.post,
                data: {
                    "Title": "Mollervedtekter",
                    "Description": "",
                    "Tags": "Vedtekter",
                    "Published": true
                }
            };

            //arrange the result
            var result;

            //act and set the result baesd on error or success
            apiService.post(data).then(function (res) {
                result = res;
            }, function (error) {
                result = error;
            });

            //needs to flush the request to send apiService post
            http.flush();

            //assert
            expect(result.status).toBe(200);
        });

        it("should return 200 when Published is set to false", function () {
            //arrange httpbackend
            http.when("POST", url + "documents/")
                .respond(200);

            //arrange the data
            var data = {
                url: documentRestApi.post,
                data: {
                    "Title": "Mollervedtekter",
                    "Description": "",
                    "Tags": "Vedtekter",
                    "Published": false
                }
            };

            //arrange the result
            var result;

            //act and set the result baesd on error or success
            apiService.post(data).then(function (res) {
                result = res;
            }, function (error) {
                result = error;
            });

            //needs to flush the request to send apiService post
            http.flush();

            //assert
            expect(result.status).toBe(200);
        });

        it("should return 400 when Granularity is set to null", function () {
            //arrange httpbackend
            http.when("POST", url + "documents/")
                .respond(400);

            //arrange the data
            var data = {
                url: documentRestApi.post,
                data: {
                    "Title": "Mollervedtekter",
                    "Description": "",
                    "Tags": "Vedtekter",
                    "Published": false,
                    "Granularity": null
                }
            };

            //arrange the result
            var result;

            //act and set the result baesd on error or success
            apiService.post(data).then(function (res) {
                result = res;
            }, function (error) {
                result = error;
            });

            //needs to flush the request to send apiService post
            http.flush();

            //assert
            expect(result.status).toBe(400);
        });

        it("should return 400 when Granularity is set to an empty string", function () {
            //arrange httpbackend
            http.when("POST", url + "documents/")
                .respond(400);

            //arrange the data
            var data = {
                url: documentRestApi.post,
                data: {
                    "Title": "Mollervedtekter",
                    "Description": "",
                    "Tags": "Vedtekter",
                    "Published": false,
                    "Granularity": ""
                }
            };

            //arrange the result
            var result;

            //act and set the result baesd on error or success
            apiService.post(data).then(function (res) {
                result = res;
            }, function (error) {
                result = error;
            });

            //needs to flush the request to send apiService post
            http.flush();

            //assert
            expect(result.status).toBe(400);
        });

        it("should return 200 when Granularity is set to an integer", function () {
            //arrange httpbackend
            http.when("POST", url + "documents/")
                .respond(200);

            //arrange the data
            var data = {
                url: documentRestApi.post,
                data: {
                    "Title": "Mollervedtekter",
                    "Description": "",
                    "Tags": "Vedtekter",
                    "Published": false,
                    "Granularity": 1
                }
            };

            //arrange the result
            var result;

            //act and set the result baesd on error or success
            apiService.post(data).then(function (res) {
                result = res;
            }, function (error) {
                result = error;
            });

            //needs to flush the request to send apiService post
            http.flush();

            //assert
            expect(result.status).toBe(200);
        });

        it("should return 200 when PublishDate is set to a long value", function () {
            //arrange httpbackend
            http.when("POST", url + "documents/")
                .respond(200);

            //arrange the data
            var data = {
                url: documentRestApi.post,
                data: {
                    "Title": "Mollervedtekter",
                    "Description": "",
                    "Tags": "Vedtekter",
                    "Published": false,
                    "Granularity": 1,
                    "PublishDate":1223
                }
            };

            //arrange the result
            var result;

            //act and set the result baesd on error or success
            apiService.post(data).then(function (res) {
                result = res;
            }, function (error) {
                result = error;
            });

            //needs to flush the request to send apiService post
            http.flush();

            //assert
            expect(result.status).toBe(200);
        });

        it("should return 400 when PublishDate is not a long value but a string", function () {
            //arrange httpbackend
            http.when("POST", url + "documents/")
                .respond(400);

            //arrange the data
            var data = {
                url: documentRestApi.post,
                data: {
                    "Title": "Mollervedtekter",
                    "Description": "",
                    "Tags": "Vedtekter",
                    "Published": false,
                    "Granularity": 1,
                    "PublishDate": "adf"
                }
            };

            //arrange the result
            var result;

            //act and set the result baesd on error or success
            apiService.post(data).then(function (res) {
                result = res;
            }, function (error) {
                result = error;
            });

            //needs to flush the request to send apiService post
            http.flush();

            //assert
            expect(result.status).toBe(400);
        });

        it("should return 400 when OriginalDate is not a long value but a string", function () {
            //arrange httpbackend
            http.when("POST", url + "documents/")
                .respond(400);

            //arrange the data
            var data = {
                url: documentRestApi.post,
                data: {
                    "Title": "Mollervedtekter",
                    "Description": "",
                    "Tags": "Vedtekter",
                    "Published": false,
                    "Granularity": 1,
                    "PublishDate": 123457677,
                    "OriginalDate": "adf"
                }
            };

            //arrange the result
            var result;

            //act and set the result baesd on error or success
            apiService.post(data).then(function (res) {
                result = res;
            }, function (error) {
                result = error;
            });

            //needs to flush the request to send apiService post
            http.flush();

            //assert
            expect(result.status).toBe(400);
        });

        it("should return 400 when OriginalDate is not a long value but a string", function () {
            //arrange httpbackend
            http.when("POST", url + "documents/")
                .respond(400);

            //arrange the data
            var data = {
                url: documentRestApi.post,
                data: {
                    "Title": "Mollervedtekter",
                    "Description": "",
                    "Tags": "Vedtekter",
                    "Published": false,
                    "Granularity": 1,
                    "PublishDate": 123457677,
                    "OriginalDate": "adf"
                }
            };

            //arrange the result
            var result;

            //act and set the result baesd on error or success
            apiService.post(data).then(function (res) {
                result = res;
            }, function (error) {
                result = error;
            });

            //needs to flush the request to send apiService post
            http.flush();

            //assert
            expect(result.status).toBe(400);
        });

        it("should return 200 when originalDate is a long value", function () {
            //arrange httpbackend
            http.when("POST", url + "documents/")
                .respond(200);

            //arrange the data
            var data = {
                url: documentRestApi.post,
                data: {
                    "Title": "Mollervedtekter",
                    "Description": "",
                    "Tags": "Vedtekter",
                    "Published": false,
                    "Granularity": 1,
                    "PublishDate": 123457677,
                    "OriginalDate": 123456687
                }
            };

            //arrange the result
            var result;

            //act and set the result baesd on error or success
            apiService.post(data).then(function (res) {
                result = res;
            }, function (error) {
                result = error;
            });

            //needs to flush the request to send apiService post
            http.flush();

            //assert
            expect(result.status).toBe(200);
        });

    });

});