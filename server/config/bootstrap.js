/* global TimeEntry */
/// <reference path="../../typings/lodash/lodash.d.ts"/>
/* global sails */
/* global User */
var phantom = require('phantom'),
    path = require('path'),
    fs = require('fs'),
    Promise = require('bluebird'),
    htmlTemplate = '';
/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {
  cb();
  generateReports();
};


//function setupLaterJobs (cb) {
//  
//}

function generateReports () {
  return new Promise(function (resolve, reject) {
    return User.find().exec(function (err, users) {
      if (err) {
        return reject(err);
      }
      
      _.each(users, function (user) {
        return loadTemplate()
        .then(function (htmlTemplate) {
          var username, payPeriodStart, payPeriodEnd, rowContent, totalHours,  
            html = _.clone(htmlTemplate);
            
          username = user.name;
          payPeriodEnd = new Date();
          payPeriodStart = new Date(payPeriodEnd - 12096e5); // this is 2 weeks in milliseconds
          totalHours = 0;
          rowContent = '';
          
          TimeEntry
          .find()
          .where({ user: user.id })
          .where({ isApproved: true })
          .then(function (entries) {
            var promises = [];
            if (entries && entries.length > 0) {
              _.each(entries, function (entry) {
                var promise = getMoarEntryData(entry)
                .spread(function (userCoveredForName, reasonName, apparatusName, approvedBySignature) {
                  var hoursWorked = +(((entry.endDateTime - entry.startDateTime) / 1000 / 60 / 60).toFixed(1));
                  rowContent += [
                    '<tr>',
                      '<td>' + entry.createdAt.toLocaleDateString() + '</td>',
                      '<td>' + userCoveredForName + '</td>',
                      '<td>' + reasonName + '</td>',
                      '<td>' + apparatusName + '</td>',
                      '<td>' + entry.notes + '</td>',
                      '<td>' + entry.startDateTime.toLocaleString() + '</td>',
                      '<td>' + entry.endDateTime.toLocaleString() + '</td>',
                      '<td>' + hoursWorked + '</td>',
                      '<td><img src="' + approvedBySignature + '" /></td>',
                    '</tr>'
                  ].join('');
                  totalHours += hoursWorked;
                  return rowContent;
                });
                promises.push(promise);
              });
                
              Promise
              .all(promises)
              .then(function (contents) {
                html = html
                .replace('__USER_NAME__',                   username)
                .replace('__PAY_PERIOD_START__',            payPeriodStart.toLocaleDateString())
                .replace('__PAY_PERIOD_END__',              payPeriodEnd.toLocaleDateString())
                .replace('__ROW_CONTENT__',                 contents.join(''))
                .replace('__TOTAL_HOURS__',                 totalHours);
                
                sails.log.debug(html);
              });
            } else {
              sails.log.debug('No time entries found', {
                username: user.name,
                userEmail: user.email,
                payPeriodStart: payPeriodStart.toString(),
                payPeriodEnd: payPeriodEnd.toString()
              });
            }
          });
        });
      });
      resolve();
    });
  });
}

function loadTemplate () {
  return new Promise(function (resolve, reject) {
    if (!htmlTemplate) {
      fs.readFile(path.resolve('./config/time-entry-report.template.html'), 'utf8', function (err, data) {
        if (err) {
          sails.log.error(err);
          return reject(err);
        }
        htmlTemplate = data;
        return resolve(htmlTemplate);
      });
    } else {
      return resolve(htmlTemplate);
    }
  });
}

function getMoarEntryData (entry) {
  return Promise.all([
    getUserCoveredForName(entry.userCoveredFor),
    getReasonName(entry.reason),
    getApparatusName(entry.apparatus),
    getApprovedBySignature(entry.approvedBy)
  ]);
  
  function getUserCoveredForName (id) {
    return User
    .findOne()
    .where({ id: id })
    .then(function (user) {
      return user.name;
    });
  }
  
  function getReasonName (id) {
    return Reason
    .findOne()
    .where({ id: id })
    .then(function (reason) {
      return reason.name;
    });
  }
  
  function getApparatusName (id) {
    return Apparatus
    .findOne()
    .where({ id: id })
    .then(function (apparatus) {
      return apparatus.name;
    });
  }
  
  function getApprovedBySignature (id) {
    return User
    .findOne()
    .where({ id: id })
    .then(function (user) {
      return user.signature;
    });
  }
}