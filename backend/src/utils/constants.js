/**
 * Application Constants
 * Centralized configuration for BMI thresholds, disease rules, and recommendation templates
 */

// ============================================================
// BMI Classification (WHO Standards)
// ============================================================
const BMI_CATEGORIES = {
  SEVERELY_UNDERWEIGHT: { min: 0, max: 16.0, label: 'Severely Underweight', risk: 'high' },
  UNDERWEIGHT: { min: 16.0, max: 18.5, label: 'Underweight', risk: 'medium' },
  NORMAL: { min: 18.5, max: 25.0, label: 'Normal Weight', risk: 'low' },
  OVERWEIGHT: { min: 25.0, max: 30.0, label: 'Overweight', risk: 'medium' },
  OBESE_I: { min: 30.0, max: 35.0, label: 'Obese Class I', risk: 'high' },
  OBESE_II: { min: 35.0, max: 40.0, label: 'Obese Class II', risk: 'high' },
  OBESE_III: { min: 40.0, max: Infinity, label: 'Obese Class III', risk: 'critical' },
};

// ============================================================
// Supported Diseases and Their Risk Profiles
// ============================================================
const KNOWN_DISEASES = [
  'diabetes', 'hypertension', 'heart disease', 'asthma',
  'thyroid', 'arthritis', 'cholesterol', 'anemia',
  'kidney disease', 'liver disease', 'PCOS', 'PCOD',
  'migraine', 'depression', 'anxiety', 'insomnia',
  'gastritis', 'IBS', 'celiac disease',
];

// ============================================================
// Common Allergies
// ============================================================
const KNOWN_ALLERGIES = [
  'peanuts', 'tree nuts', 'shellfish', 'fish', 'eggs',
  'milk', 'dairy', 'soy', 'wheat', 'gluten',
  'sesame', 'mustard', 'sulfites', 'latex',
];

// ============================================================
// Disease-Specific Dietary Restrictions
// ============================================================
const DISEASE_DIET_RULES = {
  diabetes: {
    avoid: ['sugar', 'white rice', 'white bread', 'sugary drinks', 'processed foods'],
    prefer: ['whole grains', 'leafy greens', 'lean proteins', 'nuts', 'berries'],
    note: 'Focus on low-glycemic index foods. Monitor carbohydrate intake per meal.',
  },
  hypertension: {
    avoid: ['salt', 'processed meats', 'canned soups', 'pickles', 'fast food'],
    prefer: ['bananas', 'spinach', 'oats', 'berries', 'beets', 'garlic'],
    note: 'Follow DASH diet principles. Limit sodium to 1500mg/day.',
  },
  'heart disease': {
    avoid: ['trans fats', 'fried foods', 'red meat', 'full-fat dairy', 'excess salt'],
    prefer: ['omega-3 fish', 'olive oil', 'avocados', 'walnuts', 'legumes'],
    note: 'Mediterranean diet recommended. Limit cholesterol intake.',
  },
  asthma: {
    avoid: ['sulfites', 'preservatives', 'cold drinks', 'processed foods'],
    prefer: ['ginger', 'turmeric', 'garlic', 'honey', 'warm fluids'],
    note: 'Anti-inflammatory foods can help manage symptoms.',
  },
  thyroid: {
    avoid: ['soy products', 'excess cruciferous vegetables (raw)', 'gluten'],
    prefer: ['selenium-rich foods', 'iodine sources', 'zinc-rich foods'],
    note: 'Hypothyroid: ensure adequate iodine. Hyperthyroid: limit iodine.',
  },
  cholesterol: {
    avoid: ['fried foods', 'butter', 'cream', 'fatty meats', 'egg yolks (excess)'],
    prefer: ['oats', 'barley', 'beans', 'almonds', 'fatty fish'],
    note: 'Increase soluble fiber intake. Omega-3 fatty acids help lower LDL.',
  },
  anemia: {
    avoid: ['tea/coffee with meals (blocks iron absorption)', 'excess calcium with iron-rich meals'],
    prefer: ['spinach', 'lentils', 'red meat (if non-veg)', 'vitamin C foods', 'fortified cereals'],
    note: 'Pair iron-rich foods with vitamin C for better absorption.',
  },
  gastritis: {
    avoid: ['spicy foods', 'alcohol', 'caffeine', 'acidic foods', 'NSAIDs'],
    prefer: ['yogurt', 'banana', 'oatmeal', 'ginger tea', 'lean proteins'],
    note: 'Eat smaller, frequent meals. Avoid eating late at night.',
  },
};

// ============================================================
// Exercise Recommendations by Lifestyle + BMI
// ============================================================
const EXERCISE_PLANS = {
  sedentary: {
    low: 'Start with 20-minute daily walks. Add light stretching. Goal: 150 min/week of moderate activity.',
    medium: 'Begin with 30 minutes of brisk walking 5 days/week. Add bodyweight exercises gradually.',
    high: 'Start supervised low-impact exercises. 15-minute walks 3x/week, increasing gradually. Consult physician first.',
    critical: 'Medical clearance required before starting any exercise. Begin with chair exercises and gentle stretching only.',
  },
  moderate: {
    low: 'Maintain current activity. Add 2 days of strength training. Consider yoga for flexibility.',
    medium: 'Increase to 200 min/week cardio. Add resistance training 3x/week for weight management.',
    high: 'Focus on low-impact cardio (swimming, cycling). 30 min/day with heart rate monitoring.',
    critical: 'Reduce intensity. Switch to supervised, low-impact activities. Monitor vitals during exercise.',
  },
  active: {
    low: 'Excellent baseline. Optimize with periodization. Include recovery days and flexibility work.',
    medium: 'Add interval training 2x/week. Focus on compound movements for efficient calorie burn.',
    high: 'Scale back high-impact activities. Focus on functional fitness and joint-friendly exercises.',
    critical: 'Reduce to moderate intensity immediately. Focus on rehabilitation exercises under supervision.',
  },
};

// ============================================================
// Lifestyle Recommendations
// ============================================================
const LIFESTYLE_TIPS = {
  sedentary: [
    'Stand up and move for 5 minutes every hour during work.',
    'Take stairs instead of elevators when possible.',
    'Set a daily step goal starting at 5,000 and increasing by 500 each week.',
    'Consider a standing desk or desk converter.',
    'Schedule movement breaks as calendar reminders.',
  ],
  moderate: [
    'Maintain consistency — aim for activity at least 5 days/week.',
    'Try new activities to prevent workout boredom (swimming, cycling, dance).',
    'Track your activity with a fitness app or wearable.',
    'Join a sports club or group fitness class for accountability.',
  ],
  active: [
    'Prioritize recovery — ensure 7-8 hours of sleep.',
    'Include active recovery days with yoga or light stretching.',
    'Monitor for signs of overtraining: fatigue, mood changes, persistent soreness.',
    'Periodize your training to prevent plateaus.',
  ],
};

// ============================================================
// Priority Levels
// ============================================================
const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

module.exports = {
  BMI_CATEGORIES,
  KNOWN_DISEASES,
  KNOWN_ALLERGIES,
  DISEASE_DIET_RULES,
  EXERCISE_PLANS,
  LIFESTYLE_TIPS,
  PRIORITY,
};
