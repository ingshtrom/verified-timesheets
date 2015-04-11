/**
 * officerSessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated officer
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticatedOfficer = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {
  'use strict';
  // User is allowed, proceed to the next policy,
  // or if this is the last policy, the controller
  if (req.session.authenticatedOfficer) {
    return next();
  }

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  return res.forbidden('You are not permitted to perform this action.');
};
