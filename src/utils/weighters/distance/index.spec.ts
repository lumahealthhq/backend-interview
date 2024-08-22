import { byDistance } from '.';
import { TPatientRecordWithScore } from '../../../types/patient-record';

describe('weighters: distance', () => {
  it('should weight a list of records by their distance to a given point', () => {
    const records = [
      {
        location: {
          longitude: 1,
          latitude: 1,
        },
        score: 0,
      },
      {
        location: {
          longitude: 7,
          latitude: 5,
        },
        score: 0,
      },
      {
        location: {
          longitude: 9,
          latitude: 9,
        },
        score: 0,
      },
      {
        location: {
          longitude: 11,
          latitude: 15,
        },
        score: 0,
      },
      {
        location: {
          longitude: 11,
          latitude: 16,
        },
        score: 0,
      },
    ];

    const result = byDistance(records as unknown as TPatientRecordWithScore[], {
      latitude: 0,
      longitude: 0,
    });

    expect((result[0] as TPatientRecordWithScore).score).toBeGreaterThan(
      (result[1] as TPatientRecordWithScore).score
    );
    expect((result[1] as TPatientRecordWithScore).score).toBeGreaterThan(
      (result[2] as TPatientRecordWithScore).score
    );
    expect((result[2] as TPatientRecordWithScore).score).toBeGreaterThan(
      (result[3] as TPatientRecordWithScore).score
    );
    expect((result[3] as TPatientRecordWithScore).score).toBeGreaterThan(
      (result[4] as TPatientRecordWithScore).score
    );
    expect((result[4] as TPatientRecordWithScore).score).toBe(0);
  });
});
