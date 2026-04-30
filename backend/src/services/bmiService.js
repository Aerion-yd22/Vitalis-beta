/**
 * BMI Service
 * Calculates BMI and determines WHO classification
 */
const { BMI_CATEGORIES } = require('../utils/constants');
const { roundTo } = require('../utils/helpers');

const BmiService = {
  /**
   * Calculate BMI from weight (kg) and height (cm)
   * Formula: BMI = weight(kg) / height(m)^2
   * 
   * @param {number} weightKg - Weight in kilograms
   * @param {number} heightCm - Height in centimeters
   * @returns {number} BMI value rounded to 2 decimal places
   */
  calculate(weightKg, heightCm) {
    const heightM = heightCm / 100; // Convert cm to meters
    const bmi = weightKg / (heightM * heightM);
    return roundTo(bmi, 2);
  },

  /**
   * Classify BMI into WHO category
   * @param {number} bmi - Calculated BMI value
   * @returns {Object} { label, risk } — category label and risk level
   */
  classify(bmi) {
    for (const [key, category] of Object.entries(BMI_CATEGORIES)) {
      if (bmi >= category.min && bmi < category.max) {
        return {
          category: category.label,
          risk: category.risk,
          key,
        };
      }
    }
    // Fallback (should never reach here with valid BMI)
    return { category: 'Unknown', risk: 'medium', key: 'UNKNOWN' };
  },

  /**
   * Full BMI analysis — calculate + classify
   * @param {number} weightKg
   * @param {number} heightCm
   * @returns {Object} { bmi, category, risk, key }
   */
  analyze(weightKg, heightCm) {
    const bmi = this.calculate(weightKg, heightCm);
    const classification = this.classify(bmi);
    return { bmi, ...classification };
  },
};

module.exports = BmiService;
