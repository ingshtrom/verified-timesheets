(function () {
  'use strict';

  angular
    .module('vt.time-entry')
    .controller('TimeEntryController', TimeEntryController);

  function TimeEntryController ($scope, $state, TimeEntryApiService, LoginService) {
    // API
    $scope.entries = [];

    activate();

    // IMPL

    // initialize stuff
    function activate () {
      var currentUser = LoginService.getCurrentSession();

      TimeEntryApiService.getEntriesForUser(currentUser.id)
        .then(function (data) {
          $scope.entries = data;
        })
        .catch(function () {
          // TODO: display an alert
          console.error('Error while getting the time entries for the current user.');
        });
    }
  }
})();
