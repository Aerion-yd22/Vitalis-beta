-- ============================================================
-- Personalized Health Recommendation System
-- Database Schema — MySQL
-- ============================================================

CREATE DATABASE IF NOT EXISTS health_app;
USE health_app;

-- ============================================================
-- Users Table
-- Stores authentication credentials and basic info
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Health Profiles Table
-- Stores each health assessment snapshot for a user
-- ============================================================
CREATE TABLE IF NOT EXISTS health_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    age INT NOT NULL CHECK (age >= 1 AND age <= 150),
    gender ENUM('male', 'female', 'other') NOT NULL,
    weight_kg DECIMAL(5,2) NOT NULL CHECK (weight_kg > 0),
    height_cm DECIMAL(5,2) NOT NULL CHECK (height_cm > 0),
    bmi DECIMAL(5,2) NOT NULL,
    bmi_category VARCHAR(50) NOT NULL,
    lifestyle ENUM('sedentary', 'moderate', 'active') NOT NULL,
    diet_preference ENUM('veg', 'non-veg') NOT NULL,
    medical_history TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Profile Diseases Table
-- Normalized table for multiple diseases per profile
-- ============================================================
CREATE TABLE IF NOT EXISTS profile_diseases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profile_id INT NOT NULL,
    disease_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (profile_id) REFERENCES health_profiles(id) ON DELETE CASCADE,
    INDEX idx_profile_id (profile_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Profile Allergies Table
-- Normalized table for multiple allergies per profile
-- ============================================================
CREATE TABLE IF NOT EXISTS profile_allergies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profile_id INT NOT NULL,
    allergy_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (profile_id) REFERENCES health_profiles(id) ON DELETE CASCADE,
    INDEX idx_profile_id (profile_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Recommendations Table
-- Stores generated recommendations linked to a profile
-- ============================================================
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
