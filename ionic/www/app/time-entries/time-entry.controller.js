(function () {
    'use strict';

    angular
        .module('vt.time-entries')
        .controller('TimeEntryController', TimeEntryController);

    function TimeEntryController($scope, $state, $cordovaDatePicker, TimeEntryApiService) {
        $scope.id;
        $scope.timeEntry = {};

        activate();

        function activate() {
            $scope.id = $state.params.id;
            TimeEntryApiService
                .getEntryById($scope.id)
                .then(function (data) {
                    $scope.timeEntry = data;
                    $cordovaDatePicker.show({
                        date: new Date(),
                        mode: 'date', // or 'time'
                        minDate: new Date(),
                        allowOldDates: true,
                        allowFutureDates: true,
                        doneButtonLabel: 'DONE',
                        doneButtonColor: '#F2F3F4',
                        cancelButtonLabel: 'CANCEL',
                        cancelButtonColor: '#000000'
                    }).then(function (value) { console.log('foobar' + value); });
                });
        }
    }

})();