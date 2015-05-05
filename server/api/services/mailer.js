'use strict';
var nodemailer = require('nodemailer');

module.exports = {
    send: function(to, subject, html, filePath) {
        var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'verified.timesheets@gmail.com',
            pass: 'Gv5JM5kPU38LTr3ruzb7'
        }
    });

    var mailOptions = {
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
};
