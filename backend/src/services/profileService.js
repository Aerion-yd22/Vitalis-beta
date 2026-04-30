/**
 * Profile Service
 * Business logic for health profile management
 * Orchestrates BMI calculation, recommendation generation, and data persistence
 */
const ProfileModel = require('../models/profileModel');
const RecoModel = require('../models/recoModel');
const BmiService = require('./bmiService');
const RecoEngine = require('./recoEngine');

const ProfileService = {
  /**
   * Process a new health profile submission
   * 1. Calculate BMI
   * 2. Generate recommendations
   * 3. Save profile + recommendations to database
   * 
   * @param {number} userId - Authenticated user ID
   * @param {Object} data - Raw form data
   * @returns {Object} { profile, recommendations }
   */
  async createProfile(userId, data) {
    // Step 1: Calculate BMI
    const bmiResult = BmiService.analyze(data.weight, data.height);

    // Step 2: Prepare profile data
    const profileData = {
      userId,
      age: data.age,
      gender: data.gender,
      weightKg: data.weight,
      heightCm: data.height,
      bmi: bmiResult.bmi,
      bmiCategory: bmiResult.category,
      lifestyle: data.lifestyle,
      dietPreference: data.dietPreference,
      medicalHistory: data.medicalHistory || null,
    };

    // Step 3: Save profile with diseases and allergies
    const profile = await ProfileModel.create(
      profileData,
      data.diseases || [],
      data.allergies || []
    );

    // Step 4: Generate recommendations using the engine
    const engineInput = {
      ...profileData,
      diseases: data.diseases || [],
      allergies: data.allergies || [],
      riskLevel: bmiResult.risk,
    };
    const recommendations = RecoEngine.generate(engineInput);

    // Step 5: Save recommendations to database
    await RecoModel.bulkCreate(profile.id, recommendations);

    // Step 6: Return complete result
    return {
      profile: {
        id: profile.id,
        age: profileData.age,
        gender: profileData.gender,
        weight: profileData.weightKg,
        height: profileData.heightCm,
        bmi: bmiResult.bmi,
        bmiCategory: bmiResult.category,
        riskLevel: bmiResult.risk,
        lifestyle: profileData.lifestyle,
        dietPreference: profileData.dietPreference,
        diseases: data.diseases || [],
        allergies: data.allergies || [],
        medicalHistory: profileData.medicalHistory,
      },
      recommendations,
    };
  },

  /**
   * Get full profile details with recommendations
   * @param {number} profileId
   * @returns {Object|null}
   */
  async getProfileWithRecommendations(profileId) {
    const profile = await ProfileModel.findById(profileId);
    if (!profile) return null;

    const recommendations = await RecoModel.findByProfileId(profileId);

    return {
      profile: {
        id: profile.id,
        age: profile.age,
        gender: profile.gender,
        weight: profile.weight_kg,
        height: profile.height_cm,
        bmi: parseFloat(profile.bmi),
        bmiCategory: profile.bmi_category,
        riskLevel: BmiService.classify(parseFloat(profile.bmi)).risk,
        lifestyle: profile.lifestyle,
        dietPreference: profile.diet_preference,
        diseases: profile.diseases,
        allergies: profile.allergies,
        medicalHistory: profile.medical_history,
        createdAt: profile.created_at,
      },
      recommendations,
    };
  },

  /**
   * Get all profiles for a user (summary view)
   * @param {number} userId
   * @returns {Array}
   */
  async getUserProfiles(userId) {
    return ProfileModel.findByUserId(userId);
  },

  /**
   * Delete a profile
   * @param {number} profileId
   * @param {number} userId
   * @returns {boolean}
   */
  async deleteProfile(profileId, userId) {
    return ProfileModel.delete(profileId, userId);
  },
};

module.exports = ProfileService;
