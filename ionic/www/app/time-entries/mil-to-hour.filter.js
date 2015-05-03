(function () {
  'use strict';

  angular
    .module('vt.time-entries')
    .filter('milToHourFilter', MilToHourFilter);

  function MilToHourFilter () {
    return function (input) {
      input = input || 0;
      return (input / 1000 / 60 / 60);
    };
  }
})();