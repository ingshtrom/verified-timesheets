(function () {
    'use strict';

    angular
        .module('vt.api')
        .factory('TimeEntryApiService', TimeEntryApiService);

    function TimeEntryApiService($http, $q, ApiErrorHandlingService, BASE_API_URL) {
        return {
            getEntriesForUser: function getTimeForUser (id) {
                var deferred = $q.defer();

                $http.get(BASE_API_URL + '/timeentries?user=' + id + '&sort=endDateTime%20ASC')
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

                $http.get(BASE_API_URL + '/timeentries?isApproved=false&sort=endDateTime%20ASC')
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
            },
            createTimeEntry: function createTimeEntry (entry) {
                var deferred = $q.defer(),
                    saveObj = {
                        startDateTime: new Date(entry.startDateTime),
                        endDateTime: new Date(entry.endDateTime),
                        notes: entry.notes,
                        userCoveredFor: entry.userCoveredFor.id,
                        reason: entry.reason.id,
                        apparatus: entry.apparatus.id
                    };

                $http.post(BASE_API_URL + '/timeentries', saveObj)
                    .success(function (data, status) {
                        deferred.resolve({data: data, status: status});
                    })
                    .error(function (data, status) {
                        ApiErrorHandlingService.handleResponseError(data, status);
                        deferred.reject({data: data, status: status});
                    });

                return deferred.promise;
            },
            updateTimeEntry: function updateTimeEntry (entry) {
                var deferred = $q.defer(),
                    id = entry.id;

                delete entry.id;

                entry.apparatus = entry.apparatus.id;
                entry.reason = entry.reason.id;
                entry.user = entry.user.id;
                entry.userCoveredFor = entry.userCoveredFor.id;
                entry.startDateTime = new Date(entry.startDateTime);
                entry.endDateTime = new Date(entry.endDateTime);

                $http.put(BASE_API_URL + '/timeentries/' + id, entry)
                    .success(function (data, status) {
                        deferred.resolve({data: data, status: status});
                    })
                    .error(function (data, status) {
                        ApiErrorHandlingService.handleResponseError(data, status);
                        deferred.reject({data: data, status: status});
                    });

                return deferred.promise;
            },
            approveTimeEntry: function approveTimeEntry (id) {
                var deferred = $q.defer();

                $http.post(BASE_API_URL + '/timeentries/approve/' + id, {})
                    .success(function (data, status) {
                        deferred.resolve({data: data, status: status});
                    })
                    .error(function (data, status) {
                        ApiErrorHandlingService.handleResponseError(data, status);
                        deferred.reject({data: data, status: status});
                    });

                return deferred.promise;
            },
            generateReport: function generateReport () {
                var deferred = $q.defer();

                $http.post(BASE_API_URL + '/timeentries/report/generate', {})
                    .success(function (data, status) {
                        deferred.resolve({data: data, status: status});
                    })
                    .error(function (data, status) {
                        ApiErrorHandlingService.handleResponseError(data, status);
                        deferred.reject({data: data, status: status});
                    });

                return deferred.promise;
            }
        };
    }
})();