(function () {
    'use strict';

    angular
        .module('vt.time-entries')
        .controller('TimeEntryController', TimeEntryController);

    function TimeEntryController($scope, $state, $ionicPopup, TimeEntryApiService, UserApiService, ReasonApiService, ApparatusApiService) {
        var data = $scope.data = {},
            func = $scope.func = {};
        //var dateOptions = {
        //        date: new Date(),
        //        mode: 'date',
        //        allowOldDates: true,
        //        allowFutureDates: true,
        //        doneButtonLabel: 'DONE',
        //        doneButtonColor: '#F2F3F4',
        //        cancelButtonLabel: 'CANCEL',
        //        cancelButtonColor: '#000000'
        //    }, timeOptions = {
        //        date: new Date(),
        //        mode: 'time',
        //        allowOldDates: true,
        //        allowFutureDates: true,
        //        doneButtonLabel: 'DONE',
        //        doneButtonColor: '#F2F3F4',
        //        cancelButtonLabel: 'CANCEL',
        //        cancelButtonColor: '#000000',
        //        minuteInterval: 15
        //    };

        data.timeEntry = {};
        data.users = [];
        data.reasons = [];
        data.apparatuses = [];

        func.save = save;

        init();

        function init() {
            getTimeEntry();
            getUsers();
            getReasons();
            getApparatuses();
        }

        function getTimeEntry () {
            data.timeEntry.id = $state.params.id;
            TimeEntryApiService
                .getEntryById(data.timeEntry.id)
                .then(function (result) {
                    data.timeEntry = result.data;
                });
        }

        function getUsers () {
            UserApiService
                .getUsers()
                .then(function (result) {
                    data.users = result.data;
                })
                .catch(function (err) {
                    console.error('An error occurred while getting the users list: ' + err);
                    $ionicPopup
                        .alert({
                            title: 'Error',
                            template: 'An error occurred while getting the list of users. Please try again.'
                        });
                });
        }

        function getReasons () {
            ReasonApiService
                .getReasons()
                .then(function (result) {
                    data.reasons = result.data;
                })
                .catch(function (err) {
                    console.error('An error occurred while getting the reasons list: ' + err);
                    $ionicPopup
                        .alert({
                            title: 'Error',
                            template: 'An error occurred while getting the list of reasons. Please try again.'
                        });
                });
        }

        function getApparatuses () {
            ApparatusApiService
                .getApparatuses()
                .then(function (result) {
                    data.apparatuses = result.data;
                })
                .catch(function (err) {
                    console.error('An error occurred while getting the apparatus list: ' + err);
                    $ionicPopup
                        .alert({
                            title: 'Error',
                            template: 'An error occurred while getting the list of apparatuses. Please try again.'
                        });
                });
        }

        function save() {
            var action;

            if (!data.timeEntry.userCoveredFor) {
                return $ionicPopup
                    .alert({
                        title: 'Invalid Data',
                        template: 'The "Covered For" field is required.'
                    });
            }

            if (!data.timeEntry.reason) {
                return $ionicPopup
                    .alert({
                        title: 'Invalid Data',
                        template: 'The "Reason" field is required.'
                    });
            }

            if (!data.timeEntry.apparatus) {
                return $ionicPopup
                    .alert({
                        title: 'Invalid Data',
                        template: 'The "Apparatus" field is required.'
                    });
            }

            if (!data.timeEntry.startDateTime) {
                return $ionicPopup
                    .alert({
                        title: 'Invalid Data',
                        template: 'The "Start Date" and "Start Time" fields are required.'
                    });
            }

            if (!data.timeEntry.endDateTime) {
                return $ionicPopup
                    .alert({
                        title: 'Invalid Data',
                        template: 'The "End  Date" and "End  Time" fields are required.'
                    });
            }

            if (data.editMode) {
                action = ReasonApiService.updateReason({
                    id: data.id,
                    name: data.name,
                    description: data.description
                });
            } else {
                action = ReasonApiService.createReason(data.name, data.description);
            }

            action
                .then(function () {
                    $ionicHistory.goBack();
                })
                .catch(function (err) {
                    console.error('An error occurred while trying to save a reason: ' + err);
                    $ionicPopup
                        .alert({
                            title: 'General Error',
                            template: 'An error occurred. Please contact your administrator if this continues to happen.'
                        });
                });
        }
    }
})();