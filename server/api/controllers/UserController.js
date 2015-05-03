/// <reference path="../../../typings/lodash/lodash.d.ts"/>
/* global sails */
/* global User */
/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  login: login,
  logout: logout,
  update: update
};

function login (req, res) {
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
  }
  
  function logout (req, res) {
    'use strict';
    sails.log.debug('UserController.logout');
    delete req.session.user;
    delete req.session.authenticated;
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully.'
    });
  }
  
  function update (req, res) {
    'use strict';
    var id = req.params.id;
    // only the current user can change their own signature
    if (req.session.user.id !== req.body.id) {
      delete req.body.signature;
    }
    
    User.findOne(id)
    .exec(function (err, user) {
      sails.log.debug('UserController.update\n', {
        id: id,
        user: user
      });
      
      if (err || !user) {
        sails.log.debug('problem finding the user', {
          err: err + ''
        });
        return res.status(401).json({ errorMessage: 'Invalid id.'});
      }
      
      user = _.extend(user, req.body);
      user.save(function (err, savedEntry) {
        var jsonResponse;
        if (err) {
          if (err.toJSON) { jsonResponse = err.toJSON(); }
          else { jsonResponse.error = err.name + ' => ' + err.message; }

          sails.log.error('UserController.update', {
            status: 'error',
            errorResponse: jsonResponse,
          });

          return res.status(500).json(jsonResponse);
        }
        return res.status(201).json(savedEntry);
      });
    });
  }