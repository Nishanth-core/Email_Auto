const sendWithRetry = require('../services/emailRetryService');
const { verifySmtp } = require('../config/smtp');
const { saveEmailLog, updateEmailLog } = require('../services/logService');
const { buildEmailForUser } = require('../utils/emailBuilder');
const { renderTemplate } = require('../templates/templateManager');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const logger = require('../utils/logger');

const handleSmtpError = (error, res, next) => {
  logger.error('Email send failed', { message: error.message });

  if (error.statusCode === 503 || error.message?.includes('not configured')) {
    return sendError(res, {
      statusCode: 503,
      message:
        'Email is not configured yet. Add credentials via environment variables (.env is gitignored) and restart the server.',
      data: { detail: error.message }
    });
  }

  if (error.message?.includes('Invalid login') || error.message?.includes('535')) {
    return sendError(res, {
      statusCode: 401,
      message:
        'Gmail rejected login. Use a Gmail App Password in EMAIL_PASS (with 2-Step Verification enabled), not your normal Gmail password.',
      data: { detail: error.message }
    });
  }

  next(error);
};

const processEmailSend = async ({ name, email, subject, html, emailType }) => {
  let logId = null;

  try {
    const pending = await saveEmailLog({
      intern_name: name,
      email,
      email_type: emailType,
      status: 'Pending',
      error_message: null,
      retry_count: 0
    });

    if (pending.saved && pending.log?.id) {
      logId = pending.log.id;
    }

    const { result, attempts } = await sendWithRetry({
      to: email,
      subject,
      html
    });

    const retryCount = Math.max(0, attempts - 1);

    if (logId) {
      await updateEmailLog(logId, {
        status: 'Sent',
        error_message: null,
        retry_count: retryCount
      });
    } else {
      await saveEmailLog({
        intern_name: name,
        email,
        email_type: emailType,
        status: 'Sent',
        error_message: null,
        retry_count: retryCount
      });
    }

    return { result, logId, attempts, retryCount };
  } catch (error) {
    if (logId) {
      try {
        await updateEmailLog(logId, {
          status: 'Failed',
          error_message: error.message,
          retry_count: 3
        });
      } catch (logError) {
        logger.error('Failed to update email log', { message: logError.message });
      }
    } else {
      try {
        await saveEmailLog({
          intern_name: name,
          email,
          email_type: emailType,
          status: 'Failed',
          error_message: error.message,
          retry_count: 3
        });
      } catch (logError) {
        logger.error('Failed to save email log (failed)', { message: logError.message });
      }
    }

    throw error;
  }
};

const sendHtmlEmail = async (req, res, next, { subject, html, successMessage, emailType }) => {
  const { name, email } = req.body;

  try {
    const { result, logId } = await processEmailSend({
      name,
      email,
      subject,
      html,
      emailType
    });

    logger.info('HR email sent', { emailType, to: email, subject, logId });

    sendSuccess(res, {
      message: successMessage,
      data: { emailType, logId, result }
    });
  } catch (error) {
    handleSmtpError(error, res, next);
  }
};

const sendBulkEmails = async (req, res, next) => {
  const { users, emailType = 'application' } = req.body;

  const results = [];
  let sent = 0;
  let failed = 0;

  for (const user of users) {
    const name = user.name;
    const email = user.email;

    try {
      const { subject, html, emailType: resolvedType } = buildEmailForUser(emailType, user);

      const { result, logId } = await processEmailSend({
        name,
        email,
        subject,
        html,
        emailType: `Bulk ${resolvedType}`
      });

      sent += 1;
      results.push({
        name,
        email,
        success: true,
        logId,
        messageId: result?.messageId
      });
    } catch (error) {
      failed += 1;
      results.push({
        name,
        email,
        success: false,
        error: error.message
      });
    }
  }

  const allFailed = sent === 0 && failed > 0;

  if (allFailed) {
    return sendError(res, {
      statusCode: 500,
      message: 'Bulk email send failed for all recipients',
      data: {
        summary: { total: users.length, sent, failed, pending: 0 },
        results
      }
    });
  }

  sendSuccess(res, {
    message: 'Bulk emails processed',
    data: {
      summary: { total: users.length, sent, failed, pending: 0 },
      results
    }
  });
};

const sendFromTemplate = (templateKey, successMessage) => (req, res, next) => {
  const { subject, html, emailType } = renderTemplate(templateKey, req.body);
  return sendHtmlEmail(req, res, next, { subject, html, successMessage, emailType });
};

const sendApplicationMail = sendFromTemplate('application', 'Application email sent');
const sendInterviewMail = sendFromTemplate('interview', 'Interview email sent');
const sendSelectionMail = sendFromTemplate('selection', 'Selection email sent');
const sendRejectionMail = sendFromTemplate('rejection', 'Rejection email sent');
const sendOfferLetterMail = sendFromTemplate('offer', 'Offer letter email sent');
const sendOnboardingReminderMail = sendFromTemplate('onboarding', 'Onboarding reminder email sent');

const sendUniversalEmail = async (req, res, next) => {
  const { emailType } = req.body;
  const type = String(emailType || '').toLowerCase().trim();

  switch (type) {
    case 'application_received':
    case 'application':
      return sendApplicationMail(req, res, next);

    case 'interview':
    case 'interview_scheduled':
      return sendInterviewMail(req, res, next);

    case 'selection':
      return sendSelectionMail(req, res, next);

    case 'rejection':
      return sendRejectionMail(req, res, next);

    case 'offer_letter':
    case 'offer':
      return sendOfferLetterMail(req, res, next);

    case 'onboarding_reminder':
    case 'onboarding':
      return sendOnboardingReminderMail(req, res, next);

    default:
      return sendError(res, {
        statusCode: 400,
        message: 'Invalid email type',
        data: {
          emailType,
          allowed: [
            'application_received',
            'interview',
            'selection',
            'rejection',
            'offer_letter',
            'onboarding_reminder'
          ]
        }
      });
  }
};

const healthCheck = (req, res) => {
  sendSuccess(res, {
    message: 'Email automation API is running',
    data: { status: 'ok', timestamp: new Date().toISOString() }
  });
};

const verifyConnection = async (req, res) => {
  try {
    await verifySmtp();

    sendSuccess(res, {
      message: 'SMTP connection verified successfully',
      data: { verified: true }
    });
  } catch (error) {
    logger.error('SMTP verify failed', { message: error.message });

    const isAuth =
      error.message?.includes('Invalid login') || error.message?.includes('535');

    sendError(res, {
      statusCode: isAuth ? 401 : 503,
      message: isAuth
        ? 'Gmail credentials invalid. Update EMAIL_USER and EMAIL_PASS (App Password) in .env, then restart the server.'
        : 'SMTP connection failed',
      data: { detail: error.message }
    });
  }
};

module.exports = {
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
};
