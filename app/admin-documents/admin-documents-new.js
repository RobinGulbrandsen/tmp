var mod = angular.module('mollerarkivet.admin-documents-new', [
    'ui.router',
    'ui.bootstrap',
    'ngTagsInput',
    'mollerarkivet.common.error',
    'mollerarkivet.common.validators',
    'mollerarkivet.common.resources.document',
    'mollerarkivet.common.resources.api',
    'mollerarkivet.admin-documents-common'
]);

mod.config(function ($stateProvider) {
    $stateProvider.state('documents-new', {
        abstract:true,
        url: '/documents/new',
        views: {
            "main": {
                templateUrl: 'admin-documents/admin-documents-new.tpl.html'
            },
            "menu": {
                templateUrl: 'common/menu.tpl.html'
            }
        },
        data: { pageTitle: 'ADMIN DOCUMENTS NEW' }
    })
    .state('documents-new.index', {
        url:"",
        controller: 'adminDocumentsNewCtrl',
        templateUrl: 'admin-documents/admin-documents-meta-information.tpl.html'
    });
});

mod.controller('adminDocumentsNewCtrl', ['$scope', '$state','$translate','documentsCommon','errorService','validatorService','apiService', 'documentRestApi', adminDocumentsNewCtrl]);

function adminDocumentsNewCtrl($scope, $state,$translate, documentsCommon, errorService, validatorService, apiService, documentRestApi) {

    //add common settings to the document controller on this controller's scope
    documentsCommon.documentMetaInformation($scope);

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
            var url = documentRestApi.post;
            var data = documentsCommon.buildData(url, document);

            //send the request
            apiService.post(data).then(function (result) {
                $state.go("documents-edit.attachments", { Id: result.data.Id });
                loadingSpinner.close();
            }, function(error) {
                loadingSpinner.close();
                errorService.errorCode(error.status);
            });

        }
        else {
            //display if the title is missing
            $scope.titleNotValid = true;
        }

    };



}
