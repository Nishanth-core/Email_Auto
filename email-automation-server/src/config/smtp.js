const nodemailer = require('nodemailer');
const { isEmailConfigured } = require('../utils/validateEnv');

const createTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER?.trim(),
      pass: process.env.EMAIL_PASS?.replace(/\s/g, '')
    }
  });

const transporter = createTransporter();

const verifySmtp = async () => {
  if (!isEmailConfigured()) {
    const err = new Error(
      'Email provider is not configured. Set EMAIL_USER and EMAIL_PASS (App Password) in .env'
    );
    err.statusCode = 503;
    throw err;
  }
  await transporter.verify();
};

module.exports = { transporter, verifySmtp, createTransporter };
