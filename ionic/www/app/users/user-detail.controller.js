(function () {
    'use strict';

    angular
        .module('vt.users')
        .controller('UserDetailController', UserDetailController);

    function UserDetailController($scope, $state, $ionicHistory, $ionicPopup, UserApiService) {
        var data = $scope.data = {},
            func = $scope.func = {};

        data.id = '';
        data.name = '';
        data.email = '';
        data.isOfficer = false;
        data.title = '';
        data.editMode = false;

        func.save = save;

        init();

        function init () {
            data.id = $state.params.id;
            if (data.id) {
                console.log('user-detail => edit mode');
                data.editMode = true;
                
                UserApiService
                .getUser(data.id)
                .then(function (res) {
                    data.name = res.data.name;
                    data.email = res.data.email;
                    data.isOfficer = res.data.isOfficer;
                    data.title = res.data.title;
                })
                .catch(function (err) {
                    // display an error and go back to the previous page
                    // since we had trouble loading the reason
                    console.error('An error occurred while trying to load the user: ' + err);
                    $ionicPopup
                    .alert({
                        title: 'Get Error',
                        template: 'An error occurred while trying to load the user. Please try again'
                    })
                    .then(function () {
                        $ionicHistory.goBack();
                    });
                });
            } else {
                console.log('user-detail => create mode');
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
            
            if (!data.email) {
                return $ionicPopup
                .alert({
                    title: 'Invalid Data',
                    template: 'The email field is required.'
                });
            }

            if (!data.title) {
                return $ionicPopup
                .alert({
                    title: 'Invalid Data',
                    template: 'The title field is required.'
                });
            }

            if (data.editMode) {
                action = UserApiService.updateUser({
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    isOfficer: data.isOfficer,
                    title: data.title
                });
            }
            // when we support officers creating users, 
            // then we would implement that here

            action
            .then(function () {
                $ionicHistory.goBack();
            })
            .catch(function (err) {
                console.error('An error occurred while trying to save an user: ' + err);
                $ionicPopup
                .alert({
                    title: 'General Error',
                    template: 'An error occurred. Please contact your administrator if this continues to happen.'
                });
            });
        }
    }
})();