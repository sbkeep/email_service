const request = require('request');
const config = require('./config');

const postToMailGun = (email, callback) => {
  const data = {
    from: email.from,
    to: email.to,
    subject: email.subject,
    text: email.body,
  }
  const options = {
    url: config.mailgunUrl,
    method: 'POST',
    auth: {
      user: 'api',
      password: config.mailgunKey,
    },
    form: data
  };

  let mailgunResponse = {
    success: false,
    errorMessage: ''
  }

  request(options, (err, res, body) => {
    if(res.statusCode===200){
      mailgunResponse.success = true
    } else {
      console.log('Mailgun failure');
      mailgunResponse.errorMessage = body
    }
    callback(mailgunResponse);
  })

};

module.exports = postToMailGun;
