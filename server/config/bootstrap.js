/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 *
 */

module.exports.bootstrap = function(cb) {
  'use strict';

  var express = require("express"),
         app = express();

    app.get('*', function(req, res) {
        res.redirect('https://' + req.headers.host + req.url);
    });

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
