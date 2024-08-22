import { RecordWithScore } from '../../types';

export function byLowestValue(
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
    const differenceToMinValue = (record[fieldToScore] as number) - minValue;

    const normalizedValueWeight =
      1 - differenceToMinValue / (maxValue - minValue);

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
