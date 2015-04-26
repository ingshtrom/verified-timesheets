(function () {
    'use strict';

    angular
        .module('vt.api')
        .factory('ReasonApiService', ReasonApiService);

    function ReasonApiService ($http, $q, ApiErrorHandlingService, BASE_API_URL) {
        return {
            getAllReasons: function getAllReasons () {
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
            }
        };
    }
})();
