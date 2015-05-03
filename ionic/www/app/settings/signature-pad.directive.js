/* global SignaturePad,SignatureService */
(function () {
	'use strict';
	
	angular
	.module('vt.settings')
	.directive('vtSignaturePad', vtSignaturePad);
	
	function vtSignaturePad (SignatureService, LoginService) {
		return {
			restrict: 'E',
			scope: {},
			link: function ($scope, elem, attrs) {
				var signaturePad, currentUser,
					canvas = elem.find('canvas')[0],
					options = {
						backgroundColor: 'rgba(0, 0, 0, 0.05)'
					};
					
				currentUser = LoginService.getCurrentSession();
					
				canvas.width = window.innerWidth;
				canvas.height = canvas.width;
				
				signaturePad = new SignaturePad(canvas, options);
				
				if (currentUser.signature) {
					signaturePad.fromDataURL(currentUser.signature);
				}
				
				SignatureService.set(signaturePad);
			},
			template: '<canvas></canvas>'
		};
	}
})();