/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
(function (fdsa) {
	'use strict';
	
	angular
	.module('vt.settings')
	.controller('SignatureController', SignatureController);
	
	function SignatureController ($scope, $state, $ionicPopup, $ionicHistory, SignatureService, LoginService, UserApiService) {
		var data = $scope.data = {},
			func = $scope.func = {};
		
		func.saveSignature = saveSignature;
		func.clearSignature = clearSignature;
		
		function clearSignature () {
			SignatureService.get().clear();
		}
		
		function saveSignature () {
			var sPad = SignatureService.get(),
				currentUser = LoginService.getCurrentSession();
				
			if (sPad.isEmpty()) {
				return $ionicPopup.alert({
					title: 'Error',
					template: 'You cannot save an empty signature.'
				});
			}
				
			currentUser.signature = sPad.toDataURL();
			
			UserApiService
			.updateUser(currentUser)
			.then(function () {
				$ionicHistory.goBack();
			})
			.catch(function () {
				$ionicPopup.alert({
					title: 'Save Error',
					template: 'An error occurred. Please try again'
				});
			})
		}
	}
})();