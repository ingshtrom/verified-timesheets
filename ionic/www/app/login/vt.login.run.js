(function () {
    'use strict';

    angular
        .module('vt.login')
        .run(run);

    function run ($rootScope, $location, LoginService) {
        $rootScope.$on('$stateChangeStart', function (event, toState) {
            if (toState.name !== 'login' && !LoginService.isLoggedIn()) {
                $location.path('/login');
            }
        });
    }
})();