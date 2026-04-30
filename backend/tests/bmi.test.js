/**
 * BMI Service Tests
 */
const BmiService = require('../src/services/bmiService');

describe('BMI Service', () => {
  describe('calculate()', () => {
    test('should calculate BMI correctly for normal weight', () => {
      // 70kg, 175cm → BMI ~22.86
      const bmi = BmiService.calculate(70, 175);
      expect(bmi).toBeCloseTo(22.86, 1);
    });

    test('should calculate BMI correctly for overweight', () => {
      // 85kg, 170cm → BMI ~29.41
      const bmi = BmiService.calculate(85, 170);
      expect(bmi).toBeCloseTo(29.41, 1);
    });

    test('should calculate BMI correctly for underweight', () => {
      // 45kg, 170cm → BMI ~15.57
      const bmi = BmiService.calculate(45, 170);
      expect(bmi).toBeCloseTo(15.57, 1);
    });

    test('should calculate BMI correctly for obese', () => {
      // 120kg, 170cm → BMI ~41.52
      const bmi = BmiService.calculate(120, 170);
      expect(bmi).toBeCloseTo(41.52, 1);
    });
  });

  describe('classify()', () => {
    test('should classify severely underweight', () => {
      const result = BmiService.classify(15.5);
      expect(result.category).toBe('Severely Underweight');
      expect(result.risk).toBe('high');
    });

    test('should classify underweight', () => {
      const result = BmiService.classify(17.5);
      expect(result.category).toBe('Underweight');
      expect(result.risk).toBe('medium');
    });

    test('should classify normal weight', () => {
      const result = BmiService.classify(22);
      expect(result.category).toBe('Normal Weight');
      expect(result.risk).toBe('low');
    });

    test('should classify overweight', () => {
      const result = BmiService.classify(27);
      expect(result.category).toBe('Overweight');
      expect(result.risk).toBe('medium');
    });

    test('should classify obese class I', () => {
      const result = BmiService.classify(32);
      expect(result.category).toBe('Obese Class I');
      expect(result.risk).toBe('high');
    });

    test('should classify obese class III', () => {
      const result = BmiService.classify(42);
      expect(result.category).toBe('Obese Class III');
      expect(result.risk).toBe('critical');
    });
  });

  describe('analyze()', () => {
    test('should return complete analysis', () => {
      const result = BmiService.analyze(92, 175);
      expect(result.bmi).toBeCloseTo(30.04, 1);
      expect(result.category).toBe('Obese Class I');
      expect(result.risk).toBe('high');
    });
  });
});
