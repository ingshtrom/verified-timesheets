(function () {
    'use strict';

    angular
        .module('vt.reasons')
        .controller('ReasonDetailController', ReasonDetailController);

    function ReasonDetailController($scope, $state, $ionicHistory, $ionicPopup, ReasonApiService) {
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
                console.log('reason-detail => edit mode');
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
                console.log('reason-detail => create mode');
            }
        }

        function save () {
            if (!data.name) {
                return $ionicPopup
                    .alert({
                        title: 'Invalid Data',
                        template: 'The name field is required.'
                    });
            }
            ReasonApiService
                .createReason(data.name, data.description)
                .then(function () {
                    console.log('New reason successfully saved.');
                    $ionicHistory.goBack();
                })
                .catch(function (err) {
                    console.error('An error occurred while trying to save a new reason: ' + err);
                    $ionicPopup
                        .alert({
                            title: 'General Error',
                            template: 'An error occurred while trying to save a new reason. Please contact your administrator if this continues to happen.'
                        });
                });
        }
    }
})();