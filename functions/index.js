const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

exports.sendHelloEmail = functions.database.ref('/users/{userId}').onCreate(event => {
    const data = event.data.val();
    const transport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'email-here',
            pass: functions.config().email.password
        }
    });

    const mailOptions = {
        from: 'Photoboard <email-here>',
        to: data.email,
        subject: 'Hello, dear ' + data.displayName,
        text: 'Thanks you for joining awesome photo-board!'
    };

    return transport.sendMail(mailOptions).then(() => {
        console.log('Email sent to:', data.email);
    }).catch(error => {
        console.error('Error during sending email:', error);
    });
});