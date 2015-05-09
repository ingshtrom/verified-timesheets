/* global TimeEntry, sails, User, Reason, Apparatus */
'use strict';
var phantom = require('phantom'),
    path = require('path'),
    fs = require('fs'),
    Promise = require('bluebird'),
    nodemailer = require('nodemailer'),
    htmlTemplate = '';

module.exports = {
    registerLater: registerLater,
    generateAndSend: generateAndSend
};

function registerLater () {
  
}

/**
 * generate an extra pay timesheet for each user in the system
 * that has gotten their time entries approved
 */
function generateAndSend () {
  return new Promise(function (resolve, reject) {
    return User.find().exec(function (err, users) {
      var dateRangeStart, dateRangeEnd, promises = [];
      if (err) {
        return reject(err);
      }

      // get 00:00 from today
      dateRangeEnd = new Date();
      dateRangeEnd = 

      _.each(users, function (user) {
          promises.push(generateAndSendForUser(user));
      });

      Promise.all(promises).then(resolve);
    });
  });
}

function generateAndSendForUser (user, isSingle) {
    return loadTemplate()
    .then(function (htmlTemplate) {
      var username, payPeriodStart, payPeriodEnd, rowContent, totalHours,
        html = _.clone(htmlTemplate);

      username = user.name;
      totalHours = 0;
      rowContent = '';
      payPeriodStart = 'n/a';
      payPeriodEnd = 'n/a';
      
      if (!isSingle) {
        payPeriodEnd = new Date(new Date().setHours(0, 0, 0, 0));
        payPeriodStart = new Date(payPeriodEnd - 12096e5); // this is 2 weeks in milliseconds
      }

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
                sendEmail('avidgamer123@gmail.com', 'Almost there!!!', 'This is a test of what you would get..', filename);
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


function sendEmail (to, subject, html, filePath) {
    var transporter, mailOptions;

    transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'verified.timesheets@gmail.com',
            pass: 'Gv5JM5kPU38LTr3ruzb7'
        }
    });

    mailOptions = {
        from: 'Verified Timesheets <noreply.verified.timesheets@gmail.com>',
        to: to,
        subject: subject,
        text: 'There is no text version, yet.',
        html: html,
        attachments: [
            { path: filePath }
        ]
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Message sent: ' + info.response);
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
