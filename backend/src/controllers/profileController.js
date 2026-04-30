/**
 * Profile Controller
 * Handles health profile CRUD operations
 */
const ProfileService = require('../services/profileService');
const { successResponse, errorResponse } = require('../utils/helpers');

const ProfileController = {
  /**
   * POST /api/profiles
   * Submit health data and receive recommendations
   */
  async create(req, res, next) {
    try {
      const userId = req.user.id;
      const result = await ProfileService.createProfile(userId, req.body);

      res.status(201).json(successResponse(result, 'Health profile created and recommendations generated'));
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/profiles/:id
   * Get a specific profile with all recommendations
   */
  async getById(req, res, next) {
    try {
      const profileId = parseInt(req.params.id, 10);
      const result = await ProfileService.getProfileWithRecommendations(profileId);

      if (!result) {
        return res.status(404).json(errorResponse('Health profile not found'));
      }

      res.json(successResponse(result));
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/profiles/user/me
   * Get all profiles for the authenticated user
   */
  async getMyProfiles(req, res, next) {
    try {
      const profiles = await ProfileService.getUserProfiles(req.user.id);
      res.json(successResponse(profiles, `Found ${profiles.length} profiles`));
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/profiles/:id
   * Delete a health profile (and its recommendations via cascade)
   */
  async delete(req, res, next) {
    try {
      const profileId = parseInt(req.params.id, 10);
      const deleted = await ProfileService.deleteProfile(profileId, req.user.id);

      if (!deleted) {
        return res.status(404).json(errorResponse('Profile not found or not authorized'));
      }

      res.json(successResponse(null, 'Profile deleted successfully'));
    } catch (error) {
      next(error);
    }
  },
};

module.exports = ProfileController;
