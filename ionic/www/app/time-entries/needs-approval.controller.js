(function () {
    'use strict';

    angular
        .module('vt.time-entries')
        .controller('NeedsApprovalController', NeedsApprovalController);

    NeedsApprovalController.$inject = ['$scope', '$q', '$ionicPopup', '$state', '$log', 'LoginService', 'TimeEntryApiService'];

    function NeedsApprovalController($scope, $q, $ionicPopup, $state, $log, LoginService, TimeEntryApiService) {
        var data = $scope.data = {},
            func = $scope.func = {};

        data.entries = [];

        func.batchApproveTimeEntries = batchApproveTimeEntries;
        func.canApprove = canApprove;
        func.openDetails = openDetails;

        init();

        function init() {
            loadTimeEntries();
        }

        function loadTimeEntries () {
            var currentUserId = LoginService.getCurrentSession().id;
            data.entries = [];
            TimeEntryApiService
            .getEntriesForApproval()
            .then(function (result) {
                angular.forEach(result.data, function (entry) {
                    if (entry.user.id !== currentUserId) {
                        entry.startDateTime = new Date(entry.startDateTime);
                        entry.endDateTime = new Date(entry.endDateTime);
                        data.entries.push(entry);
                    }
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

        function batchApproveTimeEntries () {
            var approvalPromises = [];
            angular.forEach(data.entries, function (entry) {
                if (entry.isApproved) {
                    approvalPromises.push(TimeEntryApiService.approveTimeEntry(entry.id));
                }
            });
            $q.all(approvalPromises)
            .then(function (result) {
                $log.debug(result);
            })
            .catch(function () {
                return $ionicPopup
                .alert({
                    title: 'Save Error',
                    template: 'And error occurred. Please try again.'
                });
            })
            .finally(function () { loadTimeEntries(); });
        }
        
        function openDetails (entry) {
            $state.go('app.time-entry-detail', { id: entry.id, isReadOnly: true });
        }
        
        /**
         * check if the user has the correct properties 
         * set so that they can approve time entries
         */
        function canApprove () {
            var currentUser = LoginService.getCurrentSession();
            // no need to check if the user is an officer 
            // since they can't get to this route if that
            // were the case
            return currentUser.signature && currentUser.title;
        }
        
        function displayNoApprovalInfo () {
            // display popover
        }
    }
})();
