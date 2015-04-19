(function () {
  'use strict';

  angular
    .module('vt.api')
    .factory('ApiErrorHandlingService', function($state) {
      return {
        handleResponseError: function handleResponseError (data, status) {
          if (status === 403 && data && data.status === 'error' && data.reason === 'failed-login') {
            $state.go('app.login');
          }
        }
      };
    });

})();
