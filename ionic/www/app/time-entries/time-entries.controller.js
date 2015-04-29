(function () {
    'use strict';

    angular
        .module('vt.time-entries')
        .controller('TimeEntriesController', TimeEntriesController);

    function TimeEntriesController($scope, $ionicPopup, TimeEntryApiService, LoginService) {
        var data = $scope.data = {},
            func = $scope.func = {};

        data.entries = [];
        data.shouldShowDelete = false

        func.toggleShouldShowDelete = toggleShouldShowDelete;
        func.deleteTimeEntry = deleteTimeEntry;

        init();

        function init() {
            loadTimeEntries();
        }

        function loadTimeEntries () {
            var currentUser = LoginService.getCurrentSession();

            TimeEntryApiService.getEntriesForUser(currentUser.id)
                .then(function (result) {
                    data.entries = result.data;
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
    }
})();
