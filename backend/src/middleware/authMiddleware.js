/**
 * JWT Authentication Middleware
 * Verifies Bearer token and attaches user to request
 */
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { errorResponse } = require('../utils/helpers');

/**
 * Middleware to protect routes — requires valid JWT
 */
function authMiddleware(req, res, next) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(errorResponse('Access denied. No token provided.'));
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, env.jwt.secret);
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json(errorResponse('Token expired. Please login again.'));
    }
    return res.status(401).json(errorResponse('Invalid token.'));
  }
}

/**
 * Optional auth — attaches user if token present, continues if not
 */
function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, env.jwt.secret);
      req.user = { id: decoded.id, email: decoded.email };
    }
  } catch {
    // Token invalid — continue without user
  }
  next();
}

module.exports = { authMiddleware, optionalAuth };
