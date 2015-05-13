'use strict';

var _schedule, later = require('later');

// API
module.exports.register = register;
module.exports.getSchedule = getSchedule;
module.exports.getPreviousOccurrences = getPreviousOccurrences;
module.exports.getNextOccurrences = getNextOccurrences;

function init() {
  later.date.localTime();
  _schedule = later.parse.recur()
              .on(7).hour() // 7:00 am
              .on(2).dayOfWeek() // Mondays only
              .every(2).weekOfYear().startingOn(2); // every 2 weeks, starting with the second week
}
init();

function register (func) {
  var i, occurrences;
  
  later.setInterval(func, _schedule);
  
  sails.log.debug('registered later schedule for generating time entry reports. Below are the occurrences for [-5, 5]');
  
  // past
  occurrences = getPreviousOccurrences(5)
  for(i = 5; i >= 0; i--) {
    sails.log.debug(occurrences[i]);
  }
  
  sails.log.debug('NOW!');
  // future
  occurrences = getNextOccurrences(5);
  for(i = 0; i < 5; i++) {
    sails.log.debug(occurrences[i]);
  }
}

function getSchedule () {
  return _schedule;
}

function getPreviousOccurrences(num) {
  return later.schedule(_schedule).prev(num || 1);
}

function getNextOccurrences(num) {
  return later.schedule(_schedule).next(num || 1);
}