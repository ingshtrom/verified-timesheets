/* global sails, User, process */
'use strict';
/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports.login = login;
module.exports.logout = logout;
module.exports.update = update;
module.exports.create = create;

function create(req, res) {
  var newUser = req.body,
    secretKey = req.body.secretKey;

  sails.log.debug('UserConroller.create', newUser);

  if (secretKey !== process.env.VT_CREATE_KEY && !req.session.authenticated) {
    return res.status(401).json({
      errorMessage: 'Incorrect super secret key.'
    });
  }

  delete newUser.secretKey;
  delete newUser.isOfficer;

  User
    .create(newUser)
    .exec(function(err, user) {
      if (err || !user) {
        sails.log.debug('error creating user', {
          err: err + '',
          newUser: newUser
        });
        return res.status(401).json({
          errorMessage: 'Error creating user.'
        });
      }
      return res.status(201).json(user.toJSON());
    });
}

function login(req, res) {
  var email = req.body.email,
    password = req.body.password;
  User.findOne({
      email: email
    })
    .exec(function(err, user) {
      sails.log.debug('UserController.login\n', {
        user: user
      });
      if (err || !user) {
        sails.log.debug('problem finding the user during login', {
          err: err + '',
          email: email
        });
        return res.status(401).json({
          errorMessage: 'Invalid email.'
        });
      }

      user.authenticate(password)
        .then(function(isAuthenticated) {
          var userJSON;
          sails.log.debug('UserController.login', {
            isAuthenticated: isAuthenticated
          });

          if (!isAuthenticated) {
            return res.status(401).json({
              errorMessage: 'Invalid password'
            });
          }

          userJSON = user.toJSON();
          req.session.user = userJSON;
          req.session.authenticated = true;
          res.status(200).json(userJSON);
        })
        .catch(function(err) {
          return res.status(500).json({
            errorMessage: err.message
          });
        });
    });
}

function logout(req, res) {
  sails.log.debug('UserController.logout');
  delete req.session.user;
  delete req.session.authenticated;
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully.'
  });
}

function update(req, res) {
  var id = req.params.id;
  // only the current user can change their own signature
  if (req.session.user.id !== req.body.id) {
    delete req.body.signature;
  } else if (req.session.user.isOfficer) {
    // an officer can update anyone's 
    // email, name, or isOfficer props
    req.body = {
        email: req.body.email,
        name: req.body.name,
        isOfficer: req.body.isOfficer,
        title: req.body.title
    };
  }

  User.findOne(id)
    .exec(function(err, user) {
      sails.log.debug('UserController.update\n', {
        id: id,
        user: user
      });

      if (err || !user) {
        sails.log.debug('problem finding the user', {
          err: err + ''
        });
        return res.status(401).json({
          errorMessage: 'Invalid id.'
        });
      }

      user = _.extend(user, req.body);

      user.save(function(err, savedEntry) {
        var jsonResponse;
        if (err) {
          if (err.toJSON) {
            jsonResponse = err.toJSON();
          } else {
            jsonResponse.error = err.name + ' => ' + err.message;
          }

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