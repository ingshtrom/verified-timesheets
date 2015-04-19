(function () {
  'use strict';

  angular
    .module('vt.time-entry')
    .filter('milToHourFilter', MilToHourFilter);

  function MilToHourFilter () {
    return function (input) {
      input = input || 0;
      return (input / 60 / 60);
    };
  }
})();