(function () {
    'use strict';

    angular
    .module('vt.login')
    .controller('LoginController', LoginController);

    function LoginController ($scope, $state, $ionicHistory, $ionicPopup, LoginService) {
        $scope.creds = {
            email: '',
            password: ''
        };

        $scope.login = login;

        init();

        function init () {}

        function login () {
            LoginService.login($scope.creds.email, $scope.creds.password)
                .then(function () {
                    $scope.creds = {
                        email: '',
                        password: ''
                    };
                    $ionicHistory.nextViewOptions({ historyRoot: true });
                    $state.go('app.time-entries');
                })
                .catch(function (err) {
                    var title = 'Error!',
                        content = 'Unknown error while trying to login.';

                    if (err.data) {
                        content = err.data.errorMessage;
                    }

                    $ionicPopup
                        .alert({
                            title: title,
                            content: content
                        });
                });
        }
    }
})();
