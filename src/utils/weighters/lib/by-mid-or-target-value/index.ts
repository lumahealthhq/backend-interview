import { RecordWithScore } from '../../types';

export function byMidOrTargetValue(
  records: RecordWithScore[],
  fieldToScore: string,
  weightInPercent: number,
  targetValue?: number
): RecordWithScore[] {
  // @NOTE: this is where we will put the number we will use as the base for our calculation.
  let base: number;
  let minValue = Infinity;
  let maxValue = -Infinity;
  let sumOfValues = 0;

  for (let index = 0; index < records.length; index++) {
    const field = (records[index] as RecordWithScore)[fieldToScore] as number;

    // @NOTE: i don't really like putting this if statement here, but I can't think of an alternative right now
    if (targetValue === undefined) {
      sumOfValues += field;
    }

    if (field < minValue) {
      minValue = field;
    }

    if (field > maxValue) {
      maxValue = field;
    }
  }

  if (targetValue === undefined) {
    // @NOTE: the mid point is enough
    base = (minValue + maxValue) / 2;
  } else {
    base = targetValue;
  }

  // @NOTE: we get the max difference because we want to know how much our number (in the loop) deviates from the base
  const largestValueDifferenceToBase = Math.max(
    base - minValue,
    maxValue - base
  );

  const recordsWithScore = records.map((record) => {
    const valueDifferenceToBase = Math.abs(
      (record[fieldToScore] as number) - base
    );

    const normalizedValueWeight =
      1 - valueDifferenceToBase / largestValueDifferenceToBase;

    const score = normalizedValueWeight * weightInPercent;

    return {
      ...record,
      score: record.score
        ? parseFloat((record.score + score).toFixed(4))
        : parseFloat(score.toFixed(4)),
    };
  });

  return recordsWithScore;
}
