const PLACEHOLDER_USER = 'your_email@gmail.com';
const PLACEHOLDER_PASS = 'your_app_password';

const validateEnv = () => {
  const { EMAIL_USER, EMAIL_PASS } = process.env;
  const errors = [];

  if (!EMAIL_USER || EMAIL_USER === PLACEHOLDER_USER) {
    errors.push(
      'EMAIL_USER is missing or still a placeholder. Set your Gmail address in .env'
    );
  }

  if (!EMAIL_PASS || EMAIL_PASS === PLACEHOLDER_PASS) {
    errors.push(
      'EMAIL_PASS is missing or still a placeholder. Use a Gmail App Password (not your normal password)'
    );
  }

  return errors;
};

const isEmailConfigured = () => validateEnv().length === 0;

module.exports = { validateEnv, isEmailConfigured, PLACEHOLDER_USER, PLACEHOLDER_PASS };
