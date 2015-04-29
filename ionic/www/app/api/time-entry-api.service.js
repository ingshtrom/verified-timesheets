(function () {
    'use strict';

    angular
        .module('vt.api')
        .factory('TimeEntryApiService', TimeEntryApiService);

    function TimeEntryApiService($http, $q, ApiErrorHandlingService, BASE_API_URL) {
        return {
            getEntriesForUser: function getTimeForUser (id) {
                var deferred = $q.defer();

                $http.get(BASE_API_URL + '/timeentries?user=' + id)
                    .success(function (data, status) {
                        deferred.resolve({ data: data, status: status });
                    })
                    .error(function (err, status) {
                        ApiErrorHandlingService.handleResponseError(err, status);
                        deferred.reject(err);
                    });

                return deferred.promise;
            },

            getEntriesForApproval: function getEntriesForApproval () {
                var deferred = $q.defer();

                $http.get(BASE_API_URL + '/timeentries?isApproved=false')
                    .success(function (data, status) {
                        deferred.resolve({data: data, status: status});
                    })
                    .error(function (err, status) {
                        ApiErrorHandlingService.handleResponseError(err, status);
                        deferred.reject(err);
                    });

                return deferred.promise;
            },

            getEntryById: function getEntryById (id) {
                var deferred = $q.defer();

                $http.get(BASE_API_URL + '/timeentries?id=' + id)
                    .success(function (data, status) {
                        deferred.resolve({data: data, status: status});
                    })
                    .error(function (err, status) {
                        ApiErrorHandlingService.handleResponseError(err, status);
                        deferred.reject(err);
                    });

                return deferred.promise;
            },
            deleteTimeEntry: function deleteTimeEntry (id) {
                var deferred = $q.defer();

                $http.delete(BASE_API_URL + '/timeentries/' + id)
                    .success(function (data, status) {
                        deferred.resolve({data: data, status: status});
                    })
                    .error(function (err, status) {
                        ApiErrorHandlingService.handleResponseError(err, status);
                        deferred.reject(err);
                    });

                return deferred.promise;
            }
        };
    }
})();