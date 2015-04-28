(function () {
    'use strict';

    angular
        .module('vt.users')
        .controller('ReasonsController', ReasonsController);

    function ReasonsController ($scope, $ionicPopup, ReasonApiService) {
        var data = $scope.data = {},
            func = $scope.func = {};

        data.reasons = [];
        data.shouldShowDelete = false;

        func.toggleShouldShowDelete = toggleShouldShowDelete;
        func.deleteReason = deleteReason;

        init();

        function init () {
            loadReasons();
        }

        function loadReasons () {
            ReasonApiService
                .getAllReasons()
                .then(function (result) {
                    data.reasons = result.data;
                })
                .catch(function () {
                    console.error('an error occurred while getting the list of reasons');
                    $ionicPopup
                        .alert({
                            title: 'Get Error',
                            template: 'An error occurred. Please try again.'
                        });
                });
        }

        function toggleShouldShowDelete () {
            data.shouldShowDelete = !data.shouldShowDelete;
        }

        function deleteReason (reason) {
            $ionicPopup
                .confirm({
                    title: 'Delete?',
                    template: 'Are you sure you want to delete ' + reason.name + '?'
                })
                .then(handleResponse);

            function handleResponse (result) {
                if (result) {
                    ReasonApiService
                        .deleteReason(reason.id)
                        .then(function () {
                            loadReasons();
                        })
                        .catch(function (err) {
                            console.error('An error occurred while trying to delete an error: ' + err);
                            $ionicPopup
                                .alert({
                                    title: 'Delete Error',
                                    template: 'An error occurred. Please try again.'
                                });
                        });
                } else {
                    console.log('the user declined to delete reason.');
                }
            }
        }
    }
})();