(function () {
    'use strict';

    angular
        .module('vt.users')
        .controller('ApparatusesController', ApparatusesController);

    function ApparatusesController($scope, $ionicPopup, ApparatusApiService) {
        var data = $scope.data = {},
            func = $scope.func = {};

        data.apparatuses = [];
        data.shouldShowDelete = false;

        func.toggleShouldShowDelete = toggleShouldShowDelete;
        func.deleteApparatus = deleteApparatus;

        init();

        function init () {
            loadApparatuses();
        }

        function loadApparatuses () {
            ApparatusApiService
                .getAllApparatuses()
                .then(function (result) {
                    data.apparatuses = result.data;
                })
                .catch(function () {
                    console.error('an error occurred while getting the list of apparatuses');
                    $ionicPopup
                        .alert({
                            title: 'Get Error',
                            template: 'An error occurred. Please try again.'
                        });
                });
        }

        function toggleShouldShowDelete() {
            data.shouldShowDelete = !data.shouldShowDelete;
        }

        function deleteApparatus (apparatus) {
            $ionicPopup
                .confirm({
                    title: 'Delete?',
                    template: 'Are you sure you want to delete ' + apparatus.name + '?'
                })
                .then(handleResponse);

            function handleResponse(result) {
                if (result) {
                    ApparatusApiService
                        .deleteApparatus(apparatus.id)
                        .then(function () {
                            loadApparatuses();
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
                    console.log('the user declined to delete apparatus.');
                }
            }
        }
    }
})();