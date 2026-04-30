/**
 * Input Validation Middleware
 * Uses express-validator for request validation
 */
const { body, param, validationResult } = require('express-validator');
const { errorResponse } = require('../utils/helpers');

/**
 * Middleware to check validation results and return errors
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((e) => ({
      field: e.path,
      message: e.msg,
    }));
    return res.status(400).json(errorResponse('Validation failed', formattedErrors));
  }
  next();
}

/**
 * Validation rules for user registration
 */
const registerRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

/**
 * Validation rules for login
 */
const loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  body('password')
    .notEmpty().withMessage('Password is required'),
];

/**
 * Validation rules for health profile submission
 */
const profileRules = [
  body('age')
    .notEmpty().withMessage('Age is required'),
  body('gender')
    .notEmpty().withMessage('Gender is required'),
  body('weight')
    .notEmpty().withMessage('Weight is required'),
  body('height')
    .notEmpty().withMessage('Height is required'),
  body('diseases')
    .optional(),
  body('allergies')
    .optional(),
  body('lifestyle')
    .notEmpty().withMessage('Lifestyle is required'),
  body('dietPreference')
    .notEmpty().withMessage('Diet preference is required'),
  body('medicalHistory')
    .optional(),
];

/**
 * Validate profile ID parameter
 */
const profileIdParam = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid profile ID'),
];

module.exports = {
  handleValidationErrors,
  registerRules,
  loginRules,
  profileRules,
  profileIdParam,
};
