(function () {
    'use strict';

    angular
        .module('vt.login', ['vt.api', 'vt.alerting'])
        .run(run);

    function run($rootScope, $ionicHistory, $state, LoginService) {
        $rootScope.$on('$stateChangeStart', function (event, toState) {
            // go back to the login page if
            // were are not logged in
            if (toState.name !== 'login' && !LoginService.isLoggedIn()) {
                console.log('not logged in. redirecting back to the login page. ');
                event.preventDefault();
                $ionicHistory.nextViewOptions({disableBack: true});
                $state.go('login');
            }
        });
    }
})();
