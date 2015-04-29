(function () {
    'use strict';

    angular
        .module('vt.api')
        .factory('ReasonApiService', ReasonApiService);

    function ReasonApiService ($http, $q, ApiErrorHandlingService, BASE_API_URL) {
        return {
            getReasons: function getReasons () {
                var deferred = $q.defer();

                $http.get(BASE_API_URL + '/reasons')
                    .success(function (data, status) {
                        deferred.resolve({data: data, status: status});
                    })
                    .error(function (data, status) {
                        ApiErrorHandlingService.handleResponseError(data, status);
                        deferred.reject({data: data, status: status});
                    });

                return deferred.promise;
            },
            getReason: function getReason (id) {
                var deferred = $q.defer();

                $http.get(BASE_API_URL + '/reasons?id=' + id)
                    .success(function (data, status) {
                        deferred.resolve({data: data, status: status});
                    })
                    .error(function (data, status) {
                        ApiErrorHandlingService.handleResponseError(data, status);
                        deferred.reject({data: data, status: status});
                    });

                return deferred.promise;
            },
            createReason: function createReason (name, description) {
                var deferred = $q.defer();

                $http.post(BASE_API_URL + '/reasons', {
                        name: name,
                        description: description || ''
                    })
                    .success(function (data, status) {
                        deferred.resolve({data: data, status: status});
                    })
                    .error(function (data, status) {
                        ApiErrorHandlingService.handleResponseError(data, status);
                        deferred.reject({data: data, status: status});
                    });

                return deferred.promise;
            },
            updateReason: function updateReason (reason) {
                var deferred = $q.defer(),
                    id = reason.id;

                delete reason.id;

                $http.put(BASE_API_URL + '/reasons/' + id, reason)
                    .success(function (data, status) {
                        deferred.resolve({data: data, status: status});
                    })
                    .error(function (data, status) {
                        ApiErrorHandlingService.handleResponseError(data, status);
                        deferred.reject({data: data, status: status});
                    });

                return deferred.promise;
            },
            deleteReason: function deleteReason (id) {
                var deferred = $q.defer();

                $http.delete(BASE_API_URL + '/reasons/' + id)
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
