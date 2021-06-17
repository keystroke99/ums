let nodemailer = require('nodemailer');
let CONFIG = require('../config/application.config');
let ejs = require('ejs');

//Creating transport instance
var transport = {
  host: CONFIG.mail.host,
  auth: {
    user: CONFIG.mail.user,
    pass: CONFIG.mail.password,
  },
};

//Creating a Nodemailer Transport instance
var transporter = nodemailer.createTransport(transport);

class MailController {
  async sendMail(toEmail, subject, data, templateName) {
    ejs.renderFile(`./views/${templateName}.ejs`, data, async function(
      err,
      data
    ) {
      if (err) {
        console.log(err);
      } else {
        var mainOptions = {
          from: '"Admin - KiloWott API" umsKiloWott@gmail.com',
          to: toEmail,
          subject: subject,
          html: data,
        };
        await transporter.sendMail(mainOptions, function(err, info) {
          if (err) {
            console.log(err);
            return false;
          } else {
            return true;
          }
        });
      }
    });
  }
}

module.exports = new MailController();
