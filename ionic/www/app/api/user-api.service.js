(function () {
  'use strict';
  angular.module('vt.api')
  .factory('UserApiService', UserApiService);

  function UserApiService ($http, $q, ApiErrorHandlingService, BASE_API_URL) {
    return {
      login: function login (email, password) {
        var deferred = $q.defer();

        $http.post(BASE_API_URL + '/login', { email: email, password: password})
          .success(function (data, status) {
            deferred.resolve({ data: data, status: status });
          })
          .error(function (data, status) {
            deferred.reject({ data: data, status: status });
          });

        return deferred.promise;
      },
      logout: function logout () {
        var deferred = $q.defer();

        $http.delete(BASE_API_URL + '/logout')
          .success(function (data, status) {
            deferred.resolve({ data: data, status: status });
          })
          .error(function (data, status) {
            ApiErrorHandlingService.handleResponseError(data, status);
            deferred.reject({ data: data, status: status });
          });

        return deferred.promise;
      }
    };
  }
})();