(function () {
    'use strict';

    angular
        .module('vt.reasons')
        .controller('ReasonDetailController', ReasonDetailController);

    ReasonDetailController.$inject = ['$scope', '$state', '$ionicHistory', '$ionicPopup', '$log', 'ReasonApiService'];

    function ReasonDetailController($scope, $state, $ionicHistory, $ionicPopup, $log, ReasonApiService) {
        var data = $scope.data = {},
            func = $scope.func = {};

        data.id = '';
        data.name = '';
        data.description = '';
        data.editMode = false;

        func.save = save;

        init();

        function init () {
            data.id = $state.params.id;
            if (data.id) {
                $log.debug('reason-detail => edit mode');
                data.editMode = true;
                ReasonApiService
                    .getReason(data.id)
                    .then(function (res) {
                        data.name = res.data.name;
                        data.description = res.data.description;
                    })
                    .catch(function (err) {
                        // display an error and go back to the previous page
                        // since we had trouble loading the reason
                        console.error('An error occurred while trying to load the reason: ' + err);
                        $ionicPopup
                            .alert({
                                title: 'Get Error',
                                template: 'An error occurred while trying to load the reason. Please try again'
                            })
                            .then(function () {
                                $ionicHistory.goBack();
                            });
                    });
            } else {
                $log.debug('reason-detail => create mode');
            }
        }

        function save () {
            var action;

            if (!data.name) {
                return $ionicPopup
                    .alert({
                        title: 'Invalid Data',
                        template: 'The name field is required.'
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