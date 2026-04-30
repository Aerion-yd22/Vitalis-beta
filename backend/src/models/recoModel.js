/**
 * Recommendation Model
 * Database queries for storing and retrieving recommendations
 */
const { pool } = require('../config/database');

const RecoModel = {
  /**
   * Bulk insert recommendations for a profile
   * @param {number} profileId
   * @param {Array<Object>} recommendations - [{category, recommendation, priority}]
   * @returns {number} Number of inserted recommendations
   */
  async bulkCreate(profileId, recommendations) {
    if (recommendations.length === 0) return 0;

    const values = recommendations.map((r) => [
      profileId,
      r.category,
      r.recommendation,
      r.priority,
    ]);

    const [result] = await pool.query(
      'INSERT INTO recommendations (profile_id, category, recommendation, priority) VALUES ?',
      [values]
    );

    return result.affectedRows;
  },

  /**
   * Get all recommendations for a profile
   * @param {number} profileId
   * @returns {Array} Recommendations sorted by priority
   */
  async findByProfileId(profileId) {
    const priorityOrder = "FIELD(priority, 'critical', 'high', 'medium', 'low')";
    const [rows] = await pool.query(
      `SELECT id, category, recommendation, priority, created_at 
       FROM recommendations 
       WHERE profile_id = ? 
       ORDER BY ${priorityOrder}, category`,
      [profileId]
    );
    return rows;
  },

  /**
   * Get recommendations filtered by category
   * @param {number} profileId
   * @param {string} category - 'diet', 'exercise', 'precaution', 'lifestyle'
   * @returns {Array}
   */
  async findByCategory(profileId, category) {
    const [rows] = await pool.query(
      `SELECT id, category, recommendation, priority, created_at 
       FROM recommendations 
       WHERE profile_id = ? AND category = ?
       ORDER BY FIELD(priority, 'critical', 'high', 'medium', 'low')`,
      [profileId, category]
    );
    return rows;
  },

  /**
   * Delete all recommendations for a profile (used on re-assessment)
   * @param {number} profileId
   * @returns {number} Deleted count
   */
  async deleteByProfileId(profileId) {
    const [result] = await pool.query(
      'DELETE FROM recommendations WHERE profile_id = ?',
      [profileId]
    );
    return result.affectedRows;
  },
};

module.exports = RecoModel;
