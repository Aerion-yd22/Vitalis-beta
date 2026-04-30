/**
 * User Model
 * Database queries for user authentication and management
 */
const { pool } = require('../config/database');

const UserModel = {
  /**
   * Create a new user
   * @param {string} name
   * @param {string} email
   * @param {string} passwordHash - Already hashed password
   * @returns {Object} Created user (without password)
   */
  async create(name, email, passwordHash) {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, passwordHash]
    );
    return { id: result.insertId, name, email };
  },

  /**
   * Find user by email (includes password hash for auth)
   * @param {string} email
   * @returns {Object|null} User object or null
   */
  async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT id, name, email, password_hash, created_at FROM users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  },

  /**
   * Find user by ID (excludes password hash)
   * @param {number} id
   * @returns {Object|null} User object or null
   */
  async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Check if email already exists
   * @param {string} email
   * @returns {boolean}
   */
  async emailExists(email) {
    const [rows] = await pool.query(
      'SELECT COUNT(*) as count FROM users WHERE email = ?',
      [email]
    );
    return rows[0].count > 0;
  },
};

module.exports = UserModel;
