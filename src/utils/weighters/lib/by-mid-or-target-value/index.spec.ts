import { byAverageOrTargetValue } from '.';
import { RecordWithScore } from '../../types';

describe('weighter lib: by average or target value', () => {
  it('should weight the records by the midpoint value of a given field in the set', () => {
    const records: RecordWithScore[] = [
      {
        age: 10,
        score: 0,
      },
      {
        age: 15,
        score: 0,
      },
      {
        age: 14,
        score: 0,
      },
      {
        age: 22,
        score: 0,
      },
      {
        age: 30,
        score: 0,
      },
    ];

    const result = byAverageOrTargetValue(records, 'age', 0.1);

    expect((result[0] as RecordWithScore).score).toBe(0);
    expect((result[1] as RecordWithScore).score).toBeGreaterThan(0);
    expect((result[2] as RecordWithScore).score).toBeGreaterThan(0);
    expect((result[3] as RecordWithScore).score).toBeGreaterThan(0);
    expect((result[4] as RecordWithScore).score).toBe(0);
  });

  it('should weight the records by a target value (30) of a given field in the set', () => {
    const records: RecordWithScore[] = [
      {
        age: 10,
        score: 0,
      },
      {
        age: 15,
        score: 0,
      },
      {
        age: 14,
        score: 0,
      },
      {
        age: 22,
        score: 0,
      },
      {
        age: 30,
        score: 0,
      },
    ];

    const result = byAverageOrTargetValue(records, 'age', 0.1, 30);

    expect((result[0] as RecordWithScore).score).toBe(0);
    expect((result[1] as RecordWithScore).score).toBeLessThan(0.1);
    expect((result[2] as RecordWithScore).score).toBeLessThan(0.1);
    expect((result[3] as RecordWithScore).score).toBeLessThan(0.1);
    expect((result[4] as RecordWithScore).score).toBe(0.1);
  });
});
