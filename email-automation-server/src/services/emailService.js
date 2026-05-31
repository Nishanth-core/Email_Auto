const { transporter } = require('../config/smtp');
const { isEmailConfigured } = require('../utils/validateEnv');

const sendEmail = async ({ to, subject, html, text }) => {
  if (!isEmailConfigured()) {
    const err = new Error(
      'Email provider is not configured. Set EMAIL_USER and EMAIL_PASS (App Password) in .env'
    );
    err.statusCode = 503;
    throw err;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER?.trim(),
    to,
    subject,
    html,
    ...(text && { text })
  };

  const result = await transporter.sendMail(mailOptions);

  return {
    messageId: result.messageId,
    accepted: result.accepted,
    rejected: result.rejected
  };
};

module.exports = sendEmail;
