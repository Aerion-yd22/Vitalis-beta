/**
 * Recommendation Routes
 */
const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const { weight, height, conditions, allergies } = req.body;
  if (!weight || !height) return res.status(400).json({ error: 'weight and height required' });

  const h = height / 100;
  const bmi = weight / (h * h);
  
  let riskLevel = 'Medium';
  if (bmi > 25) riskLevel = 'High';
  else if (bmi < 18) riskLevel = 'Low';

  const recommendations = [];
  if (bmi > 25) recommendations.push('Increase physical activity');
  if (conditions && conditions.toLowerCase().includes('diabetes')) {
    recommendations.push('Avoid sugar');
  }
  if (conditions && conditions.toLowerCase().includes('hypertension')) {
    recommendations.push('Reduce salt intake');
  }
  if (allergies) {
    recommendations.push(`Avoid listed allergens: ${allergies}`);
  }

  res.json({
    bmi: bmi.toFixed(1),
    riskLevel,
    recommendations
  });
});

module.exports = router;
