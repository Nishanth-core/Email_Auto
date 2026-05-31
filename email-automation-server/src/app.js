const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const emailRoutes = require('./routes/emailRoutes');
const errorHandler = require('./middleware/errorMiddleware');
const apiLimiter = require('./middleware/rateLimiter');

const app = express();

const corsOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((o) => o.trim())
  : true;

app.use(
  cors({
    origin: corsOrigins,
    credentials: true
  })
);
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    message: 'Server running'
  });
});

app.use('/api/email', apiLimiter, emailRoutes);
app.use('/api/emails', apiLimiter, emailRoutes);

app.use(errorHandler);

module.exports = app;
