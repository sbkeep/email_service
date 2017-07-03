window.onload = () => {
  email.emailFields.subject.focus();
  testProviders()
}

// Hits /test route to test connection to active & backup providers
const testProviders = () => {
  fetch('test', {
    method: 'get',
  }).then((response) => {
    return response.json();
  }).then((json) => {
    const active = document.getElementById('active-provider');
    const backup = document.getElementById('backup-provider');

    // Update style/image to convey offline or online status of provider
    active.classList = `provider ${json.active.success?'online':'offline'}`
    backup.classList = `provider ${json.backup.success?'online':'offline'}`

    // Display which provider is active & backup
    const activeText = document.createTextNode(json.active.name);
    active.appendChild(activeText);
    const backupText = document.createTextNode(json.backup.name);
    backup.appendChild(backupText);
  });
}

// Main class for front end email,
// Differs from server class with front-end validation & calls to server
// If I was spending more time I would creat a base Email Class
class PageEmail {
  constructor() {
    this.emailFields = {
      subject: document.getElementById('subject'),
      to_name: document.getElementById('to_name'),
      to: document.getElementById('to'),
      from_name: document.getElementById('from_name'),
      from: document.getElementById('from'),
      body: document.getElementById('body')
    };
    this.email = {};
    this.errors = [];
  }

  // Main submit action linked to Send button on email form
  submit() {
    this.validate();
    if(this.errors.length === 0) {
      this.postEmail();
    } else {
      this.validationError();
    }
  }

  // Front end validation to prevent invalid data from being submitted
  validate() {
    // Reset errors
    this.clearErrors();

    // Iterate through all fields on the email to check for validation errors
    for(let fieldName in this.emailFields) {
      const fieldValue = this.emailFields[fieldName].value;
      let error = false;
      if (['subject', 'to_name', 'from_name', 'body'].includes(fieldName)) {
        error = !(!!(fieldValue.replace(/\s/g, '')))
      } else if (['to', 'from'].includes(fieldName)) {
          error = !(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(fieldValue);
      }
      // Add any errors that are found
      if(error) {this.errors.push(fieldName)};
    }
  }

  // Fetch function for sending POST request to /email
  postEmail() {
    for (let fieldName in this.emailFields) {
      this.email[fieldName] = this.emailFields[fieldName].value;
    }
    let page = this;
    fetch('email', {
      method: 'post',
      body: JSON.stringify(this.email)
    }).then((response) => {
      return response.json();
    }).then((json) => {
      if(json.emailStatus == 'posted') {
        page.emailSuccess();
      } else {
        page.emailFailure(json);
      }
    });
  }

  // Alert user and reset form if server reports that email sent successfully
  emailSuccess() {
    alert('email sent!')
    this.email = {};
    for(let fieldName in this.emailFields) {
      this.emailFields[fieldName].value = '';
    }
  }

  // Alert user and relay error if server reports that email sending failed
  emailFailure(responsejson) {
    alert('email failure\n' + JSON.stringify(responsejson));
  }

  // Helper function to clear errors on re-submission or new-form
  clearErrors() {
    this.errors = [];
    Object.keys(this.emailFields).forEach((fieldName) => {
      const field = document.getElementById(fieldName);
      field.classList.remove('error');
    });
  }

  // Function to update display of fields with errors
  validationError() {
    // Keep appropriate fields in the error state
    this.errors.forEach((fieldName) => {
      const field = document.getElementById(fieldName);
      field.classList.add('error');
    });

    // Focus on first error field
    document.getElementById(this.errors[0]).focus();

    //Using default Alert functionality to display validation errors with the form
    let alertError = '';
    this.errors.forEach((fieldName) => {
      alertError += fieldName + ' required!\n'
    });
    alert(alertError + '\nFix fields and try re-sending');
  }
}

const email = new PageEmail();
