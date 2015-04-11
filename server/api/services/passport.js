var passport = require('passport');

passport.login = function login (req, res, next) {
  'use strict';

  this.authenticate('local', function (err) {
    if (!err) { req.session.authenticated = true; }
    if (next) { next(err); }
  });
};

passport.logout = function logout (req, res, next) {
  'use strict';

  req.logout();
  if (next) { next(); }
};

module.exports = passport;
