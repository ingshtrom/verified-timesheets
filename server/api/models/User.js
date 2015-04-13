'use strict';
var bcrypt = require('bcrypt'),
    Promise = require('bluebird');

/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    name: { type: 'string', required: true },
    email: { type: 'email', required: true, unique: true },
    password: { type: 'string', required: true },
    isOfficer: { type: 'boolean', required: true, default: false },

    /* INSTANCE METHODS */
    authenticate: function authenticate (password) {
      var self = this;
      return new Promise(function (resolve, reject) {
        bcrypt.compare(password, self.password, function (err, result) {
          sails.log.debug('User.authenticate', {
            err: err + '',
            result: result
          });
          if (err) { reject(err); }
          else {
            sails.log.debug('User.authenticate :: bcrypt.compare', { result: result });
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
  },
};