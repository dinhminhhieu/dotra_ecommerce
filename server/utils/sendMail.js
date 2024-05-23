const nodemailer = require("nodemailer");
const env = require("../config/env.config");

const sendMail = async (user) => {
  const trasporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT, // PORT: 465
    secure: false,
    auth: {
      user: env.SMTP_MAIL,
      pass: env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    form: env.SMTP_MAIL,
    to: user.email,
    subject: "Xác thực tài khoản",
    html: user.html,
  };
  await trasporter.sendMail(mailOptions);
};

module.exports = sendMail;
