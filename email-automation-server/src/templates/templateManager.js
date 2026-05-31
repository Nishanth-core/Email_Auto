const applicationTemplate = require('./applicationTemplate');
const interviewTemplate = require('./interviewTemplate');
const selectionTemplate = require('./selectionTemplate');
const rejectionTemplate = require('./rejectionTemplate');
const offerLetterTemplate = require('./offerLetterTemplate');
const onboardingReminderTemplate = require('./onboardingReminderTemplate');

const templates = {
  application: (data) => applicationTemplate(data.name),
  application_received: (data) => applicationTemplate(data.name),

  interview: (data) => interviewTemplate(data),
  interview_scheduled: (data) => interviewTemplate(data),

  selection: (data) => selectionTemplate(data.name),

  rejection: (data) => rejectionTemplate(data.name),

  offer: (data) => offerLetterTemplate(data),
  offer_letter: (data) => offerLetterTemplate(data),

  onboarding: (data) => onboardingReminderTemplate(data),
  onboarding_reminder: (data) => onboardingReminderTemplate(data)
};

const subjects = {
  application: 'Application Received — InnerWhispers Wellness LLP',
  application_received: 'Application Received — InnerWhispers Wellness LLP',
  interview: 'Interview Scheduled — InnerWhispers Wellness LLP',
  interview_scheduled: 'Interview Scheduled — InnerWhispers Wellness LLP',
  selection: 'Selection Update — InnerWhispers Wellness LLP',
  rejection: 'Application Update — InnerWhispers Wellness LLP',
  offer: 'Offer Letter — InnerWhispers Wellness LLP',
  offer_letter: 'Offer Letter — InnerWhispers Wellness LLP',
  onboarding: 'Onboarding Reminder — InnerWhispers Wellness LLP',
  onboarding_reminder: 'Onboarding Reminder — InnerWhispers Wellness LLP'
};

const emailTypeKeys = {
  application: 'application_received',
  application_received: 'application_received',
  interview: 'interview_scheduled',
  interview_scheduled: 'interview_scheduled',
  selection: 'selection',
  rejection: 'rejection',
  offer: 'offer_letter',
  offer_letter: 'offer_letter',
  onboarding: 'onboarding_reminder',
  onboarding_reminder: 'onboarding_reminder'
};

const renderTemplate = (emailType, data) => {
  const key = String(emailType || 'application').toLowerCase().trim();
  const templateFn = templates[key];

  if (!templateFn) {
    throw new Error(
      `Invalid emailType "${emailType}". Use: application, interview, selection, rejection, offer, onboarding`
    );
  }

  return {
    emailType: emailTypeKeys[key],
    subject: subjects[key],
    html: templateFn(data)
  };
};

module.exports = { templates, subjects, renderTemplate };
