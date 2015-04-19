(function () {
  'use strict';

  angular
    .module('vt.side-menu')
    .controller('SideMenuController', SideMenuController);

  function SideMenuController ($scope, $state, $ionicHistory, LoginService) {
    $scope.logout = logout;
    $scope.isLoggedIn = isLoggedIn;

    activate();

    function activate () {

    }

    function logout () {
      LoginService.logout();
      $ionicHistory.nextViewOptions({ disableBack: true });
      $state.go('app.login');
    }

    function isLoggedIn () {
      return LoginService.isLoggedIn();
    }
  }
})();