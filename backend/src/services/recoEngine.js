/**
 * 🧠 Recommendation Engine
 * Rule-based system that generates personalized health recommendations
 * based on BMI, diseases, allergies, lifestyle, and diet preference.
 * 
 * Architecture: Modular rule processors → Merge → Deduplicate → Prioritize
 * Designed to be extendable for ML integration in the future.
 */
const {
  DISEASE_DIET_RULES,
  EXERCISE_PLANS,
  LIFESTYLE_TIPS,
  PRIORITY,
} = require('../utils/constants');

const RecoEngine = {
  /**
   * Main entry point — generates all recommendations for a health profile
   * @param {Object} profile - Complete health profile data
   * @returns {Array<Object>} Array of { category, recommendation, priority }
   */
  generate(profile) {
    const recommendations = [];

    // Run all rule processors
    recommendations.push(...this._bmiRecommendations(profile));
    recommendations.push(...this._diseaseRecommendations(profile));
    recommendations.push(...this._allergyRecommendations(profile));
    recommendations.push(...this._exerciseRecommendations(profile));
    recommendations.push(...this._dietRecommendations(profile));
    recommendations.push(...this._lifestyleRecommendations(profile));
    recommendations.push(...this._ageSpecificRecommendations(profile));

    // Add medical consultation flag if high risk
    if (profile.riskLevel === 'critical' || profile.riskLevel === 'high') {
      recommendations.push({
        category: 'precaution',
        recommendation: 'Based on your health profile, we strongly recommend consulting a healthcare professional for a comprehensive assessment before making significant lifestyle changes.',
        priority: PRIORITY.CRITICAL,
      });
    }

    // Deduplicate and return
    return this._deduplicate(recommendations);
  },

  /**
   * BMI-based recommendations
   */
  _bmiRecommendations(profile) {
    const { bmi, bmiCategory } = profile;
    const recos = [];

    if (bmi < 16) {
      recos.push({
        category: 'diet',
        recommendation: `Your BMI is ${bmi} (${bmiCategory}). This indicates severe underweight. Increase caloric intake with nutrient-dense foods: nuts, avocados, whole grains, and healthy fats. Eat 5-6 small meals daily.`,
        priority: PRIORITY.CRITICAL,
      });
      recos.push({
        category: 'precaution',
        recommendation: 'Severely underweight BMI can indicate underlying health issues. Please consult a doctor immediately for blood work and nutritional assessment.',
        priority: PRIORITY.CRITICAL,
      });
    } else if (bmi < 18.5) {
      recos.push({
        category: 'diet',
        recommendation: `Your BMI is ${bmi} (${bmiCategory}). Gradually increase caloric intake by 300-500 kcal/day. Focus on protein-rich foods, healthy fats, and complex carbohydrates.`,
        priority: PRIORITY.HIGH,
      });
    } else if (bmi < 25) {
      recos.push({
        category: 'diet',
        recommendation: `Your BMI is ${bmi} (${bmiCategory}). Maintain your current balanced diet. Focus on whole foods, adequate protein, and micronutrient diversity.`,
        priority: PRIORITY.LOW,
      });
    } else if (bmi < 30) {
      recos.push({
        category: 'diet',
        recommendation: `Your BMI is ${bmi} (${bmiCategory}). Reduce daily caloric intake by 300-500 kcal. Focus on portion control, increase vegetable intake, and reduce refined carbohydrates.`,
        priority: PRIORITY.MEDIUM,
      });
    } else if (bmi < 35) {
      recos.push({
        category: 'diet',
        recommendation: `Your BMI is ${bmi} (${bmiCategory}). Implement a structured weight loss plan: reduce calories by 500 kcal/day, focus on high-fiber foods, lean proteins, and eliminate sugary beverages.`,
        priority: PRIORITY.HIGH,
      });
    } else if (bmi < 40) {
      recos.push({
        category: 'diet',
        recommendation: `Your BMI is ${bmi} (${bmiCategory}). A medically supervised weight management program is recommended. Target 1-2 lbs/week weight loss through caloric deficit and structured meal planning.`,
        priority: PRIORITY.HIGH,
      });
    } else {
      recos.push({
        category: 'diet',
        recommendation: `Your BMI is ${bmi} (${bmiCategory}). Immediate medical intervention recommended. Work with a registered dietitian for a personalized meal plan. Consider medical weight management options.`,
        priority: PRIORITY.CRITICAL,
      });
    }

    return recos;
  },

  /**
   * Disease-specific recommendations
   */
  _diseaseRecommendations(profile) {
    const { diseases } = profile;
    if (!diseases || diseases.length === 0) return [];

    const recos = [];

    diseases.forEach((disease) => {
      const diseaseLower = disease.toLowerCase().trim();
      const rules = DISEASE_DIET_RULES[diseaseLower];

      if (rules) {
        // Diet recommendation based on disease
        recos.push({
          category: 'diet',
          recommendation: `[${disease.toUpperCase()}] ${rules.note} Avoid: ${rules.avoid.join(', ')}. Prefer: ${rules.prefer.join(', ')}.`,
          priority: PRIORITY.HIGH,
        });
      }

      // Disease-specific precautions
      switch (diseaseLower) {
        case 'diabetes':
          recos.push({
            category: 'precaution',
            recommendation: 'Monitor blood glucose levels regularly (fasting and post-meal). Keep an HbA1c test every 3 months. Carry glucose tablets for emergencies.',
            priority: PRIORITY.HIGH,
          });
          break;
        case 'hypertension':
          recos.push({
            category: 'precaution',
            recommendation: 'Monitor blood pressure daily (morning and evening). Reduce stress through meditation or deep breathing. Limit alcohol and caffeine intake.',
            priority: PRIORITY.HIGH,
          });
          break;
        case 'heart disease':
          recos.push({
            category: 'precaution',
            recommendation: 'Regular cardiac checkups every 3-6 months. Monitor cholesterol levels. Learn to recognize warning signs: chest pain, shortness of breath, irregular heartbeat.',
            priority: PRIORITY.CRITICAL,
          });
          break;
        case 'asthma':
          recos.push({
            category: 'precaution',
            recommendation: 'Always carry rescue inhaler. Avoid known triggers (dust, smoke, cold air). Keep an asthma action plan. Get annual flu vaccination.',
            priority: PRIORITY.HIGH,
          });
          break;
        case 'thyroid':
          recos.push({
            category: 'precaution',
            recommendation: 'Regular thyroid function tests every 6 months. Take thyroid medication consistently at the same time daily, preferably on empty stomach.',
            priority: PRIORITY.MEDIUM,
          });
          break;
        case 'anemia':
          recos.push({
            category: 'precaution',
            recommendation: 'Monitor hemoglobin levels regularly. Watch for symptoms: fatigue, dizziness, pale skin, rapid heartbeat. Consider iron supplements under medical guidance.',
            priority: PRIORITY.MEDIUM,
          });
          break;
        case 'cholesterol':
          recos.push({
            category: 'precaution',
            recommendation: 'Lipid profile test every 6 months. Monitor LDL, HDL, and triglycerides. Take statin medications as prescribed.',
            priority: PRIORITY.MEDIUM,
          });
          break;
      }
    });

    // Multi-disease interaction warning
    if (diseases.length >= 2) {
      const hasHighRisk =
        diseases.some((d) => ['diabetes', 'hypertension', 'heart disease'].includes(d.toLowerCase()));
      if (hasHighRisk) {
        recos.push({
          category: 'precaution',
          recommendation: `You have multiple conditions (${diseases.join(', ')}). These may interact and compound health risks. Regular comprehensive health checkups are essential. Discuss medication interactions with your doctor.`,
          priority: PRIORITY.CRITICAL,
        });
      }
    }

    return recos;
  },

  /**
   * Allergy-specific recommendations
   */
  _allergyRecommendations(profile) {
    const { allergies } = profile;
    if (!allergies || allergies.length === 0) return [];

    const recos = [];

    // General allergy awareness
    recos.push({
      category: 'precaution',
      recommendation: `Known allergies: ${allergies.join(', ')}. Always check food labels and inform restaurant staff about your allergies. Carry antihistamines or an EpiPen if prescribed.`,
      priority: PRIORITY.CRITICAL,
    });

    // Specific allergy dietary alternatives
    const allergyAlternatives = {
      peanuts: 'Use sunflower seed butter, almond butter (if no tree nut allergy), or soy butter as alternatives.',
      'tree nuts': 'Use seeds (sunflower, pumpkin, hemp) for similar nutritional benefits.',
      shellfish: 'Get omega-3 from flaxseeds, chia seeds, and non-shellfish fish like salmon.',
      fish: 'Get omega-3 from flaxseeds, walnuts, and chia seeds. Consider algae-based omega-3 supplements.',
      eggs: 'Use flax eggs (1 tbsp ground flax + 3 tbsp water) or commercial egg replacers in cooking.',
      milk: 'Use plant-based milk (oat, almond, soy). Ensure adequate calcium from leafy greens and fortified foods.',
      dairy: 'Use plant-based alternatives. Supplement with calcium and vitamin D. Check for hidden dairy in processed foods.',
      gluten: 'Use gluten-free grains: rice, quinoa, millet, buckwheat, amaranth. Check labels for hidden gluten.',
      wheat: 'Use alternative flours: rice flour, oat flour, almond flour. Many wheat-free products available.',
      soy: 'Avoid soy sauce (use coconut aminos), tofu, tempeh, and edamame. Check processed food labels.',
    };

    allergies.forEach((allergy) => {
      const allergyLower = allergy.toLowerCase().trim();
      if (allergyAlternatives[allergyLower]) {
        recos.push({
          category: 'diet',
          recommendation: `[ALLERGY: ${allergy}] ${allergyAlternatives[allergyLower]}`,
          priority: PRIORITY.HIGH,
        });
      }
    });

    return recos;
  },

  /**
   * Exercise recommendations based on lifestyle + risk level
   */
  _exerciseRecommendations(profile) {
    const { lifestyle, riskLevel } = profile;
    const plan = EXERCISE_PLANS[lifestyle];

    if (!plan) return [];

    const exerciseReco = plan[riskLevel] || plan.medium;

    return [{
      category: 'exercise',
      recommendation: exerciseReco,
      priority: riskLevel === 'critical' ? PRIORITY.HIGH : PRIORITY.MEDIUM,
    }];
  },

  /**
   * Diet preference-specific recommendations
   */
  _dietRecommendations(profile) {
    const { dietPreference, diseases } = profile;
    const recos = [];

    if (dietPreference === 'veg') {
      recos.push({
        category: 'diet',
        recommendation: 'As a vegetarian, ensure adequate protein from lentils, chickpeas, paneer, tofu, quinoa, and legumes. Consider B12 supplementation as it is primarily found in animal products.',
        priority: PRIORITY.MEDIUM,
      });

      // If anemic + vegetarian → extra iron guidance
      if (diseases && diseases.some((d) => d.toLowerCase() === 'anemia')) {
        recos.push({
          category: 'diet',
          recommendation: 'Vegetarian with anemia: Focus on iron-rich plant foods (spinach, lentils, fortified cereals). Always pair with vitamin C foods for absorption. Consider iron supplements.',
          priority: PRIORITY.HIGH,
        });
      }
    } else {
      recos.push({
        category: 'diet',
        recommendation: 'Include lean proteins: chicken breast, fish, eggs. Limit red meat to 1-2 times per week. Choose grilled/baked over fried preparations.',
        priority: PRIORITY.LOW,
      });
    }

    return recos;
  },

  /**
   * Lifestyle-based recommendations
   */
  _lifestyleRecommendations(profile) {
    const { lifestyle } = profile;
    const tips = LIFESTYLE_TIPS[lifestyle];

    if (!tips || tips.length === 0) return [];

    // Pick 2-3 most relevant tips
    const selectedTips = tips.slice(0, 3);

    return selectedTips.map((tip, index) => ({
      category: 'lifestyle',
      recommendation: tip,
      priority: index === 0 ? PRIORITY.MEDIUM : PRIORITY.LOW,
    }));
  },

  /**
   * Age-specific recommendations
   */
  _ageSpecificRecommendations(profile) {
    const { age } = profile;
    const recos = [];

    if (age < 18) {
      recos.push({
        category: 'precaution',
        recommendation: 'You are under 18. Health recommendations should be reviewed with a parent/guardian and pediatrician. Growing bodies have different nutritional needs.',
        priority: PRIORITY.HIGH,
      });
    } else if (age >= 40 && age < 60) {
      recos.push({
        category: 'precaution',
        recommendation: 'At 40+, schedule annual health screenings: blood pressure, blood sugar, cholesterol, and cancer screenings as recommended by your doctor.',
        priority: PRIORITY.MEDIUM,
      });
    } else if (age >= 60) {
      recos.push({
        category: 'precaution',
        recommendation: 'At 60+, prioritize bone health (calcium + vitamin D), regular health checkups, fall prevention exercises, and cognitive activities. Consider low-impact exercises.',
        priority: PRIORITY.HIGH,
      });
      recos.push({
        category: 'exercise',
        recommendation: 'Focus on balance and flexibility exercises: tai chi, yoga, swimming. Include 2 days of light strength training to maintain muscle mass.',
        priority: PRIORITY.MEDIUM,
      });
    }

    return recos;
  },

  /**
   * Remove duplicate recommendations (same category + similar text)
   */
  _deduplicate(recommendations) {
    const seen = new Set();
    return recommendations.filter((reco) => {
      // Create a simple key from category + first 50 chars of recommendation
      const key = `${reco.category}:${reco.recommendation.substring(0, 50)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  },
};

module.exports = RecoEngine;
