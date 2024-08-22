import { byLowestValue } from '.';
import { RecordWithScore } from '../../types';

describe('weighter lib: by lowest value', () => {
  it('should weight the recordsw by the lowest value of a given field in the set', () => {
    const records: RecordWithScore[] = [
      {
        replyTime: 10,
        score: 0,
      },
      {
        replyTime: 12,
        score: 0,
      },
      {
        replyTime: 15,
        score: 0,
      },
      {
        replyTime: 22,
        score: 0,
      },
      {
        replyTime: 35,
        score: 0,
      },
    ];

    const result = byLowestValue(records, 'replyTime', 0.3);

    expect((result[0] as RecordWithScore).score).toBe(0.3);
    expect((result[1] as RecordWithScore).score).toBeLessThan(
      (result[0] as RecordWithScore).score
    );
    expect((result[2] as RecordWithScore).score).toBeLessThan(
      (result[1] as RecordWithScore).score
    );
    expect((result[3] as RecordWithScore).score).toBeLessThan(
      (result[2] as RecordWithScore).score
    );
    expect((result[4] as RecordWithScore).score).toBeLessThan(
      (result[3] as RecordWithScore).score
    );
  });
});
