(function () {
    'use strict';

    angular
        .module('vt.apparatuses')
        .controller('ApparatusDetailController', ApparatusDetailController);

    function ApparatusDetailController($scope, $state, $ionicHistory, $ionicPopup, ApparatusApiService) {
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
                console.log('apparatus-detail => edit mode');
                data.editMode = true;
                ApparatusApiService
                    .getApparatus(data.id)
                    .then(function (res) {
                        data.name = res.data.name;
                        data.description = res.data.description;
                    })
                    .catch(function (err) {
                        // display an error and go back to the previous page
                        // since we had trouble loading the reason
                        console.error('An error occurred while trying to load the apparatus: ' + err);
                        $ionicPopup
                            .alert({
                                title: 'Get Error',
                                template: 'An error occurred while trying to load the aparatus. Please try again'
                            })
                            .then(function () {
                                $ionicHistory.goBack();
                            });
                    });
            } else {
                console.log('apparatus-detail => create mode');
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
                action = ApparatusApiService.updateApparatus({
                    id: data.id,
                    name: data.name,
                    description: data.description
                });
            } else {
                action = ApparatusApiService.createApparatus(data.name, data.description);
            }

            action
                .then(function () {
                    $ionicHistory.goBack();
                })
                .catch(function (err) {
                    console.error('An error occurred while trying to save an apparatus: ' + err);
                    $ionicPopup
                        .alert({
                            title: 'General Error',
                            template: 'An error occurred. Please contact your administrator if this continues to happen.'
                        });
                });
        }
    }
})();