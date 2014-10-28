var mod = angular.module('mollerarkivet.admin-documents', [
    'ui.router',
    'ui.bootstrap',
    'mollerarkivet.common.error',
    'mollerarkivet.common.spinner',
    'mollerarkivet.common.authentication'
]);

mod.config(function config($stateProvider) {
    $stateProvider.state('documents', {
        url: '/documents',
        views: {
            "main": {
                controller: 'adminDocumentsCtrl',
                templateUrl: 'admin-documents/admin-documents.tpl.html'
            },
            "menu": {
                templateUrl: 'common/menu.tpl.html'
            }
        },
        data: { pageTitle: 'Dokumenter' }
    });
});

mod.controller('adminDocumentsCtrl', ['$scope', '$rootScope', '$state', '$translate', 'authService', 'apiService', 'documentRestApi', 'errorService', 'mollerSpinnerService', adminDocumentsCtrl]);

function adminDocumentsCtrl($scope, $rootScope, $state, $translate, authService, apiService, documentRestApi, errorService, mollerSpinnerService) {
    
    //TODO: Hardcoded text waiting for a solution to this problem with pagination text when using angular translate
    $scope.nextText = "Neste";
    $scope.previousText = "Forrige";
   
    // Her skal authservicefunksjoner kalles, og det skal lages logikk for onsuccess og onfailure.
    $scope.newDocument = function () {
        $state.go("documents-new.index");
    };
    
    //whenever clicking a document
    $scope.editDocument = function(Id) {
        $state.go("documents-edit.information", { Id: Id });
    };

    //delete document
    $scope.deleteDocument = function (Id, Title, index) {
        var self = $scope;
        errorService.confirmation(Title, index).result
            .then(function(result) {
                var data = {
                    url: documentRestApi.del + Id
                };
                self.documentList.splice(index, 1);

                apiService.del(data).then(function(result) {
                
                },function(error) {
                    if (Error.status == 401) {
                        authService.logOut()
                            .then(function(success) {
                                $state.go("login");
                            });
                    }
            });
   
        });
    };

    //default values start at pageNumber 0 and pagesize for the documents
    var params = {
        pageNumber: 0,
        pageSize: 30
    };

    //when entering a query. the page is set to zero and adds the query to the params 
    $scope.search = function(query) {
        params.pageNumber = 0;
        params.search = query;
        loadList(params);
    };

    //whenever changing a page in the pagination loadlist and select page
    $scope.pageChanged = function (page) {
        params.pageNumber = page - 1;
        loadList(params);
    };

    //loads and displays the list
    var loadList = function (params) {
        var data = {
            url: documentRestApi.get,
            params: params
        };

        $scope.showLoader = true;
        $scope.showNoResults = false;

        //get the list based on params parameters. t
        apiService.get(data).then(function (result) {
            $scope.documentList = [];
            //set results and page numbers to the paginater
            var documents  = result.data;
            $scope.pageNumber = result.data.PageNumber + 1;
            $scope.pageSize = result.data.PageSize;
            $scope.totalCount = result.data.TotalCount;

            if (result.data.Documents.length === 0) {
                $scope.showNoResults = true;
            }

            
            angular.forEach(documents.Documents, function (document) {
                document.PublishDate = new Date(document.PublishDate*1000);
                $scope.documentList.push(document);
            });
            //remove the loader
            $scope.showLoader = false;

        }, function (error) {
            $scope.showLoader = false;

            if (error.status == 401) {
                authService.logOut().then(function () {
                    $state.go("login");
                });
            }
           
        });
    };

    var target = document.getElementById('spinnerHolder');
    new Spinner(mollerSpinnerService.blackSpinnerOptions()).spin(target);

    //loads the list. get all documents
    loadList(params);

}

