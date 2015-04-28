(function () {
    'use strict';

    angular
        .module('vt.api')
        .factory('ApparatusApiService', ApparatusApiService);

    function ApparatusApiService($http, $q, ApiErrorHandlingService, BASE_API_URL) {
        return {
            getAllApparatuses: function getAllApparatuses () {
                var deferred = $q.defer();

                $http.get(BASE_API_URL + '/apparatuses')
                    .success(function (data, status) {
                        deferred.resolve({data: data, status: status});
                    })
                    .error(function (data, status) {
                        ApiErrorHandlingService.handleResponseError(data, status);
                        deferred.reject({data: data, status: status});
                    });

                return deferred.promise;
            },
            getApparatus: function getApparatus(id) {
                var deferred = $q.defer();

                $http.get(BASE_API_URL + '/apparatuses?id=' + id)
                    .success(function (data, status) {
                        deferred.resolve({data: data, status: status});
                    })
                    .error(function (data, status) {
                        ApiErrorHandlingService.handleResponseError(data, status);
                        deferred.reject({data: data, status: status});
                    });

                return deferred.promise;
            },
            createApparatus: function createApparatus(name, description) {
                var deferred = $q.defer();

                $http.post(BASE_API_URL + '/apparatuses', {
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
            updateApparatus: function updateApparatus(reason) {
                var deferred = $q.defer(),
                    id = reason.id;

                delete reason.id;

                $http.put(BASE_API_URL + '/apparatuses/' + id, reason)
                    .success(function (data, status) {
                        deferred.resolve({data: data, status: status});
                    })
                    .error(function (data, status) {
                        ApiErrorHandlingService.handleResponseError(data, status);
                        deferred.reject({data: data, status: status});
                    });

                return deferred.promise;
            },
            deleteApparatus: function deleteApparatus(id) {
                var deferred = $q.defer();

                $http.delete(BASE_API_URL + '/apparatuses/' + id)
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
