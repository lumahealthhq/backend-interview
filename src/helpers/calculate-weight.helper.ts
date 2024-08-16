export function calculateWeight(normalizedValue: number, weightParameter: {correlation: number; percentage: number}): number {
  const difference = Math.abs(weightParameter.correlation - normalizedValue);
  const percentage = weightParameter.percentage;

  return difference * percentage;
}
