const fetch = require('node-fetch');
const config = require('./config');

const postToSendgrid = (email) => {
  const url = 'https://api.sendgrid.com/v3/mail/send';
  const apiKey = config.sendgridKey;
  const data = {
    personalizations: [{to: [{email: email.to, name: email.to_name}], subject: email.subject}],
    from: {email: email.from, name: email.from_name},
    content: [{type: 'text/plain', value: email.body }]
  };

  const sendgridResponse = {
    success: false,
    errorMessage: ''
  };

  return fetch(url, {
    method: 'post',
    host: 'api.sendgrid.com',
    headers: {
      'Authorization': 'Bearer '.concat(apiKey),
      'Content-Type': 'application/json',
      'User-Agent': 'sendgrid/1.0.0;nodejs'
    },
    body: JSON.stringify(data)
  }).then((response) => {
    if(response.ok){
      sendgridResponse.success = true;
      return response.text();
    } else {
      console.log('Sengrid failure');
      return response.json();
    }
  }).then((json) => {
    if(!sendgridResponse.success) sendgridResponse.errorMessage = json.errors[0].message;
    // callback(sendgridResponse)
    return sendgridResponse;
  });

}

module.exports = postToSendgrid;
