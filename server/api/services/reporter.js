/* global TimeEntry, sails, User, Reason, Apparatus, process */
'use strict';
var phantom = require('phantom'),
    path = require('path'),
    fs = require('fs'),
    Promise = require('bluebird'),
    nodemailer = require('nodemailer'),
    htmlTemplate = '',
    twoWeeksMs = 12096e5; // 2 weeks in milliseconds

// API
module.exports.generateAndSend = generateAndSend;
module.exports.generateAndSendForUser = generateAndSendForUser;

/**
 * generate an extra pay timesheet for each user in the system
 * that has gotten their time entries approved
 */
function generateAndSend () {
  return new Promise(function (resolve, reject) {
    return User.find().exec(function (err, users) {
      var promises = [];
      if (err) {
        return reject(err);
      }

      _.each(users, function (user) {
          promises.push(generateAndSendForUser(user));
      });

      Promise.all(promises).then(resolve);
    });
  });
}

function generateAndSendForUser (user, payPeriodStart) {
    return loadTemplate()
    .then(function (htmlTemplate) {
      var username, userSignature, userTitle, payPeriodEnd, rowContent, totalHours, email, html;

      sails.log.debug('process', process.env);

      html = _.clone(htmlTemplate);
      username = user.name;
      userSignature = user.signature;
      userTitle = user.title;
      totalHours = 0;
      rowContent = '';

      // set the pay period and email to send the report to 
      // based on how the report was generated
      if (payPeriodStart) {
        // use initiated report
        email = user.email;
        payPeriodStart = new Date(payPeriodStart.setHours(7, 0, 0, 0)); // 7:00:00:000
        payPeriodEnd = new Date(payPeriodStart + twoWeeksMs);
      } else {
        // later.js initiated report
        email = process.env.VT_HR_EMAIL;
        payPeriodEnd = new Date(new Date().setHours(7, 0, 0, 0)); // 7:00:00:000
        payPeriodStart = new Date(payPeriodEnd - twoWeeksMs);
      }

      TimeEntry
      .find()
      .where({ user: user.id })
      .where({ isApproved: true })
      .where({ startDateTime: { '>=': payPeriodStart }})
      .where({ endDateTime:   { '<=': payPeriodEnd   }})
      .then(function (entries) {
        var promises = [];
        if (entries && entries.length > 0) {
          _.each(entries, function (entry) {
            sails.log.debug('entry', entry);
            sails.log.debug('entry compare', {
              isAfterStart: entry.endDateTime > payPeriodStart,
              isBeforeEnd: entry.endDateTiem < payPeriodEnd
            });
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
            .replace('__TOTAL_HOURS__',                 totalHours)
            .replace('__USER_SIGNATURE__',              userSignature)
            .replacE('__USER_TITLE__',                  userTitle);

            sails.log.debug(html);
            phantom.create(function (ph) {
              ph.createPage(function (page) {
                var filename = '/tmp/test-' + username.replace(' ', '_') + '-' + new Date().getTime() + '.pdf';
                page.setContent(html);
                page.paperSize = {
                  format: 'A5'
                };
                // yes, I know this comes out weird because 
                // the table doesn't get any margin on the 
                // right side of the page. I couldn't figure
                // it out to save my lift!
                page.render(filename, { format: 'pdf' });
                
                sendEmail(
                  email,
                  'Time Entries Report for ' + username,
                  'Attached is a report of the time entries for <strong>' + username + '</strong> for pay period <strong>' + payPeriodStart.toLocaleString() + '</strong> to <strong>' + payPeriodEnd.toLocaleString() + '</strong>',
                  filename
                );
          
                sails.log.debug('email sent!', {
                  username: user.name,
                  userEmail: user.email,
                  payPeriodStart: payPeriodStart.toString(),
                  payPeriodEnd: payPeriodEnd.toString(),
                  file: filename
                });
                
                ph.exit();
              });
            });
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
}

function loadTemplate () {
  return new Promise(function (resolve, reject) {
    if (!htmlTemplate) {
      fs.readFile(path.resolve('./config/templates/time-entry-report.template.html'), 'utf8', function (err, data) {
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
}


function sendEmail (to, subject, body, filePath) {
    var transporter, mailOptions;

    transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.VT_GMAIL_USERNAME,
            pass: process.env.VT_GMAIL_PASSWORD
        }
    });

    mailOptions = {
        from: 'Verified Timesheets <verified.timesheets@gmail.com>',
        to: to,
        subject: subject,
        text: body,
        html: body,
        attachments: [
            { path: filePath }
        ]
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            sails.log.error(error);
        } else {
            sails.log.debug('Message sent: ' + info.response);
        }
    });
}

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
