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
            .state('app.time-entries-needs-approval', {
                url: '/time-entries/needs-approval',
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: 'app/time-entries/needs-approval.template.html',
                        controller: 'NeedsApprovalController'
                    }
                }
            })
            .state('app.new-time-entry', {
                url: '/time-entry',
                views: {
                    menuContent: {
                        templateUrl: 'app/time-entries/time-entry-detail.template.html',
                        controller: 'TimeEntryController'
                    }
                }
            })
            .state('app.time-entry-detail', {
                url: '/time-entry/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'app/time-entries/time-entry-detail.template.html',
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
            })
            .state('app.settings', {
                url: '/settings',
                views: {
                    menuContent: {
                        templateUrl: 'app/settings/main-settings.template.html',
                        controller: 'MainSettingsController'
                    }
                }
            })
            .state('app.settings-signature', {
                url: '/settings-signature',
                views: {
                    menuContent: {
                        templateUrl: 'app/settings/signature.template.html',
                        controller: 'SignatureController'
                    }
                }
            });
        $urlRouterProvider.otherwise('/login');
    }
})();