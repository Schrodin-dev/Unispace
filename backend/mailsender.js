const mailConfig = require('./config/mail.json');
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: mailConfig.host,
    port: mailConfig.port,
    secure: mailConfig.secure,
    auth: {
        user: mailConfig.user,
        pass: mailConfig.password
    }
});

exports.envoyerMailPersonne = (receipt, subject, res, content) => {
    const options = {
        from: mailConfig.user,
        to: receipt,
        subject: subject,
        html: content
    }

    transporter.sendMail(options, (error, info) => {
       if(error){
           throw new error;
       }
    });
};

exports.envoyerMailGroupe = groupe => {
    const options = {
        from: mailConfig.user,
        bcc: receipt,
        subject: subject,
        html: content
    }

    transporter.sendMail(options, (error, info) => {
        if(error){
            console.error(error);
        }else{
            console.log('Email envoyé: ' + info);
        }
    });
};