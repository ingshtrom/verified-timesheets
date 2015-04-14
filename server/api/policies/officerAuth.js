/**
 * officerAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any officer
 *                 Assumes that your login action in one of your controllers sets `req.session.user`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {
  'use strict';

  if (req.session.user && req.session.user.isOfficer) {
    return next();
  }

  return res.forbidden('You must be an officer to perform this action.');
};
