var mod = angular.module('mollerarkivet.admin-documents-edit', [
    'ui.router',
    'ui.bootstrap',
    'ngTagsInput',
    'mollerarkivet.common.authentication',
    'mollerarkivet.common.error',
    'mollerarkivet.common.validators',
    'mollerarkivet.common.resources.document',
    'mollerarkivet.common.resources.api',
    'mollerarkivet.admin-documents-common',
    'angularFileUpload'
]);

mod.config(function ($stateProvider) {
    $stateProvider.state('documents-edit', {
        url: '/documents/edit/:Id',
        views: {
            "main": {
                controller: 'adminDocumentsEditCtrl',
                templateUrl: 'admin-documents/admin-documents-edit.tpl.html'
            },
            "menu": {
                templateUrl: 'common/menu.tpl.html'
            }
        },
        data: { pageTitle: 'Rediger dokument' }
    })

    .state('documents-edit.information', {
        url: '/information',
        views: {
            "edit": {
                controller: 'tabMetaInformationCtrl',
                templateUrl: 'admin-documents/admin-documents-meta-information.tpl.html'
            }
        },
        data: { pageTitle: 'Rediger dokumentinformasjon' }

    })

    .state('documents-edit.attachments', {
        url:'/attachments',
        views: {
            "edit": {
                controller: 'tabAttachmentsCtrl',
                templateUrl: 'admin-documents/admin-documents-file-upload.tpl.html'
            }
        },
        data: { pageTitle: 'Rediger dokument vedlegg' }

    });
});


mod.controller('adminDocumentsEditCtrl', ['$scope','$state' ,'$stateParams', 'authService', 'errorService', 'documentsCommon','apiService', 'documentRestApi', adminDocumentsEditCtrl]);

mod.controller('tabMetaInformationCtrl', ['$scope', '$state', 'authService', '$translate', 'errorService', 'validatorService', 'documentsCommon', 'apiService', 'documentRestApi', tabMetaInformationCtrl]);

mod.controller('tabAttachmentsCtrl', ['$scope', '$state', 'authService', '$interval', 'errorService', 'validatorService', 'documentsCommon', 'apiService', 'documentRestApi', tabAttachmentsCtrl]);

function adminDocumentsEditCtrl($scope, $state, $stateParams, authService, errorService,documentsCommon, apiService, documentRestApi) {
    $scope.Id = $stateParams.Id;
    $scope.document = {
    };

    documentsCommon.documentMetaInformation($scope);

    //get the document
    $scope.getDocument = function() {
        var params = {
            url: documentRestApi.get + $scope.Id
        };

        //show loadingspinner when getting the document
        var loadingSpinner = errorService.loadingSpinner();

        apiService.get(params).then(function (result) {
            loadingSpinner.close();
            
            //convert the date fields to date format if they are defined
            $scope.document = result.data;

            $scope.document.OriginalDate = new Date(result.data.OriginalDate );

            //multiply with 1000 beacause of the server needs the unix time in seconds not milliseconds
            $scope.document.PublishDate = new Date(result.data.PublishDate * 1000 );
            
            //select the correct granularity level text
            angular.forEach($scope.granularityItems, function (gran) {
                if (gran.level == $scope.document.Granularity) {
                    $scope.selectedGranularityName = gran.name;
                }
            });
            
            

        }, function (error) {
            loadingSpinner.close();
            if (error.status == 401) {
                authService.logOut().then(function () {
                    $state.go("login");
                });
            }
            else if (error.status == 422){
                $state.go("documents");
            }
            
        });
    };

    //load the document
    $scope.getDocument();

}

function tabMetaInformationCtrl($scope, $state, authService, $translate, errorService, validatorService, documentsCommon, apiService, documentRestApi) {

    //bind common settings for granularity items datepicker etc on the scope for this controller
    

    //save documents
    $scope.saveDocument = function () {
        
        if (validatorService.documentTitle($scope.document.Title)) {
            //remove the error message
            $scope.titleNotValid = false;

            //load the spinner while sending the request
            var loadingSpinner = errorService.loadingSpinner();

            //copy the document to it's own variable. not manipulating the scope document
            var document = documentsCommon.convertData($scope.document);

            //build the data and url to post
            var url = documentRestApi.put + $scope.Id;
            var data = documentsCommon.buildData(url, document);

            //send the request
            apiService.put(data).then(function (result) {
                
                //TODO: display success messages on successful update
                loadingSpinner.close();

                $state.go("documents-edit.information", { Id: result.data.Id });
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

        }
        else {
            //display if the title is missing
            $scope.titleNotValid = true;
        }

    };


    var setupColorOnNavigation = function () {
        document.getElementById("document-edit-meta").className = "btn btn-active";
        document.getElementById("document-edit-attatchment").className = "btn";
    };
    setupColorOnNavigation();
}

function tabAttachmentsCtrl($scope, $state, authService, $interval, errorService, validatorService, documentsCommon, apiService, documentRestApi) {

    //interval request for status on document when the document is still under progress
    var interval = null;

    //status == 3 means that the document is in progress 
    $scope.$watch("document.Status", function () {
        if ($scope.document.Status == 3) {

            //save the interval
            interval = $interval(function() {

                //check the status on the document every 2 seconds
                var params = {
                    url: documentRestApi.get + $scope.document.Id + "/" + documentRestApi.status
                };

                //send request to the server
                apiService.get(params).then(function(result) {

                        //if the doucment has changed the status update the document and refresh the list
                        if (result.data != 3) {
                            $state.go("documents-edit.attachments", {
                                Id: $scope.document.Id
                            }, { reload: true });
                            $interval.cancel(interval);
                        }
                    },
                    function(error) {
                        //401 go to documents page
                        if (error.status == 401) {
                            authService.logOut().then(function () {
                                $state.go("login");
                            });

                        }
                    });
                //2000 ms interval every time to check the request.
            }, 5000);
        }
    });


//destroy the interval when chaning the controller
    $scope.$on("$destroy", function() {
        $interval.cancel(interval);
    });

    //files list when adding files to upload
    $scope.files = [];

    //whenever adding one ore more files append to the setDocumentList
    $scope.onFileSelect = function ($files) {
        //errormesage
        $scope.errorWrongFileType = false;

        //try to add files to the list only if the file has a valid filetype
        angular.forEach($files, function (file) {
            if (validatorService.checkFileType(file.name)) {
                setDocumentList(file);
            }
            else {
                $scope.errorWrongFileType = true;
            }

        });
    };

    //Set method to update document list after doucments have been selected. appends to the list
    var setDocumentList = function (data) {
        //error message
        $scope.errorDocumentAndImage = false;
        
        //if list is empty add the element
        if ($scope.files.length === 0) {
            $scope.files.push(data);
        }
        //loop through the list to check if the file is already added
        var exists = false;
        angular.forEach($scope.files, function (file) {
            if (file.name == data.name) {
                exists = true;
            }
        });
        //add only if the file doesn't exists in the list
        if (!exists) {
            $scope.files.push(data);
        }

        //if the file list contains both documents and images. remove the inserted file adn display the error message
        if (!validatorService.checkFileList(angular.copy($scope.files))) {
            $scope.errorDocumentAndImage = true;
            var index = $scope.files.indexOf(data);
            $scope.files.splice(index,1);
        }

    };

    $scope.removeDocument = function (index) {
        $scope.files.splice(index, 1);
    };

    //save the files to the document to server function. whenver clicking the upload button.
    $scope.uploadFiles = function () {
        if ($scope.files.length === 0) {
            return;
        }

        var params = {
            url: documentRestApi.post + $scope.Id + documentRestApi.attachement,
            files: $scope.files
        };
        
        var loadingSpinner = errorService.loadingSpinner();
        apiService.uploadFiles(params)
        .then(function (result) {
            loadingSpinner.close();
            $state.go("documents-edit.attachments", { Id: $scope.document.Id },{reload:true});
            

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


    //Add sortable to the spesified DOM element
    var addSortable = function (element) {
        new Sortable(element, {
            onUpdate: function (evt) {
                // get new sort order based on indexes
                var newSortIndexes = [];
                var liElements = element.getElementsByTagName("li");
                for (var i = 0; i < liElements.length; i++) {
                    newSortIndexes.push(liElements[i].getAttribute('data-index'));
                }

                // Updates the document list on scope based on new indexes
                $scope.files = getSorted($scope.files, newSortIndexes);
            }
        });

        //Private method updating index after the list have been updated
        function getSorted(arr, sortArr) {
            var result = [];
            for (var i = 0; i < arr.length; i++) {
                result[i] = arr[sortArr[i]];
            }
            return result;
        }
    };
    addSortable(document.getElementById("document-list"));


    $scope.saveRawText = function () {
        var document = documentsCommon.convertData($scope.document);

        var params={
            url: documentRestApi.put + "/" + document.Id,
            data: document
        };
        console.log(document);
        var loadingSpinner = errorService.loadingSpinner();

        apiService.put(params).then(function (result) {
            loadingSpinner.close();
            $state.go("documents-edit.attachments", { Id: $scope.Id }, { reload: true });
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

    var setupColorOnNavigation = function() {
        document.getElementById("document-edit-meta").className = "btn";
        document.getElementById("document-edit-attatchment").className = "btn btn-active";
    };
    setupColorOnNavigation();
}
