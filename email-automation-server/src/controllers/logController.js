const {
  getEmailStats,
  getEmailLogsPaginated,
  searchEmailLogs,
  getEmailLogById
} = require('../services/logService');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const getEmailLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    const { logs, pagination } = await getEmailLogsPaginated({ page, limit });

    sendSuccess(res, {
      message: 'Email logs fetched',
      data: { logs, pagination }
    });
  } catch (error) {
    if (error.statusCode === 503) {
      return sendError(res, { statusCode: 503, message: error.message });
    }
    next(error);
  }
};

const searchLogs = async (req, res, next) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    if (!q || !String(q).trim()) {
      return sendError(res, {
        statusCode: 400,
        message: 'Search query "q" is required'
      });
    }

    const { logs, query, pagination } = await searchEmailLogs(q, { page, limit });

    sendSuccess(res, {
      message: 'Search results fetched',
      data: { query, logs, pagination }
    });
  } catch (error) {
    if (error.statusCode === 503) {
      return sendError(res, { statusCode: 503, message: error.message });
    }
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const stats = await getEmailStats();

    sendSuccess(res, {
      message: 'Email statistics fetched',
      data: stats
    });
  } catch (error) {
    if (error.statusCode === 503) {
      return sendError(res, { statusCode: 503, message: error.message });
    }
    next(error);
  }
};

const getEmailStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await getEmailLogById(id);

    sendSuccess(res, {
      message: 'Email status fetched',
      data: {
        status: data.status,
        log: data
      }
    });
  } catch (error) {
    if (error.code === 'PGRST116') {
      return sendError(res, { statusCode: 404, message: 'Email log not found' });
    }
    if (error.statusCode === 503) {
      return sendError(res, { statusCode: 503, message: error.message });
    }
    next(error);
  }
};

module.exports = { getEmailLogs, searchLogs, getStats, getEmailStatus };
