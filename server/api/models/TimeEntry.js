/**
* TimeEntry.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    startDateTime: {
      type: 'datetime',
      required: true,
      before: function() {
        'use strict';
        sails.log.debug('before: ' + this.endDateTime);
        return this.endDateTime;
      }
    },
    endDateTime: {
      type: 'datetime',
      required: true,
      after: function () {
        'use strict';
        sails.log.debug('after: ' + this.startDateTime);
        return this.startDateTime;
      }
     },
    notes: {
      type: 'string',
      defaultsTo: ''
    },
    isApproved: {
      type: 'boolean',
      defaultsTo: false
    },
    user: {
      model: 'user',
      required: true
    }
  }
};
