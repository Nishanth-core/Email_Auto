const { body, validationResult } = require('express-validator');

const runValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg }))
    });
  }

  next();
};

const validateApplication = [
  body('email').trim().isEmail().withMessage('Valid email required'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  runValidation
];

const validateInterview = [
  body('email').trim().isEmail().withMessage('Valid email required'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('date').trim().notEmpty().withMessage('Interview date is required'),
  body('time').trim().notEmpty().withMessage('Interview time is required'),
  body('location').optional().trim().isLength({ max: 300 }),
  body('meetingLink')
    .optional({ values: 'falsy' })
    .trim()
    .isURL()
    .withMessage('Meeting link must be a valid URL'),
  runValidation
];

const validateSelection = [
  body('email').trim().isEmail().withMessage('Valid email required'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  runValidation
];

const validateRejection = [
  body('email').trim().isEmail().withMessage('Valid email required'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  runValidation
];

const validateOfferLetter = [
  body('email').trim().isEmail().withMessage('Valid email required'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('role').trim().notEmpty().withMessage('Role is required'),
  body('startDate').trim().notEmpty().withMessage('Start date is required'),
  runValidation
];

const validateOnboardingReminder = [
  body('email').trim().isEmail().withMessage('Valid email required'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('dueDate').trim().notEmpty().withMessage('Due date is required'),
  body('checklistLink')
    .optional({ values: 'falsy' })
    .trim()
    .isURL()
    .withMessage('Checklist link must be a valid URL'),
  runValidation
];

const validateBulkSend = [
  body('emailType')
    .optional()
    .trim()
    .isIn([
      'application',
      'application_received',
      'interview',
      'interview_scheduled',
      'selection',
      'rejection',
      'offer',
      'offer_letter',
      'onboarding',
      'onboarding_reminder'
    ])
    .withMessage('Invalid emailType for bulk send'),
  body('users').isArray({ min: 1, max: 100 }).withMessage('users must be an array (1-100 recipients)'),
  body('users.*.name').trim().notEmpty().withMessage('Each user must have a name'),
  body('users.*.email').trim().isEmail().withMessage('Each user must have a valid email'),
  runValidation
];

const validateUniversalSend = [
  body('emailType').trim().notEmpty().withMessage('emailType is required'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email required'),
  body('dynamicData').optional().isObject().withMessage('dynamicData must be an object'),
  runValidation
];

module.exports = {
  validateApplication,
  validateInterview,
  validateSelection,
  validateRejection,
  validateOfferLetter,
  validateOnboardingReminder,
  validateBulkSend,
  validateUniversalSend
};
