/* global User */
/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  login: function login (req, res) {
    'use strict';
    var email = req.body.email,
        password = req.body.password;
    User.findOne({ email: email })
    .exec(function (err, user) {
      sails.log.debug('UserController.login\n', {
        user: user
      });
      if (err || !user) {
        sails.log.debug('problem finding the user during login', {
          err: err + '',
          email: email
        });
        return res.status(401).json({ errorMessage: 'Invalid email.'});
      }

      user.authenticate(password)
      .then(function (isAuthenticated) {
        sails.log.debug('UserController.login', {
          isAuthenticated: isAuthenticated
        });

        if (!isAuthenticated) {
          return res.status(401).json({ errorMessage: 'Invalid password' });
        }
        req.session.user = user.toJSON();
        req.session.authenticated = true;
        res.status(200).json({
          message: 'Logged in successfully.',
        });
      })
      .catch(function (err) {
        return res.status(500).json({ errorMessage: 'Generic error while logging in: ' + err});
      });
    });
  }
};
