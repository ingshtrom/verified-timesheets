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
        var userJSON;
        sails.log.debug('UserController.login', {
          isAuthenticated: isAuthenticated
        });

        if (!isAuthenticated) {
          return res.status(401).json({ errorMessage: 'Invalid password' });
        }

        userJSON = user.toJSON();
        req.session.user = userJSON;
        req.session.authenticated = true;
        res.status(200).json(userJSON);
      })
      .catch(function (err) {
        return res.status(500).json({ errorMessage: err.message });
      });
    });
  },
  logout: function logout (req, res) {
    'use strict';
    sails.log.debug('UserController.logout');
    delete req.session.user;
    delete req.session.authenticated;
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully.'
    });
  }
};
