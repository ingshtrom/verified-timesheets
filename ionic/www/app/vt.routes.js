(function () {
    'use strict';

    angular
        .module('vt')
        .config(config);

    function config($stateProvider, $urlRouterProvider) {
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
                cache: false,
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
            })
            .state('app.users', {
                url: '/users',
                cache: false,
                views: {
                    menuContent: {
                        templateUrl: 'app/users/users.template.html',
                        controller: 'UsersController'
                    }
                }
            })
            .state('app.reasons', {
                url: '/reasons',
                cache: false,
                views: {
                    menuContent: {
                        templateUrl: 'app/reasons/reasons.template.html',
                        controller: 'ReasonsController'
                    }
                }
            })
            .state('app.new-reason', {
                url: '/reason',
                views: {
                    menuContent: {
                        templateUrl: 'app/reasons/reason-detail.template.html',
                        controller: 'ReasonDetailController'
                    }
                }
            })
            .state('app.reason-detail', {
                url: '/reason/:id',
                views: {
                    menuContent: {
                        templateUrl: 'app/reasons/reason-detail.template.html',
                        controller: 'ReasonDetailController'
                    }
                }
            })
            .state('app.apparatuses', {
                url: '/apparatuses',
                cache: false,
                views: {
                    menuContent: {
                        templateUrl: 'app/apparatuses/apparatuses.template.html',
                        controller: 'ApparatusesController'
                    }
                }
            })
            .state('app.new-apparatus', {
                url: '/apparatus',
                views: {
                    menuContent: {
                        templateUrl: 'app/apparatuses/apparatus-detail.template.html',
                        controller: 'ApparatusDetailController'
                    }
                }
            })
            .state('app.apparatus-detail', {
                url: '/apparatus/:id',
                views: {
                    menuContent: {
                        templateUrl: 'app/apparatuses/apparatus-detail.template.html',
                        controller: 'ApparatusDetailController'
                    }
                }
            });
        $urlRouterProvider.otherwise('/login');
    }
})();