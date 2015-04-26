(function () {
    'use strict';

    angular
        .module('vt.time-entries')
        .controller('TimeEntryController', TimeEntryController);

    function TimeEntryController($scope, $state, $cordovaDatePicker, TimeEntryApiService) {
        var dateOptions = {
                date: new Date(),
                mode: 'date',
                allowOldDates: true,
                allowFutureDates: true,
                doneButtonLabel: 'DONE',
                doneButtonColor: '#F2F3F4',
                cancelButtonLabel: 'CANCEL',
                cancelButtonColor: '#000000'
            }, timeOptions = {
                date: new Date(),
                mode: 'time',
                allowOldDates: true,
                allowFutureDates: true,
                doneButtonLabel: 'DONE',
                doneButtonColor: '#F2F3F4',
                cancelButtonLabel: 'CANCEL',
                cancelButtonColor: '#000000',
                minuteInterval: 15
            };

        $scope.id;
        $scope.timeEntry = {};

        init();

        function init() {
            $scope.id = $state.params.id;
            TimeEntryApiService
                .getEntryById($scope.id)
                .then(function (data) {
                    $scope.timeEntry = data;
                });
        }
    }

})();