/**
 * Recommendation Engine Tests
 */
const RecoEngine = require('../src/services/recoEngine');

describe('Recommendation Engine', () => {
  test('should generate BMI-based recommendations for obese profile', () => {
    const profile = {
      age: 35, gender: 'male', bmi: 32, bmiCategory: 'Obese Class I',
      lifestyle: 'sedentary', dietPreference: 'non-veg',
      diseases: [], allergies: [], riskLevel: 'high',
    };

    const recos = RecoEngine.generate(profile);
    expect(recos.length).toBeGreaterThan(0);

    const dietRecos = recos.filter((r) => r.category === 'diet');
    expect(dietRecos.length).toBeGreaterThan(0);
    expect(dietRecos[0].recommendation).toContain('32');
  });

  test('should generate disease-specific recommendations for diabetes', () => {
    const profile = {
      age: 45, gender: 'female', bmi: 26, bmiCategory: 'Overweight',
      lifestyle: 'moderate', dietPreference: 'veg',
      diseases: ['diabetes'], allergies: [], riskLevel: 'medium',
    };

    const recos = RecoEngine.generate(profile);
    const diseaseRecos = recos.filter((r) => r.recommendation.includes('DIABETES'));
    expect(diseaseRecos.length).toBeGreaterThan(0);
  });

  test('should generate allergy warnings', () => {
    const profile = {
      age: 28, gender: 'female', bmi: 22, bmiCategory: 'Normal Weight',
      lifestyle: 'active', dietPreference: 'non-veg',
      diseases: [], allergies: ['peanuts', 'shellfish'], riskLevel: 'low',
    };

    const recos = RecoEngine.generate(profile);
    const allergyRecos = recos.filter((r) => r.priority === 'critical');
    expect(allergyRecos.length).toBeGreaterThan(0);
  });

  test('should generate exercise recommendations based on lifestyle', () => {
    const profile = {
      age: 30, gender: 'male', bmi: 24, bmiCategory: 'Normal Weight',
      lifestyle: 'sedentary', dietPreference: 'non-veg',
      diseases: [], allergies: [], riskLevel: 'low',
    };

    const recos = RecoEngine.generate(profile);
    const exerciseRecos = recos.filter((r) => r.category === 'exercise');
    expect(exerciseRecos.length).toBeGreaterThan(0);
  });

  test('should generate vegetarian-specific diet advice', () => {
    const profile = {
      age: 25, gender: 'female', bmi: 21, bmiCategory: 'Normal Weight',
      lifestyle: 'moderate', dietPreference: 'veg',
      diseases: [], allergies: [], riskLevel: 'low',
    };

    const recos = RecoEngine.generate(profile);
    const vegRecos = recos.filter((r) =>
      r.recommendation.toLowerCase().includes('vegetarian') ||
      r.recommendation.toLowerCase().includes('b12')
    );
    expect(vegRecos.length).toBeGreaterThan(0);
  });

  test('should add medical consultation for high-risk profiles', () => {
    const profile = {
      age: 55, gender: 'male', bmi: 38, bmiCategory: 'Obese Class II',
      lifestyle: 'sedentary', dietPreference: 'non-veg',
      diseases: ['diabetes', 'hypertension'], allergies: [], riskLevel: 'high',
    };

    const recos = RecoEngine.generate(profile);
    const criticalRecos = recos.filter((r) => r.priority === 'critical');
    expect(criticalRecos.length).toBeGreaterThan(0);

    const consultReco = recos.find((r) =>
      r.recommendation.toLowerCase().includes('consult')
    );
    expect(consultReco).toBeDefined();
  });

  test('should add age-specific recommendations for seniors', () => {
    const profile = {
      age: 65, gender: 'female', bmi: 24, bmiCategory: 'Normal Weight',
      lifestyle: 'moderate', dietPreference: 'veg',
      diseases: [], allergies: [], riskLevel: 'low',
    };

    const recos = RecoEngine.generate(profile);
    const ageRecos = recos.filter((r) =>
      r.recommendation.includes('60+')
    );
    expect(ageRecos.length).toBeGreaterThan(0);
  });

  test('should handle complex multi-condition profile', () => {
    const profile = {
      age: 50, gender: 'male', bmi: 34, bmiCategory: 'Obese Class I',
      lifestyle: 'sedentary', dietPreference: 'non-veg',
      diseases: ['diabetes', 'hypertension', 'cholesterol'],
      allergies: ['gluten', 'dairy'],
      riskLevel: 'high',
      medicalHistory: 'Family history of heart disease',
    };

    const recos = RecoEngine.generate(profile);
    // Should have recommendations across all categories
    const categories = [...new Set(recos.map((r) => r.category))];
    expect(categories).toContain('diet');
    expect(categories).toContain('exercise');
    expect(categories).toContain('precaution');
    expect(categories).toContain('lifestyle');

    // Should have many recommendations for complex profile
    expect(recos.length).toBeGreaterThan(8);
  });

  test('should deduplicate recommendations', () => {
    const profile = {
      age: 30, gender: 'male', bmi: 22, bmiCategory: 'Normal Weight',
      lifestyle: 'active', dietPreference: 'non-veg',
      diseases: [], allergies: [], riskLevel: 'low',
    };

    const recos = RecoEngine.generate(profile);
    const keys = recos.map((r) => `${r.category}:${r.recommendation.substring(0, 50)}`);
    const uniqueKeys = new Set(keys);
    expect(keys.length).toBe(uniqueKeys.size);
  });
});
