/**
 * Health Profile Model
 * Database queries for health profiles, diseases, and allergies
 */
const { pool } = require('../config/database');

const ProfileModel = {
  /**
   * Create a new health profile with diseases and allergies (transactional)
   * @param {Object} profileData - Profile fields
   * @param {Array<string>} diseases - List of disease names
   * @param {Array<string>} allergies - List of allergy names
   * @returns {Object} Created profile with ID
   */
  async create(profileData, diseases = [], allergies = []) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Insert health profile
      const [profileResult] = await connection.query(
        `INSERT INTO health_profiles 
         (user_id, age, gender, weight_kg, height_cm, bmi, bmi_category, lifestyle, diet_preference, medical_history) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          profileData.userId,
          profileData.age,
          profileData.gender,
          profileData.weightKg,
          profileData.heightCm,
          profileData.bmi,
          profileData.bmiCategory,
          profileData.lifestyle,
          profileData.dietPreference,
          profileData.medicalHistory || null,
        ]
      );

      const profileId = profileResult.insertId;

      // Insert diseases (batch insert)
      if (diseases.length > 0) {
        const diseaseValues = diseases.map((d) => [profileId, d.toLowerCase().trim()]);
        await connection.query(
          'INSERT INTO profile_diseases (profile_id, disease_name) VALUES ?',
          [diseaseValues]
        );
      }

      // Insert allergies (batch insert)
      if (allergies.length > 0) {
        const allergyValues = allergies.map((a) => [profileId, a.toLowerCase().trim()]);
        await connection.query(
          'INSERT INTO profile_allergies (profile_id, allergy_name) VALUES ?',
          [allergyValues]
        );
      }

      await connection.commit();
      return { id: profileId, ...profileData };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  /**
   * Get a full profile by ID (with diseases and allergies)
   * @param {number} profileId
   * @returns {Object|null} Full profile object
   */
  async findById(profileId) {
    const [profiles] = await pool.query(
      'SELECT * FROM health_profiles WHERE id = ?',
      [profileId]
    );

    if (profiles.length === 0) return null;

    const profile = profiles[0];

    // Fetch associated diseases
    const [diseases] = await pool.query(
      'SELECT disease_name FROM profile_diseases WHERE profile_id = ?',
      [profileId]
    );

    // Fetch associated allergies
    const [allergies] = await pool.query(
      'SELECT allergy_name FROM profile_allergies WHERE profile_id = ?',
      [profileId]
    );

    return {
      ...profile,
      diseases: diseases.map((d) => d.disease_name),
      allergies: allergies.map((a) => a.allergy_name),
    };
  },

  /**
   * Get all profiles for a specific user
   * @param {number} userId
   * @returns {Array} List of profiles (summary view)
   */
  async findByUserId(userId) {
    const [profiles] = await pool.query(
      `SELECT id, age, gender, weight_kg, height_cm, bmi, bmi_category, 
              lifestyle, diet_preference, created_at
       FROM health_profiles 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [userId]
    );
    return profiles;
  },

  /**
   * Delete a profile and all associated data (cascade)
   * @param {number} profileId
   * @param {number} userId - For ownership verification
   * @returns {boolean} True if deleted
   */
  async delete(profileId, userId) {
    const [result] = await pool.query(
      'DELETE FROM health_profiles WHERE id = ? AND user_id = ?',
      [profileId, userId]
    );
    return result.affectedRows > 0;
  },
};

module.exports = ProfileModel;
