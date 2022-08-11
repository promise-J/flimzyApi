const {AUTH_USER, AUTH_PASS, EMAIL_SENDER} = process.env

// module.exports = sendMail;
const nodemailer = require('nodemailer');

const sendMail = async (options)=> {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: AUTH_USER,
            pass: AUTH_PASS
        }
    });

    const mailOptions = {
        // from: process.env.EMAIL_USER, sender address
        from: options.from,  // sender address
        to: options.to, // list of receivers
        subject: options.subject, // Subject line
        html: options.message// plain text body
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if(err)
            console.log(err)
        // else
            // console.log(info);
    })
}



module.exports = sendMail
