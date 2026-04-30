/**
 * MySQL Database Connection Pool
 * Uses mysql2 with promise-based API for async/await support
 */
const mysql = require('mysql2/promise');
const env = require('./env');

// Create connection pool for better performance
const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.name,
  waitForConnections: true,
  connectionLimit: 10,       // Max simultaneous connections
  queueLimit: 0,             // Unlimited queue
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

/**
 * Test database connection
 * Called on server startup to verify connectivity
 */
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('  ✅ MySQL connected successfully');
    console.log(`  📦 Database: ${env.db.name} @ ${env.db.host}:${env.db.port}`);
    connection.release();
    return true;
  } catch (error) {
    console.error('  ❌ MySQL connection failed:', error.message);
    console.error('  💡 Make sure MySQL is running and credentials are correct in .env');
    return false;
  }
}

/**
 * Initialize database tables
 * Creates tables if they don't exist (for first-time setup)
 */
async function initializeDatabase() {
  const connection = await pool.getConnection();
  try {
    // Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${env.db.name}`);
    await connection.query(`USE ${env.db.name}`);

    // Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Health profiles table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS health_profiles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        age INT NOT NULL,
        gender ENUM('male', 'female', 'other') NOT NULL,
        weight_kg DECIMAL(5,2) NOT NULL,
        height_cm DECIMAL(5,2) NOT NULL,
        bmi DECIMAL(5,2) NOT NULL,
        bmi_category VARCHAR(50) NOT NULL,
        lifestyle ENUM('sedentary', 'moderate', 'active') NOT NULL,
        diet_preference ENUM('veg', 'non-veg') NOT NULL,
        medical_history TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Profile diseases table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS profile_diseases (
        id INT AUTO_INCREMENT PRIMARY KEY,
        profile_id INT NOT NULL,
        disease_name VARCHAR(100) NOT NULL,
        FOREIGN KEY (profile_id) REFERENCES health_profiles(id) ON DELETE CASCADE,
        INDEX idx_profile_id (profile_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Profile allergies table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS profile_allergies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        profile_id INT NOT NULL,
        allergy_name VARCHAR(100) NOT NULL,
        FOREIGN KEY (profile_id) REFERENCES health_profiles(id) ON DELETE CASCADE,
        INDEX idx_profile_id (profile_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Recommendations table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS recommendations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        profile_id INT NOT NULL,
        category ENUM('diet', 'exercise', 'precaution', 'lifestyle') NOT NULL,
        recommendation TEXT NOT NULL,
        priority ENUM('low', 'medium', 'high', 'critical') NOT NULL DEFAULT 'medium',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (profile_id) REFERENCES health_profiles(id) ON DELETE CASCADE,
        INDEX idx_profile_id (profile_id),
        INDEX idx_category (category)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('  ✅ Database tables initialized');
  } finally {
    connection.release();
  }
}

module.exports = { pool, testConnection, initializeDatabase };
