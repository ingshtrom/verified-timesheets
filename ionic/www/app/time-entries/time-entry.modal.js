(function () {
    'use strict';

    angular
        .module('vt.time-entries')
        .factory('TimeEntry', TimeEntry);

    function TimeEntry () {
        return {
            $new: function $new (opts) {
                return new TimeEntryObject();
            }
        };
    }

    function TimeEntryObject (opts) {
        var options = _.extend({
            startDateTime: Date.now(),
            endDateTime: Date.now(),
            notes: '',
            isApproved: false,
            userCoveredFor: null,
            reason: null,
            apparatus: null,
            user: {},
            approvedBy: null
        }, opts);

        this.startDateTime = options.startDateTime;
        this.endDateTime = options.endDateTime;
        this.notes = options.notes;
        this.isApproved = options.isApproved;
        this.userCoveredFor = options.userCoveredFor;
        this.reason = options.reason;
        this.apparatus = options.apparatus;
        this.user = options.user;
        this.approvedBy = options.approvedBy;
    }



})();