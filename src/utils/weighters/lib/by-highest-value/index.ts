import { RecordWithScore } from '../../types';

export function byHighestValue(
  records: RecordWithScore[],
  fieldToScore: string,
  weightInPercent: number
): RecordWithScore[] {
  let minValue = Infinity;
  let maxValue = -Infinity;

  for (let index = 0; index < records.length; index++) {
    const field = (records[index] as RecordWithScore)[fieldToScore] as number;

    if (field < minValue) {
      minValue = field;
    }

    if (field > maxValue) {
      maxValue = field;
    }
  }

  const recordsWithScore = records.map((record) => {
    const differenceToMaxValue = maxValue - (record[fieldToScore] as number);
    const rangeBetweenMaxAndMinValue = maxValue - minValue;

    const normalizedValueWeight =
      1 - differenceToMaxValue / rangeBetweenMaxAndMinValue;

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
