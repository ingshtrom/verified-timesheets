(function () {
    'use strict';

    angular
        .module('vt.users')
        .controller('UsersController', UsersController);

    function UsersController ($scope, UserApiService, LoginService) {
        var data = $scope.data = {};
        data.users = [];

        init();

        function init () {
            var myId = LoginService.getCurrentSession().id;
            UserApiService
            .getUsers()
            .then(function (result) {
               data.users = _.filter(result.data, function (cur) {
                   return cur.id !== myId;
               });
            })
            .catch(function () {
                // TODO: display an alert
                console.error('Error while getting the list of users.');
            });
        }
    }
})();