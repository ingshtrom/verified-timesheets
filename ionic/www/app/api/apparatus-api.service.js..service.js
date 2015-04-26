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
            }
        };
    }
})();
