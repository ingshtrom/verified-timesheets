(function () {
    'use strict';

    angular
    .module('vt.login')
    .controller('SignupController', SignupController);

    function SignupController ($scope, $ionicHistory, $ionicPopup, UserApiService) {
        var data = $scope.data = {};

		data.name = '';
		data.email = '';
		data.password = '';
		data.password2 = '';

        $scope.createAccount = createAccount;

        init();

        function init () {}

        function createAccount () {
            if (!data.name) {
				return $ionicPopup
				.alert({
					title: 'Error',
					template: 'You must enter your full name in.'
				});
			}
			if (!data.email) {
				return $ionicPopup
				.alert({
					title: 'Error',
					template: 'You must enter a valid email address.'
				});
			}
			if (!data.password) {
				return $ionicPopup
				.alert({
					title: 'Error',
					template: 'You must enter a password.'
				});
			}
			if (!data.password2 || data.password !== data.password2) {
				return $ionicPopup
				.alert({
					title: 'Error',
					template: 'Your passwords must match.'
				});
			}
			
			UserApiService
			.createUser(data.name, data.email, data.password)
			.then(function () {
				$ionicHistory.goBack();
			})
			.catch(function () {
				$ionicPopup
				.alert({
					title: 'Error',
					template: 'Could not create account. Please try again.'
				});
			})
        }
    }
})();
