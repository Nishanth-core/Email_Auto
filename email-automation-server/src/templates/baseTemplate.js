const COMPANY_NAME = 'InnerWhispers Wellness LLP';

const baseTemplate = (title, bodyHtml) => `
  <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #333;">
    <div style="border-bottom: 2px solid #4a6741; padding-bottom: 12px; margin-bottom: 20px;">
      <h2 style="margin: 0; color: #4a6741;">${title}</h2>
    </div>
    ${bodyHtml}
    <br/>
    <p style="margin: 0;">Regards,</p>
    <p style="margin: 4px 0 0; font-weight: bold;">${COMPANY_NAME}</p>
    <p style="font-size: 12px; color: #888; margin-top: 24px;">This is an automated message from the HR system.</p>
  </div>
`;

module.exports = { baseTemplate, COMPANY_NAME };
