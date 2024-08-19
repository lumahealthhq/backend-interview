import bayesEstimator from './bayes';

describe('bayesEstimator', () => {
  test('calculates correct estimator for typical values', () => {
    expect(bayesEstimator(10, 0.5, 7, 10)).toBeCloseTo(0.6, 2);
  });

  test('returns prior when no attempts are made', () => {
    expect(bayesEstimator(5, 0.3, 0, 0)).toBe(0.3);
  });

  test('handles large numbers correctly', () => {
    expect(bayesEstimator(1000, 0.1, 5000, 10000)).toBeCloseTo(0.4636, 4);
  });

  test('returns 1 when all attempts are successful', () => {
    expect(bayesEstimator(2, 0.5, 100, 100)).toBeCloseTo(0.9902, 4);
  });

  test('returns close to 0 when no attempts are successful', () => {
    expect(bayesEstimator(2, 0.5, 0, 100)).toBeCloseTo(0.0098, 4);
  });

  test('handles fractional successes', () => {
    expect(bayesEstimator(5, 0.2, 2.5, 10)).toBeCloseTo(0.2333, 4);
  });

  test('throws error for negative C', () => {
    expect(() => bayesEstimator(-1, 0.5, 5, 10)).toThrow("C must be positive");
  });

  test('throws error for m outside [0, 1]', () => {
    expect(() => bayesEstimator(5, 1.5, 5, 10)).toThrow("m must be between 0 and 1");
    expect(() => bayesEstimator(5, -0.5, 5, 10)).toThrow("m must be between 0 and 1");
  });

  test('throws error for negative successes', () => {
    expect(() => bayesEstimator(5, 0.5, -1, 10)).toThrow("successes must be non-negative");
  });

  test('throws error for negative attempts', () => {
    expect(() => bayesEstimator(5, 0.5, 5, -10)).toThrow("attempts must be non-negative");
  });

  test('throws error when successes > attempts', () => {
    expect(() => bayesEstimator(5, 0.5, 11, 10)).toThrow("successes cannot be greater than attempts");
  });
});
