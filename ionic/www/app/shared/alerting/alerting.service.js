(function () {
    'use strict';

    angular
        .module('vt.alerting')
        .factory('AlertingService', AlertingService);

    function AlertingService ($ionicPopup) {
        return {
            /**
             * Display a basic alert with an OK button
             * @param title     - title of the alert
             * @param template  - template for the content in the alert
             */
            showAlert: function showAlert (options) {
                return $ionicPopup.alert(options)
                    .then(function(res) {
                        console.log('closing alert');
                        return res;
                    });
            }
        };
    }

})();