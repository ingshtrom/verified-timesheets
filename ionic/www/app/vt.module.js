(function () {
    'use strict';

    angular
        .module('vt', [
            'ionic',
            'ngCordova',
            'vt.side-menu',
            'vt.login',
            'vt.time-entries'
        ]);
})();
