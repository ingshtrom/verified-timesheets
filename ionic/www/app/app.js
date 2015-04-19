/* global StatusBar */

(function () {
  'use strict';

  angular
    .module('vt', ['ionic', 'vt.side-menu', 'vt.api', 'vt.login', 'vt.time-entry'])
    .run(Run)
    .config(Config);

  function Run ($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  }

  function Config ($httpProvider, $stateProvider, $urlRouterProvider) {
    $httpProvider.defaults.withCredentials = true;

    $stateProvider
      .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: 'app/side-menu/side-menu.template.html',
        controller: 'SideMenuController'
      })
      .state('app.login', {
        url: "/login",
        views: {
          'menuContent': {
            templateUrl: "app/login/login.template.html",
            controller: 'LoginController'
          }
        }
      })
      .state('app.time-entry', {
        url: '/time-entry',
        views: {
          'menuContent': {
            templateUrl: 'app/time-entry/time-entry.template.html',
            controller: 'time-entryController'
          }
        }
      });
    $urlRouterProvider.otherwise('app/login');
  }
})();
