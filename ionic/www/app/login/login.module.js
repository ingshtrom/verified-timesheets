(function () {
  'use strict';

  angular
    .module('vt.login', ['vt.api'])
    .run(run);

  function run ($rootScope, $ionicHistory, $state, LoginService) {
    $rootScope.$on('$stateChangeStart', function(event, toState) {
      // go back to the login page if
      // were are not logged in
      if (toState.name !== 'app.login' && !LoginService.isLoggedIn()) {
        console.log('not logged in. redirecting back to the login page. ');
        event.preventDefault();
        $ionicHistory.nextViewOptions({ disableBack: true });
        $state.go('app.login');
      }
    });
  }
})();
