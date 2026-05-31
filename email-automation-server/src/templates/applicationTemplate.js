const { baseTemplate } = require('./baseTemplate');

const applicationTemplate = (name) =>
  baseTemplate(
    'Application Received',
    `
    <p>Dear ${name},</p>
    <p>We have successfully received your internship application.</p>
    <p>Our HR team will review your profile shortly. You will be notified about the next steps via email.</p>
  `
  );

module.exports = applicationTemplate;
