const { baseTemplate } = require('./baseTemplate');

const interviewTemplate = ({ name, date, time, location, meetingLink }) => {
  const locationBlock = meetingLink
    ? `<p><strong>Meeting link:</strong> <a href="${meetingLink}">${meetingLink}</a></p>`
    : location
      ? `<p><strong>Location:</strong> ${location}</p>`
      : '';

  return baseTemplate(
    'Interview Scheduled',
    `
    <p>Dear ${name},</p>
    <p>Congratulations! We would like to invite you for an interview.</p>
    <p><strong>Date:</strong> ${date}</p>
    <p><strong>Time:</strong> ${time}</p>
    ${locationBlock}
    <p>Please arrive on time and keep this email for your reference.</p>
  `
  );
};

module.exports = interviewTemplate;
