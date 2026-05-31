const applicationTemplate = require('./applicationTemplate');
const interviewTemplate = require('./interviewTemplate');
const selectionTemplate = require('./selectionTemplate');
const rejectionTemplate = require('./rejectionTemplate');
const offerLetterTemplate = require('./offerLetterTemplate');
const onboardingReminderTemplate = require('./onboardingReminderTemplate');

const templateManager = require('./templateManager');

module.exports = {
  applicationTemplate,
  interviewTemplate,
  selectionTemplate,
  rejectionTemplate,
  offerLetterTemplate,
  onboardingReminderTemplate,
  ...templateManager
};
