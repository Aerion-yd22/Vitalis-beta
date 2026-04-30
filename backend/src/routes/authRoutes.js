/**
 * Auth Routes
 */
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

// POST /api/auth/register — Create new account
router.post('/register', AuthController.register);

// POST /api/auth/login — Login and get JWT
router.post('/login', AuthController.login);

// GET /api/auth/me — Get authenticated user info
router.get('/me', authMiddleware, AuthController.getMe);

module.exports = router;
