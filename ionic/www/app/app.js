/* global StatusBar */

(function () {
    'use strict';

    angular
        .module('vt', ['ionic', 'vt.side-menu', 'vt.login', 'vt.time-entries'])
        .run(Run)
        .config(Config);

    function Run($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    }

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
        $urlRouterProvider.otherwise('/time-entries');
    }
})();
