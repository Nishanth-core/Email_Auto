require('dotenv').config();

const app = require('./src/app');
const { validateEnv } = require('./src/utils/validateEnv');
const { verifySmtp } = require('./src/config/smtp');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 5000;

const envErrors = validateEnv();
if (envErrors.length > 0) {
  logger.warn('Environment not ready for Gmail', { errors: envErrors });
  console.log('\n⚠️  Update .env before sending email:');
  envErrors.forEach((e) => console.log(`   - ${e}`));
  console.log('   Guide: https://support.google.com/accounts/answer/185833\n');
}

const startServer = async () => {
  if (envErrors.length === 0) {
    try {
      await verifySmtp();
      logger.info('SMTP connection verified');
      console.log('✓ Gmail SMTP credentials verified\n');
    } catch (error) {
      logger.error('SMTP verify failed on startup', { message: error.message });
      console.log('⚠️  Server starting, but Gmail SMTP failed verification.');
      console.log(`   ${error.message}\n`);
    }
  }

  const server = app.listen(PORT);

  server.on('listening', () => {
    console.log(`Server running on port ${PORT}\n`);
    console.log('  Root health:  GET  http://localhost:' + PORT + '/health');
    console.log('  API health:   GET  http://localhost:' + PORT + '/api/email/health');
    console.log('  Verify SMTP:  GET  http://localhost:' + PORT + '/api/email/verify\n');
    console.log('  Universal (POST): /api/emails/send  (frontend integration)');
    console.log('  Send (POST): /api/email/send-application | send-interview | send-selection');
    console.log('              /api/email/send-rejection | send-offer | send-onboarding | bulk-send');
    console.log('  Dashboard (GET): /api/email/stats | /api/email/logs?page=1&limit=20');
    console.log('                   /api/email/logs/search?q=name | /api/email/status/:id\n');
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(
        `\n✗ Port ${PORT} is already in use. Stop the other terminal (Ctrl+C) or set PORT=5001 in .env\n`
      );
    } else {
      console.error('\n✗ Server failed to start:', err.message, '\n');
    }
    process.exit(1);
  });
};

startServer();
