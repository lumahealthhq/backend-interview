/**
 * Calculates the Bayes Estimator.
 * @param C - Constant that controls how much weight the prior has
 * @param m - The prior value
 * @param successes - The number of successful outcomes
 * @param attempts - The total number of attempts
 */
export default function bayesEstimator(C: number, m: number, successes: number, attempts: number): number {
  if (C <= 0) throw new Error("C must be positive");
  if (m < 0 || m > 1) throw new Error("m must be between 0 and 1");
  if (successes < 0) throw new Error("successes must be non-negative");
  if (attempts < 0) throw new Error("attempts must be non-negative");
  if (successes > attempts) throw new Error("successes cannot be greater than attempts");

  const estimator = (C * m + successes) / (C + attempts);
  return Math.min(1, Math.max(0, estimator)); // Ensure the result is between 0 and 1
}
