(function () {
    'use strict';

    angular
        .module('vt.time-entries')
        .controller('TimeEntryController', TimeEntryController);

    function TimeEntryController($scope, $state, $ionicPopup, $ionicHistory, TimeEntryApiService, UserApiService, ReasonApiService, ApparatusApiService) {
        var data = $scope.data = {},
            func = $scope.func = {};

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
            if (data.timeEntry.id) {
                TimeEntryApiService
                .getEntryById(data.timeEntry.id)
                .then(function (result) {
                    data.timeEntry = result.data;
                    data.timeEntry.startDateTime = new Date(data.timeEntry.startDateTime);
                    data.timeEntry.endDateTime = new Date(data.timeEntry.endDateTime);
                });
            } else {
                data.timeEntry.startDateTime = new Date();
                data.timeEntry.endDateTime = new Date();
            }
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

            if (data.timeEntry.id) {
                action = TimeEntryApiService.updateTimeEntry(data.timeEntry);
            } else {
                action = TimeEntryApiService.createTimeEntry(data.timeEntry);
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