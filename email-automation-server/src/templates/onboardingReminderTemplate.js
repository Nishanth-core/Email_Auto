const { baseTemplate } = require('./baseTemplate');

const onboardingReminderTemplate = ({ name, dueDate, checklistLink }) => {
  const checklistBlock = checklistLink
    ? `<p><strong>Onboarding checklist:</strong> <a href="${checklistLink}">${checklistLink}</a></p>`
    : '';

  return baseTemplate(
    'Onboarding Reminder',
    `
    <p>Dear ${name},</p>
    <p>This is a friendly reminder to complete your onboarding tasks.</p>
    <p><strong>Due date:</strong> ${dueDate}</p>
    ${checklistBlock}
    <p>If you have already completed these steps, please disregard this message.</p>
  `
  );
};

module.exports = onboardingReminderTemplate;
