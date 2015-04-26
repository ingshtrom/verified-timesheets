(function () {
    'use strict';

    angular
        .module('vt')
        .config(Config);

    function Config($httpProvider, $stateProvider, $urlRouterProvider) {
        $httpProvider.defaults.withCredentials = true;

        $stateProvider
            .state('app', {
                abstract: true,
                templateUrl: 'app/side-menu/side-menu.template.html',
                controller: 'SideMenuController'
            })
            .state('login', {
                url: "/login",
                templateUrl: "app/login/login.template.html",
                controller: 'LoginController'
            })
            .state('app.time-entries', {
                url: '/time-entries',
                views: {
                    'menuContent': {
                        templateUrl: 'app/time-entries/time-entries.template.html',
                        controller: 'TimeEntriesController'
                    }
                }
            })
            .state('app.time-entry', {
                url: '/time-entry/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'app/time-entries/time-entry.template.html',
                        controller: 'TimeEntryController'
                    }
                }
            });
        $urlRouterProvider.otherwise('/login');
    }
})();