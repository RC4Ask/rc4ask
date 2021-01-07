const fs = require('fs')
const ejs = require('ejs')
const emailer = require('../middleware/emailer')
const emailTemplatesDir = __dirname + '/../views/mailers'

/* Sends registration email */
exports.verifyRegistration = async response => {
  const user = response.user
  return new Promise((resolve, reject) => {
    const file = fs.readFileSync(
      emailTemplatesDir + '/verify_registration.ejs',
      'ascii'
    );

    const domain = process.env.NODE_ENV == "production" ? 'https://rc4ask.herokuapp.com' : 'http://localhost:3000'
    var verificationUrl =
      domain +
      '/verify' +
      '/' + response.token

    const data = {
      from: 'RC4Ask <rc4ask@gmail.com>',
      to: user.email,
      subject: 'Registration Confirmation',
      html: ejs.render(file, { user, verificationUrl })
    };

    emailer.sendMail(data, (err, info, response) => {
      if (err) reject(err);
      else resolve(info, response);
    });
  });
};

exports.forgotPassword = async (user, token) => {
  return new Promise ((resolve, reject) => {
    const file = fs.readFileSync(
      emailTemplatesDir + '/forgot_password.ejs',
      'ascii'
    );

    const domain = process.env.NODE_ENV == "production" ? 'https://rc4ask.herokuapp.com' : 'http://localhost:3000'
    var forgotPasswordUrl = 
      domain +
      '/reset-password' +
      '/' + token

    const data = {
      from: 'RC4Ask <rc4ask@gmail.com>',
      to: user.email,
      subject: 'Forgot Password Request',
      html: ejs.render(file, { user, forgotPasswordUrl })
    }

    emailer.sendMail(data, (err, info, response) => {
      if (err) reject(err);
      else resolve(info, response);
    });
  })
}
