/* global TimeEntry */
/**
 * TimeEntryController
 *
 * @description :: Server-side logic for managing Timeentries
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  /**
   * Create a new TimeEntry with the current user. The startDateTime
   * and endDateTime will be converted to Date objects.
   * @param  {[type]} req [description]
   * @param  {[type]} res [description]
   * @return {[type]}     [description]
   */
  create: function create (req, res) {
    'use strict';
    var newTimeEntry = req.body;
    newTimeEntry.user = req.session.user.id;
    newTimeEntry.startDateTime = new Date(parseInt(newTimeEntry.startDateTime));
    newTimeEntry.endDateTime = new Date(parseInt(newTimeEntry.endDateTime));

    sails.log.debug('TimeEntryController.create', {
      newTimeEntry: newTimeEntry
    });

    TimeEntry.create(newTimeEntry, function (err, created) {
      var jsonResponse = {};
      if (err) {
        if (err.toJSON) { jsonResponse = err.toJSON(); }
        else { jsonResponse.error = err.name + ' => ' + err.message; }
        sails.log.error('TimeEntryController.create', {
          status: 'error',
          errorResponse: jsonResponse,
        });
        return res.status(500).json(jsonResponse);
      }
      sails.log.debug('TimeEntryController.create', {
        status: 'success',
        created: created
      });
      res.status(201).json(created);
    });
  },
  /**
   * A route only accessible by officers,
   * sets the isApproved values to true.
   * @param  {[type]} req [description]
   * @param  {[type]} res [description]
   * @return {[type]}     [description]
   */
	approve: function approve (req, res) {
    'use strict';
    var id = req.params.id;
    TimeEntry.findOne(id)
    .exec(function (err, entry) {
      var jsonResponse;

      sails.log.debug('TimeEntryController.approve', {
        entry: entry
      });

      if (err) {
        if (err.toJSON) { jsonResponse = err.toJSON(); }
        else { jsonResponse.error = err.name + ' => ' + err.message; }

        sails.log.error('TimeEntryController.approve', {
          status: 'error',
          errorResponse: jsonResponse,
        });

        return res.status(500).json(jsonResponse);
      }

      entry.isApproved = true;
      entry.save();

      return res.status(200).json(entry);
    });
  },
  update: function update (req, res) {
    'use strict';
    // strip any changes to isApproved.
    // That should only be done through
    // the approve action.
    return res.status(403).json({});
  }
};
