(function () {
    'use strict';

    angular
        .module('vt.users')
        .controller('UsersController', UsersController);

    function UsersController ($scope, UserApiService) {
        var data = $scope.data = {};
        data.users = [];

        init();

        function init () {
            UserApiService
                .getUsers()
                .then(function (result) {
                   data.users = result.data;
                })
                .catch(function () {
                    // TODO: display an alert
                    console.error('Error while getting the list of users.');
                });
        }
    }
})();