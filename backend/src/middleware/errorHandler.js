/**
 * Global Error Handler Middleware
 * Catches all unhandled errors and returns consistent error responses
 */
const env = require('../config/env');
const { errorResponse } = require('../utils/helpers');

function errorHandler(err, req, res, next) {
  // Log error in development
  if (!env.isProduction) {
    console.error('🔴 Error:', err.message);
    console.error(err.stack);
  }

  // MySQL duplicate entry error
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json(errorResponse('Duplicate entry. This record already exists.'));
  }

  // MySQL connection error
  if (err.code === 'ECONNREFUSED') {
    return res.status(503).json(errorResponse('Database connection failed. Please try again later.'));
  }

  // Validation errors from express-validator
  if (err.type === 'validation') {
    return res.status(400).json(errorResponse('Validation failed', err.errors));
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json(errorResponse('Invalid authentication token.'));
  }

  // Default server error
  const statusCode = err.statusCode || 500;
  const message = env.isProduction
    ? 'Internal server error'
    : err.message || 'Internal server error';

  res.status(statusCode).json(errorResponse(message));
}

module.exports = errorHandler;
