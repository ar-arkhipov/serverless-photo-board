const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const vision = require('@google-cloud/vision')();
const gcs = require('@google-cloud/storage')();

exports.sendHelloEmail = functions.database.ref('/users/{userId}').onCreate((snapshot, context) => {
    const data = snapshot.val();
    const transport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'web200ok@gmail.com',
            pass: functions.config().email.password
        }
    });

    const mailOptions = {
        from: 'Photoboard WEB200CONF',
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

exports.checkImage = functions.storage.object().onFinalize(object => {

    if (object.resourceState === 'not_exists' || !object.name) return;

    const image = {
        source: {imageUri: `gs://${object.bucket}/${object.name}`}
    };

    return vision.safeSearchDetection(image).then(batchAnnotateImagesResponse => {
        const result = batchAnnotateImagesResponse[0].safeSearchAnnotation;

        if (result.violence === 'LIKELY' || result.violence === 'VERY_LIKELY' || result.violence === 'POSSIBLE') {
            console.log('ALARM, POSSIBLY VIOLENT IMAGE!');
            return gcs.bucket(object.bucket).file(object.name).delete();
        } else {
            console.log(`Image ${object.name} is OK.`);
        }
    });
});

