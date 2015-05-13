(function () {
    'use strict';

    angular
        .module('vt.time-entries')
        .controller('TimeEntriesController', TimeEntriesController);

    function TimeEntriesController($scope, $ionicPopup, TimeEntryApiService, LoginService) {
        var data = $scope.data = {},
            func = $scope.func = {};

        data.entries = [];
        data.shouldShowDelete = false;

        func.toggleShouldShowDelete = toggleShouldShowDelete;
        func.deleteTimeEntry = deleteTimeEntry;
        func.generateReport = generateReport;

        init();

        function init() {
            loadTimeEntries();
        }

        function loadTimeEntries () {
            var currentUser = LoginService.getCurrentSession();

            TimeEntryApiService.getEntriesForUser(currentUser.id)
                .then(function (result) {
                    data.entries = result.data;
                    _.each(data.entries, function (entry) {
                        entry.startDateTime = new Date(entry.startDateTime);
                        entry.endDateTime = new Date(entry.endDateTime);
                    });
                })
                .catch(function () {
                    $ionicPopup
                        .alert({
                            title: 'Get Error',
                            template: 'And error occurred. Please try again.'
                        });
                });
        }

        function toggleShouldShowDelete() {
            data.shouldShowDelete = !data.shouldShowDelete;
        }

        function deleteTimeEntry (entry) {
            $ionicPopup
                .confirm({
                    title: 'Delete?',
                    template: 'Are you sure you want to delete this time entry?'
                })
                .then(function (result) {
                    if (result) {
                        TimeEntryApiService
                            .deleteTimeEntry(entry.id)
                            .then(function () {
                                loadTimeEntries();
                            })
                            .catch(function () {
                                $ionicPopup
                                    .alert({
                                        title: 'Delete Error',
                                        template: 'An error occurred. Please try again.'
                                    });
                            });
                    }
                });
        }
        
        function generateReport() {
            $ionicPopup
                .confirm({
                    title: 'Generate Report?',
                    template: 'Make sure your email is correct. The report will be sent to it.'
                })
                .then(function (result) {
                    if (result) {
                        TimeEntryApiService
                            .generateReport()
                            .catch(function (err) {
                                $ionicPopup
                                    .alert({
                                        title: 'Generate Report Error',
                                        template: err + ''
                                    });
                            });
                    }
                });
        }
    }
})();
