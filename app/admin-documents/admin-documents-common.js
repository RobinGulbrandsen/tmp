var mod = angular.module('mollerarkivet.admin-documents-common', [
    'ui.router',
    'mollerarkivet.common.resources.api',
    'mollerarkivet.common.resources.tags',
    'underscoreService'
]);

mod.factory("documentsCommon", ['$state','$translate','apiService','tagsRestApi', '$q', '_', documentsCommon]);

function documentsCommon($state,$translate,apiService, tagsRestApi, $q, _) {

    var tags = [];

    return {

        //common document meta information. binds onto the scope of the
        documentMetaInformation: function ($scope) {           

            //load tags list when creating new document
            this.loadTags();

            //Setting up the granularity options
            $scope.granularityItems = null;
            this.granularityItems().then(function (data) {
                $scope.granularityItems = data;
            }, function() {
                console.log(arguments);
            });

            //TODO: Language, change hardcoded text
            $scope.tagsInputText = "Legg til en tag..";

            //set Common settings for documents
            $scope.granularity = this.selectGranularity();
            $scope.datePickerFormat = this.setDateFormat();
            $scope.openOriginalDatePicker = this.openOriginalDatePicker();
            $scope.openPublishDatePicker = this.openOriginalDatePicker();
            $scope.loadTags = this.searchTags;

            //Setting the granularity dropdowns default text
            $scope.selectedGranularityName = "";
            $translate("documents.SELECTED_GRANULARITY").then(function (data) {
                $scope.selectedGranularityName = data;
            });

            //Function to update granularity on object
            $scope.selectGranularity = function (granularity) {
                $scope.selectedGranularityName = granularity.name;
                $scope.selectedGranularityLevel = granularity.level;
                $scope.document.Granularity = granularity.level;
            };
           

            //cancel function to go back to documents list.
            $scope.cancel = this.cancel;
        },

        
        granularityItems: function () {

            //initiates variables and levels
            var promises = [];
            var translations = [0, 4, 6, 8];

            //Creates promisses for each level to get the text
            angular.forEach(translations, function(translationIndex) {
                var deferred = $q.defer();
                var translationKey = "documents.granularity.LEVEL_" + translationIndex;

                //On return adds the level and value
                $translate(translationKey).then(function(data) {
                    deferred.resolve({
                        level: translationIndex,
                        name: data
                    });
                }, function() {
                    deferred.reject(arguments);
                });

                //Ands the promis to the list
                promises.push(deferred.promise);
            });

            //when all promises are complete. return the data
            return $q.all(promises);
        },

        //
        selectGranularity : function(granularity) {
            return granularity;
        },

        //dateformat when selcting a date displayed in the date picker
        setDateFormat : function() {
            return "dd.MM.yyyy";
        },

        //originalDatePicker
        openOriginalDatePicker: function () {
            return function($scope,$event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.openedOriginalDate = true;
            };

        },

        //for opening the publish date datepicker popup
        openPublishDatePicker : function () {
            return function($scope, $event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.openedPublishDate = true;
            };

        },

        //cancel button go back to document list
        cancel: function() {
            $state.go("documents");
        },

        //build data based fields
        buildData: function(url, data) {
            return {
                url: url,
                data: data
            };
        },

        //convert the scope document data to api friendly data
        convertData: function(data) {
            var document = angular.copy(data);

            //foreach the document
            var tags = [];
            angular.forEach(data.Tags, function (tag) {
                this.push(tag.text);
            }, tags);

            document.Tags = tags;

            //convert to unixtimestring
            if (document.PublishDate) {
                document.PublishDate = document.PublishDate.getTime()/1000;
            }
            if (document.OriginalDate) {
                document.OriginalDate = document.OriginalDate.getTime();
            }

            //get the granularity level
            if (document.Granularity) {
                document.Granularity = document.Granularity;
            }
            return document;
        },

        loadTags: function () {
            var params = {
                url: tagsRestApi.get
            };
            return apiService.get(params).then(function(result) {
                tags = result.data;
            });

        },

        searchTags: function (query) {
            var deferred = $q.defer();
            var result =_.chain(tags)
                .filter(function (x) { return x.toLowerCase().indexOf(query.toLowerCase()) > -1; })
                .take(10)
                .value();
        
            deferred.resolve(result);
            return deferred.promise;

        }



    };
}