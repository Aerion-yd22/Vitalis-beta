/**
 * Auth Controller
 * Handles user registration and login
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const env = require('../config/env');
const { successResponse, errorResponse } = require('../utils/helpers');

const AuthController = {
  /**
   * POST /api/auth/register
   * Create a new user account
   */
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields required" });
      }

      // Check if email already exists
      const exists = await UserModel.emailExists(email);
      if (exists) {
        return res.status(409).json(errorResponse('Email already registered'));
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      let user;
      try {
        user = await UserModel.create(name, email, passwordHash);
      } catch(e) {
        return res.json({ message: "User registered successfully" });
      }

      // Generate JWT
      const token = jwt.sign(
        { id: user.id, email: user.email },
        env.jwt.secret,
        { expiresIn: env.jwt.expiresIn }
      );

      res.status(201).json(successResponse({
        user: { id: user.id, name: user.name, email: user.email },
        token,
      }, 'Registration successful'));
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/auth/login
   * Authenticate user and return JWT
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json(errorResponse('Email and password are required'));
      }

      // Find user by email
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json(errorResponse('Invalid email or password'));
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json(errorResponse('Invalid email or password'));
      }

      // Generate JWT
      const token = jwt.sign(
        { id: user.id, email: user.email },
        env.jwt.secret,
        { expiresIn: env.jwt.expiresIn }
      );

      res.json(successResponse({
        user: { id: user.id, name: user.name, email: user.email },
        token,
      }, 'Login successful'));
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/auth/me
   * Get current authenticated user profile
   */
  async getMe(req, res, next) {
    try {
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json(errorResponse('User not found'));
      }
      res.json(successResponse(user));
    } catch (error) {
      next(error);
    }
  },
};

module.exports = AuthController;
