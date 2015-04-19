(function () {
    'use strict';

    angular
        .module('vt.time-entries')
        .controller('TimeEntryController', TimeEntryController);

    function TimeEntryController ($scope, $state, TimeEntryApiService) {
        $scope.id;

        activate();

        function activate () {
            $scope.id = $state.params.id;
        }

        function getTimeEntry () {
            TimeEntryApiService.get
        }
    }

})();