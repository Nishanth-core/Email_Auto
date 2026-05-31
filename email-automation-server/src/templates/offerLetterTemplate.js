const { baseTemplate } = require('./baseTemplate');

const offerLetterTemplate = ({ name, role, startDate }) =>
  baseTemplate(
    'Offer Letter',
    `
    <p>Dear ${name},</p>
    <p>We are delighted to extend an offer for the position of <strong>${role}</strong>.</p>
    <p><strong>Proposed start date:</strong> ${startDate}</p>
    <p>Please review the attached terms discussed with HR and confirm your acceptance at your earliest convenience.</p>
    <p>Welcome to the team — we look forward to working with you.</p>
  `
  );

module.exports = offerLetterTemplate;
