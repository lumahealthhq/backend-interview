
export function calculateWeight(normalizeValue: number, weightParameter: {correlation: number; percentage: number}): number {
  return Math.abs((weightParameter.correlation - normalizeValue) * weightParameter.percentage);
}
