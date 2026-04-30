-- ============================================================
-- Seed Data for Development/Testing
-- Password for all test users: "Test@1234" (bcrypt hashed)
-- ============================================================

USE health_app;

-- Insert test user (password: Test@1234)
INSERT INTO users (name, email, password_hash) VALUES
('John Doe', 'john@example.com', '$2a$10$xVqYLGMRJz3psonOvBGF..AZt5FdR.EQodqFOW3MCCyTKeBjWxWJy'),
('Jane Smith', 'jane@example.com', '$2a$10$xVqYLGMRJz3psonOvBGF..AZt5FdR.EQodqFOW3MCCyTKeBjWxWJy');

-- Insert sample health profile for John
INSERT INTO health_profiles (user_id, age, gender, weight_kg, height_cm, bmi, bmi_category, lifestyle, diet_preference, medical_history)
VALUES (1, 35, 'male', 92.00, 175.00, 30.04, 'Obese Class I', 'sedentary', 'non-veg', 'Family history of heart disease');

-- Insert diseases for profile
INSERT INTO profile_diseases (profile_id, disease_name) VALUES
(1, 'diabetes'),
(1, 'hypertension');

-- Insert allergies for profile
INSERT INTO profile_allergies (profile_id, allergy_name) VALUES
(1, 'peanuts'),
(1, 'shellfish');

-- Insert sample recommendations
INSERT INTO recommendations (profile_id, category, recommendation, priority) VALUES
(1, 'diet', 'Reduce daily caloric intake by 500 kcal. Focus on high-fiber, low-glycemic foods to manage blood sugar levels.', 'high'),
(1, 'diet', 'Strictly avoid peanuts and shellfish. Use almonds and fish (non-shellfish) as protein alternatives.', 'critical'),
(1, 'exercise', 'Begin with 30 minutes of brisk walking 5 days/week. Gradually increase to moderate cardio over 4 weeks.', 'high'),
(1, 'precaution', 'Monitor blood pressure and blood sugar daily. Keep a health journal for doctor visits.', 'critical'),
(1, 'lifestyle', 'Transition from sedentary to moderate activity gradually. Stand for 5 minutes every hour during work.', 'medium');
