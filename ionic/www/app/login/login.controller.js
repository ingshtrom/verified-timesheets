(function () {
  'use strict';

  angular
    .module('vt.login')
    .controller('LoginController', LoginController);

    function LoginController ($scope, $state, $ionicHistory, LoginService) {
      $scope.login = {
        email: '',
        password: ''
      };

      $scope.login = login;

      function login () {
        LoginService.login(login.email, login.password)
        .then(function () {
          console.log('login successful!');
          $ionicHistory.nextViewOptions({ historyRoot: true });
          $state.go('app.time-entry');
        })
        .catch(function (err) {
          // TODO: display an error alert
          console.log('Error: ' + err);
        });
      }
    }
})();
