const express = require('express');

const {
  sendApplicationMail,
  sendInterviewMail,
  sendSelectionMail,
  sendRejectionMail,
  sendOfferLetterMail,
  sendOnboardingReminderMail,
  sendBulkEmails,
  sendUniversalEmail,
  healthCheck,
  verifyConnection
} = require('../controllers/emailController');

const { getEmailLogs, searchLogs, getStats, getEmailStatus } = require('../controllers/logController');

const {
  validateApplication,
  validateInterview,
  validateSelection,
  validateRejection,
  validateOfferLetter,
  validateOnboardingReminder,
  validateBulkSend,
  validateUniversalSend
} = require('../middleware/emailValidation');
const normalizeSendBody = require('../middleware/normalizeSendBody');

const router = express.Router();

router.get('/health', healthCheck);
router.get('/verify', verifyConnection);

router.get('/stats', getStats);
router.get('/logs/search', searchLogs);
router.get('/logs', getEmailLogs);
router.get('/status/:id', getEmailStatus);

router.post('/send', validateUniversalSend, normalizeSendBody, sendUniversalEmail);

router.post('/send-application', validateApplication, sendApplicationMail);
router.post('/send-interview', validateInterview, sendInterviewMail);
router.post('/send-selection', validateSelection, sendSelectionMail);
router.post('/send-rejection', validateRejection, sendRejectionMail);
router.post('/send-offer', validateOfferLetter, sendOfferLetterMail);
router.post('/send-onboarding', validateOnboardingReminder, sendOnboardingReminderMail);
router.post('/bulk-send', validateBulkSend, sendBulkEmails);

module.exports = router;
