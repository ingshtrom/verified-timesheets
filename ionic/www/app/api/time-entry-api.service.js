(function () {
  'use strict';

  angular
    .module('vt.api')
    .factory('TimeEntryApiService', TimeEntryApiService);

    function TimeEntryApiService ($http, $q, ApiErrorHandlingService, BASE_API_URL) {
      return {
        getEntriesForUser: function getTimeForUser (id) {
          var deferred = $q.defer();

          $http.get(BASE_API_URL + '/timeentries?user=' + id)
            .success(function (data) {
              deferred.resolve(data);
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
            .success(function (data) {
              deferred.resolve(data);
            })
            .error(function (err, status) {
              ApiErrorHandlingService.handleResponseError(err, statue);
              deferred.reject(err);
            });

          return deferred.promise;
        }
      };
    }
})();