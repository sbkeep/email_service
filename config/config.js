const keys = require('./keys');

module.exports = {
  activeProvider: "sendgrid",
  backupProvider: "mailgun",
  port: 5521,
  sendgridKey: keys.sendgridKey,
  mailgunUrl: keys.mailgunUrl,
  mailgunKey: keys.mailgunKey,
}
