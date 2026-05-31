const { baseTemplate } = require('./baseTemplate');

const selectionTemplate = (name) =>
  baseTemplate(
    'Selection Update',
    `
    <p>Dear ${name},</p>
    <p>We are pleased to inform you that you have been <strong>selected</strong> in our recruitment process.</p>
    <p>Our HR team will contact you shortly with the next steps regarding documentation and offer details.</p>
  `
  );

module.exports = selectionTemplate;
