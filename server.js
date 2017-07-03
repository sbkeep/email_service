const express = require('express');
const path = require('path');

const config = require('./config');

const ServerEmail = require('./ServerEmail.js')

const server = express();
const PORT = config.port;

server.use('/', express.static(__dirname + '/public'));

server.get('/email', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
});

server.post('/email', (req, res) => {
  let body = '';

  req.on('data', (data) => {
    // Add incoming data to body
    body += data;
    if (body.length > 1e6) request.connection.destroy();
  });

  req.on('end', () => {
    // Create new instance of ServerEmail for each request
    const email = new ServerEmail();

    // Strip HTML to send plain text version of email
    body = body.replace(/<[^>]+>/ig, '');

    // Validate fields sent via the body of the request
    email.validate(body);

    // Check if any errors were found
    if(email.requiredErrors.length === 0 && email.formatErrors.length === 0) {
      // If no errors then send email through provider
      email.sendEmail(() => res.send(email.response));
    } else {
      // If errors return validation errors without sending request to provider
      email.validationError();
      res.send(email.response);
    }
  })
});



// Test Route which will test connection to both providers and report back to front end
server.get('/test', (req, res) => {
  const activeTest = new ServerEmail(config.activeProvider);
  const backupTest = new ServerEmail(config.backupProvider);

  const testResponse = () => {
    const activeDone = Object.keys(activeTest.response).length > 0;
    const backupDone = Object.keys(backupTest.response).length > 0;

    if(activeDone && backupDone){
      const activeSuccess = activeTest.response.success;
      const backupSuccess = backupTest.response.success;
      res.send({
        active: {success: activeSuccess, name: config.activeProvider},
        backup: {success: backupSuccess, name: config.backupProvider}
      })
    }
  };

  activeTest.test();
  backupTest.test();

  activeTest.sendEmail(testResponse);
  backupTest.sendEmail(testResponse);
})




server.listen(PORT, () => {
	console.log('_'.repeat(20));
  const d = new Date();
  console.log(d.toLocaleString());
	console.log(`listening on ${PORT}`)
});
