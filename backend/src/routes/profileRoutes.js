/**
 * Profile Routes
 */
const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers/profileController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { profileRules, profileIdParam, handleValidationErrors } = require('../middleware/validator');

// All profile routes require authentication
router.use(authMiddleware);

// POST /api/profiles — Submit health data and get recommendations
router.post('/', profileRules, handleValidationErrors, ProfileController.create);

// GET /api/profiles/user/me — Get all my profiles (must be before /:id)
router.get('/user/me', ProfileController.getMyProfiles);

// GET /api/profiles/:id — Get specific profile with recommendations
router.get('/:id', profileIdParam, handleValidationErrors, ProfileController.getById);

// DELETE /api/profiles/:id — Delete a profile
router.delete('/:id', profileIdParam, handleValidationErrors, ProfileController.delete);

module.exports = router;
