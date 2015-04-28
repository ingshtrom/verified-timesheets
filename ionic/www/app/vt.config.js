(function () {
    'use strict';

    angular
        .module('vt')
        .config(config);

    function config($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    }
})();