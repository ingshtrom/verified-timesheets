'use strict';

var _schedule, later = require('later');

// API
module.exports.getSchedule = getSchedule;
module.exports.getPreviousOccurrences = getPreviousOccurrences;
module.exports.getNextOccurrences = getNextOccurrences;
module.exports.isValidTimeEntryPeriod = isValidTimeEntryPeriod;
module.exports.register = register;

/**
 * initialize our schedule
 * @return {void}
 * @private
 */
(function init() {
    later.date.localTime();
    _schedule = later.parse.recur()
                .on(7).hour() // 7:00 am
                .on(2).dayOfWeek() // Mondays only
                .every(2).weekOfYear().startingOn(2); // every 2 weeks, starting with the second week
})();

/**
 * register a function to be run every time
 * the schedule is triggered. This will also print out
 * the previous 5 and next 5 occurrences of the shedule.
 * @param  {function} func - the function to run every schedule trigger
 * @return {void}
 */
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

/**
 * get the Later.js schedule instance
 * @return {object} - Later.js schedule instance
 */
function getSchedule () {
    return _schedule;
}

/**
 * Get the previous N occurrences of the schedule.
 * @param {number} num - number of occurrences to get.
 */
function getPreviousOccurrences(num) {
    return later.schedule(_schedule).prev(num || 1);
}

/**
 * Get the next N occurrences of the schedule. 
 * @param {number} num - number of occurences to get.
 */
function getNextOccurrences(num) {
    return later.schedule(_schedule).next(num || 1);
}

/**
 * Check if a the time span is contained within a pay period
 * @param {Date} startDateTime
 * @param {Date} endDateTime
 */
function isValidTimeEntryPeriod (startDateTime, endDateTime) {
    var prevOccurrence = getPreviousOccurrences(1),
        nextOccurrences = getNextOccurrences(2),
        isContainedPrev = isContained(prevOccurrence),
        isContainedCurrent = isContained(nextOccurrences[0]),
        isContainedNext = isContained(nextOccurrences[1]);
      
    sails.log.debug('SchedulerService', {
        message: 'information',
        isContainedPrev: isContainedPrev,
        isContainedCurrent: isContainedCurrent,
        isContainedNext: isContainedNext,
        prevOccurrence: prevOccurrence,
        nextOccurrence1: nextOccurrences[0],
        nextOccurrence2: nextOccurrences[1],
        startDateTime: startDateTime,
        endDateTime: endDateTime
    });
      
    // the time entry spans over the last pay period ending
    if (isContainedPrev || isContainedCurrent || isContainedNext) {
        sails.log.debug('SchedulerService', {
            message: 'invalid timespan'
        });
        return false;
    }
      
    // if we get here, then there is no overlap!
    return true;
      
    // check if the single date is within the time span
    function isContained (singleDate) {
        return singleDate > startDateTime && singleDate < endDateTime;
    }
}