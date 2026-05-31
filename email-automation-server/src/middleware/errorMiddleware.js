const logger = require('../utils/logger');
const { sendError } = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled error', {
    message: err.message,
    path: req.path,
    method: req.method
  });

  const statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;

  sendError(res, {
    statusCode,
    message: err.message || 'Something went wrong'
  });
};

module.exports = errorHandler;
