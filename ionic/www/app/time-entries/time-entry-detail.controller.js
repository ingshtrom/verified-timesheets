(function () {
    'use strict';

    angular
        .module('vt.time-entries')
        .controller('TimeEntryController', TimeEntryController);

    TimeEntryController.$inject = ['$scope', '$state', '$ionicPopup', '$ionicHistory', '$q', 'TimeEntryApiService', 'UserApiService', 'ReasonApiService', 'ApparatusApiService'];

    function TimeEntryController($scope, $state, $ionicPopup, $ionicHistory, $q, TimeEntryApiService, UserApiService, ReasonApiService, ApparatusApiService) {
        var data = $scope.data = {},
            func = $scope.func = {};

        data.timeEntry = {};
        data.users = [];
        data.reasons = [];
        data.apparatuses = [];
        data.isReadOnly = false;

        func.save = save;
        func.isValidTimespan = isValidTimespan;

        init();

        function init() {
            data.isReadOnly = $state.params.isReadOnly;
            getTimeEntry();
            getUsers();
            getReasons();
            getApparatuses();
        }

        function getTimeEntry () {
            var deferred = $q.defer();
            
            data.timeEntry.id = $state.params.id;
            if (data.timeEntry.id) {
                TimeEntryApiService
                .getEntryById(data.timeEntry.id)
                .then(function (result) {
                    data.timeEntry = result.data;
                    data.timeEntry.startDateTime = new Date(data.timeEntry.startDateTime);
                    data.timeEntry.endDateTime = new Date(data.timeEntry.endDateTime);
                    deferred.resolve();
                });
            } else {
                data.timeEntry.startDateTime = new Date();
                data.timeEntry.endDateTime = new Date();
                deferred.resolve();
            }
            
            return deferred.promise;
        }

        function getUsers () {
            return UserApiService
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
            return ReasonApiService
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
            return ApparatusApiService
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

            isValidTimespan()
            .then(function (isValid) {
                if (!isValid) {
                    return $ionicPopup
                    .alert({
                        title: 'Invalid Date',
                        template: 'A time entry cannot span over the end of the pay period.'
                    })
                    .then(function () {
                        return false;
                    });
                }
                return $q.when(true);
            })
            .then(function (shouldSave) {
                if (shouldSave) {
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
            });
        }
        
        function isValidTimespan () {
            return TimeEntryApiService
            .isValidTimespan(data.timeEntry.startDateTime, data.timeEntry.endDateTime)
            .then(function (result) {
                return result.data.isValid;
            });
        }
    }
})();