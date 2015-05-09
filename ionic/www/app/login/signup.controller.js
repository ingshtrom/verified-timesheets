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
        data.secretKey = '';

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
            if (!data.secretKey) {
                return $ionicPopup
				.alert({
					title: 'Error',
					template: 'Your must enter a secret key.'
				});
            }
			
			UserApiService
			.createUser(data.name, data.email, data.password, data.secretKey)
			.then(function () {
				$ionicHistory.goBack();
			})
			.catch(function (err) {
                var errorMessage = 'Could not create account. Please try again.';
                
                if (err && err.data && err.data.errorMessage) {
                    errorMessage = err.data.errorMessage;
                }
                
				$ionicPopup
				.alert({
					title: 'Error',
					template: errorMessage
				});
			})
        }
    }
})();
