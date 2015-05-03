/* global sails */
'use strict';
var bcrypt = require('bcrypt'),
    Promise = require('bluebird');  // jshint ignore:line

/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    name: {
      type: 'string',
      required: true
    },
    email: {
      type: 'email',
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      required: true
    },
    isOfficer: {
      type: 'boolean',
      required: true,
      defaultsTo: false
    },
    signature: {
      type: 'string'
    },
    timeEntries: {
      collection: 'timeentry',
      via: 'user'
    },

    /* INSTANCE METHODS */
    authenticate: function authenticate (password) {
      var self = this;
      sails.log.debug('User.authenticate', {
        user: self.toJSON()
      });
      return new Promise(function (resolve, reject) {
        bcrypt.compare(password, self.password, function (err, result) {
          if (err) {
            sails.log.debug('User.authenticate :: failed to authenticate due to bad password.');
            reject(new Error('Incorrect password.'));
          }
          else {
            sails.log.debug('User.authenticate :: authenticated!');
            resolve(result);
          }
        });
      });
    },

    /* OVERRIDE */
    toJSON: function toJSON () {
      var user = this.toObject();
      delete user.password;
      return user;
    }
  },

  /* STATIC FUNCTIONS */
  beforeCreate: function(user, cb) {
    // An example encrypt function defined somewhere
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, function(err, hash) {
          // Store hash in your password DB.
          user.password = hash;
          cb();
      });
    });
  }
};
