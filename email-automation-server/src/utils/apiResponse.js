const sendSuccess = (res, { statusCode = 200, message, data = {} }) => {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const sendError = (res, { statusCode = 500, message, data = {} }) => {
  res.status(statusCode).json({
    success: false,
    message,
    ...(Object.keys(data).length > 0 && { data })
  });
};

module.exports = { sendSuccess, sendError };
