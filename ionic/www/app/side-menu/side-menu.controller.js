(function () {
    'use strict';

    angular
        .module('vt.side-menu')
        .controller('SideMenuController', SideMenuController);

    function SideMenuController($scope, $state, $ionicHistory, LoginService) {
        $scope.logout = logout;
        $scope.isLoggedIn = isLoggedIn;
        $scope.isOfficer = isOfficer;

        activate();

        function activate() {

        }

        function logout() {
            LoginService.logout();
            $ionicHistory.nextViewOptions({disableBack: true});
            $state.go('login');
        }

        function isLoggedIn() {
            return LoginService.isLoggedIn();
        }

        function isOfficer () {
            return LoginService.isOfficer();
        }
    }
})();