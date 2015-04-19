(function () {
    'use strict';

    angular
    .module('vt.login')
    .controller('LoginController', LoginController);

    function LoginController ($scope, $state, $ionicHistory, LoginService, AlertingService) {
        $scope.creds = {
            email: 'foo.bar@gmail.com',
            password: 'testing'
        };

        $scope.login = login;

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

                    AlertingService
                        .showAlert({
                            title: title,
                            content: content
                        });
                });
        }
    }
})();
