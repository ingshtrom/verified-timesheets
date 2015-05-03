(function () {
	'use strict';
	
	angular
	.module('vt.settings')
	.factory('SignatureService', SignatureService);
	
	function SignatureService () {
		var signaturePad;
		
		return {
			set: setSignaturePad,
			get: getSignaturePad
		};
		
		function setSignaturePad (sPad) {
			signaturePad = sPad;
		}
		
		function getSignaturePad () {
			return signaturePad;
		}
	}
})();