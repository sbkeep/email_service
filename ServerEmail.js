const config = require('./config');

const postToSendgrid = require('./postToSendgrid.js');
const postToMailGun = require('./posttoMailGun.js');

// Main class for backend email
 class ServerEmail {
  constructor(provider) {
    this.email = {};
    this.requiredFields = ['subject', 'to_name', 'to', 'from_name', 'from', 'body'];
    this.requiredErrors = [];
    this.formatErrors = [];
    this.response = {};
    this.provider = provider || config.activeProvider;

    this.receiveResponse = this.receiveResponse.bind(this);
  }
  // Validation for json package, to ensure all required fields present and in proper format
  validate(body) {
    this.email = JSON.parse(body);

    this.requiredFields.forEach(function(field) {
      if (!Object.keys(this.email).includes(field))
        this.requiredErrors.push(field);
    }.bind(this))

    for(let fieldName in this.email) {
      const fieldValue = this.email[fieldName];
      let error = false;
      if (['subject', 'to_name', 'from_name', 'body'].includes(fieldName)) {
        error = !(!!(fieldValue.replace(/\s/g, '')))
      }
      if (['to', 'from'].includes(fieldName)) {
        error = !(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(fieldValue);
      }
      if(error) this.formatErrors.push(fieldName)
    }
  }

  // Test function mocks an email package
  test() {
    this.email = {
      subject: 'Test Subject',
      to_name: 'Test To Name',
      to: 'sw000shsb@gmail.com',
      from_name: 'Test From Name',
      from: 'sw000shsb@gmail.com',
      body: 'test body with lots of content'
    }
  }

  // Sends email using configured provider and it's helper function
  sendEmail(callback) {
    this.callback = callback;
    // Send email through configured provider
    if(this.provider === 'sendgrid'){
      postToSendgrid(this.email).then(sendgridResponse => this.receiveResponse(sendgridResponse));
    } else if(this.provider === 'mailgun') {
      postToMailGun(this.email, this.receiveResponse);
    }
  }

  // Callback function to receive response from provider
  receiveResponse(providerResponse) {
    if(providerResponse.success) {
      this.response = {
        provider: this.provider,
        success: true,
        emailStatus: 'posted'
      }
    } else {
      this.response = {
        provider: this.provider,
        success: false,
        emailStatus: 'not posted',
        message: providerResponse.errorMessage
      }
    }

    this.callback();
  }

  // Report back validation errors in response if found
  validationError() {
    this.response = {
      success: false,
      missing_fields: this.requiredErrors,
      formatting_issues: this.formatErrors,
      emailStatus: 'not posted'
    }

  }
}

module.exports = ServerEmail;
