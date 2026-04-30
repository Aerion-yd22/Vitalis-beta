/**
 * Recommendation Controller
 * Handles recommendation retrieval endpoints
 */
const RecoModel = require('../models/recoModel');
const { successResponse, errorResponse } = require('../utils/helpers');

const RecoController = {
  /**
   * GET /api/recommendations/:profileId
   * Get all recommendations for a profile
   */
  async getByProfile(req, res, next) {
    try {
      const profileId = parseInt(req.params.profileId, 10);
      const recommendations = await RecoModel.findByProfileId(profileId);

      if (recommendations.length === 0) {
        return res.status(404).json(errorResponse('No recommendations found for this profile'));
      }

      // Group by category for easier frontend consumption
      const grouped = {
        diet: recommendations.filter((r) => r.category === 'diet'),
        exercise: recommendations.filter((r) => r.category === 'exercise'),
        precaution: recommendations.filter((r) => r.category === 'precaution'),
        lifestyle: recommendations.filter((r) => r.category === 'lifestyle'),
      };

      res.json(successResponse({
        total: recommendations.length,
        grouped,
        all: recommendations,
      }));
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/recommendations/:profileId/category/:category
   * Get recommendations filtered by category
   */
  async getByCategory(req, res, next) {
    try {
      const { profileId, category } = req.params;
      const validCategories = ['diet', 'exercise', 'precaution', 'lifestyle'];

      if (!validCategories.includes(category)) {
        return res.status(400).json(
          errorResponse(`Invalid category. Must be one of: ${validCategories.join(', ')}`)
        );
      }

      const recommendations = await RecoModel.findByCategory(
        parseInt(profileId, 10),
        category
      );

      res.json(successResponse(recommendations));
    } catch (error) {
      next(error);
    }
  },
};

module.exports = RecoController;
