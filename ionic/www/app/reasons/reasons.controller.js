(function () {
    'use strict';

    angular
        .module('vt.users')
        .controller('ReasonsController', ReasonsController);

    function ReasonsController ($scope, ReasonApiService) {
        var data = $scope.data = {};
        data.reasons = [];

        init();

        function init () {
            ReasonApiService
                .getAllReasons()
                .then(function (result) {
                    data.reasons = result.data;
                })
                .catch(function () {
                    // TODO: display an error dialog
                    console.error('an error occurred while getting the list of reasons');
                });
        }
    }
})();