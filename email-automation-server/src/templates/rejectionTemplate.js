const { baseTemplate } = require('./baseTemplate');

const rejectionTemplate = (name) =>
  baseTemplate(
    'Application Update',
    `
    <p>Dear ${name},</p>
    <p>Thank you for your interest in joining our team and for the time you invested in the application process.</p>
    <p>After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.</p>
    <p>We encourage you to apply again for future openings that match your profile.</p>
  `
  );

module.exports = rejectionTemplate;
