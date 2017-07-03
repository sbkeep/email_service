# Sample Email Service
This project is a prototype of a sample email service middleware application that communicates with two external email API services: [Sendgrid](https://sendgrid.com/) and [Mailgun](https://www.mailgun.com/)

Two libraries are used for requests to compare differences, [request](https://www.npmjs.com/package/request) and [node-fetch](https://www.npmjs.com/package/node-fetch).


## To run
Will need to define keys in /config/keys.js

Sendgrid:
- [Create Trial Account (Free)](https://app.sendgrid.com/signup?id=71713987-9f01-4dea-b3d4-8d0bcd9d53ed)
- [Create API Key](https://app.sendgrid.com/settings/api_keys) and save to keys.js as `sendgridKey`

Mailgun:
- [Create Account (Free)](https://signup.mailgun.com/new/signup)
- [Create and Select Domain](https://app.mailgun.com/app/domains)
  - Copy the API Base URL and save to keys.js as `mailgunUrl`
- [Copy Private API Key](https://app.mailgun.com/app/account/security) and save to keys.js as `mailgunKey`

```
npm install
npm start
```


## Server Functionality

### Routes
There are three routes:
- GET /test - tests connection to provider services with mock data
  - Server will return a package indicating which is the active & backup provider, and status for each.
- GET /email - returns html for browser interface
  - Email form with test section that hits /test automatically
- POST /email - main endpoint to send email, requires body with following fields:
  - subject
  - to
  - to_name
  - from
  - from_name
  - body


Server will send email through Active Provider by default, as set in /config

## Browser Client

The Browser Client has a form to send an email and Status Section at the top of the page to confirm the status of the connection to both the currently configured **Active Provider**, as well as the **Backup Provider**.  On page load it will test the connection and update the status section.

The form on the Browser Client has front end validation that will check that all fields have information, and will verify the format of the email fields before allowing the user to send.  The rules are the same as the error/validation checking done on the backend
