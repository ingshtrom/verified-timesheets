(function () {
    'use strict';

    angular
        .module('vt.users')
        .controller('ApparatusesController', ApparatusesController);

    function ApparatusesController ($scope, ApparatusApiService) {
        var data = $scope.data = {};
        data.apparatuses = [];

        init();

        function init () {
            ApparatusApiService
                .getAllApparatuses()
                .then(function (result) {
                    data.apparatuses = result.data;
                })
                .catch(function () {
                    // TODO: display an alert that the search failed
                    console.error('an error occurred while getting the list of apparatuses');
                });
        }
    }
})();