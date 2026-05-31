const sendEmail = require('./emailService');
const logger = require('../utils/logger');

const DEFAULT_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

const sendWithRetry = async (emailData, retries = DEFAULT_RETRIES) => {
  let lastError;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const result = await sendEmail(emailData);
      return { result, attempts: attempt + 1 };
    } catch (error) {
      lastError = error;
      logger.warn('Email retry attempt failed', {
        attempt: attempt + 1,
        maxRetries: retries,
        message: error.message
      });

      if (attempt === retries - 1) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS * (attempt + 1)));
    }
  }

  throw lastError;
};

module.exports = sendWithRetry;
