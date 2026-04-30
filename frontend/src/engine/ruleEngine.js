/**
 * Rule-Based Recommendation Engine
 * 
 * This module demonstrates a deterministic rule-based system
 * for generating explainable health recommendations.
 * 
 * NOTE:
 * This is intentionally NOT integrated into the main system
 * to preserve application stability during demonstration.
 */

export const generateRuleBasedRecommendations = (input = {}) => {
  const recs = [];

  const {
    weight,
    height,
    activityLevel,
    dietType,
    sleep
  } = input;

  // BMI Rule
  if (weight && height) {
    const bmi = weight / ((height / 100) ** 2);

    if (bmi > 25) {
      recs.push("Reduce calorie intake and increase activity.");
    } else if (bmi < 18.5) {
      recs.push("Increase calorie intake with balanced nutrition.");
    }
  }

  // Activity Rule
  if (activityLevel === "sedentary") {
    recs.push("Start with light physical activity like walking.");
  }

  // Diet Rule
  if (dietType === "vegetarian") {
    recs.push("Include plant-based protein sources like lentils and soy.");
  }

  // Sleep Rule
  if (sleep && sleep < 6) {
    recs.push("Improve sleep duration for better recovery.");
  }

  return recs;
};
