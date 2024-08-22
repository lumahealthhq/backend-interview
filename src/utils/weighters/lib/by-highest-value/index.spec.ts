import { byHighestValue } from '.';
import { RecordWithScore } from '../../types';

describe('weighter lib: by highest value', () => {
  it('should weight the records by the highest value of a given field in the set', () => {
    const records: RecordWithScore[] = [
      {
        acceptedOffers: 35,
        score: 0,
      },
      {
        acceptedOffers: 22,
        score: 0,
      },
      {
        acceptedOffers: 15,
        score: 0,
      },
      {
        acceptedOffers: 12,
        score: 0,
      },
      {
        acceptedOffers: 10,
        score: 0,
      },
    ];

    const result = byHighestValue(records, 'acceptedOffers', 0.3);

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
