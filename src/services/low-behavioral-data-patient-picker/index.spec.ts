import { lowBehavioralDataPatientPicker } from '.';
import { TPatientRecord } from '../../types/patient-record';

describe('service: log behavioral data patient picker', () => {
  it('should return 10 patients with low behavioral data from the list', () => {
    const records = [
      {
        acceptedOffers: 6,
        canceledOffers: 6,
      },
      {
        acceptedOffers: 2,
        canceledOffers: 2,
      },
      {
        acceptedOffers: 200,
        canceledOffers: 200,
      },
      {
        acceptedOffers: 300,
        canceledOffers: 300,
      },
      {
        acceptedOffers: 4,
        canceledOffers: 4,
      },
      {
        acceptedOffers: 1,
        canceledOffers: 1,
      },
      {
        acceptedOffers: 100,
        canceledOffers: 100,
      },
      {
        acceptedOffers: 400,
        canceledOffers: 400,
      },
      {
        acceptedOffers: 7,
        canceledOffers: 7,
      },
      {
        acceptedOffers: 5,
        canceledOffers: 5,
      },
      {
        acceptedOffers: 500,
        canceledOffers: 500,
      },
      {
        acceptedOffers: 3,
        canceledOffers: 3,
      },
      {
        acceptedOffers: 600,
        canceledOffers: 600,
      },
      {
        acceptedOffers: 800,
        canceledOffers: 800,
      },
      {
        acceptedOffers: 700,
        canceledOffers: 700,
      },
      {
        acceptedOffers: 8,
        canceledOffers: 8,
      },
      {
        acceptedOffers: 9,
        canceledOffers: 9,
      },
      {
        acceptedOffers: 900,
        canceledOffers: 900,
      },
      {
        acceptedOffers: 10,
        canceledOffers: 10,
      },
      {
        acceptedOffers: 1000,
        canceledOffers: 1000,
      },
    ];

    const result = lowBehavioralDataPatientPicker(records as TPatientRecord[]);

    expect(result).toHaveLength(10);
    expect((result[0] as TPatientRecord).acceptedOffers).toBeLessThan(
      (result[1] as TPatientRecord).acceptedOffers
    );
    expect((result[0] as TPatientRecord).canceledOffers).toBeLessThan(
      (result[1] as TPatientRecord).canceledOffers
    );
    expect((result[1] as TPatientRecord).acceptedOffers).toBeLessThan(
      (result[2] as TPatientRecord).acceptedOffers
    );
    expect((result[1] as TPatientRecord).canceledOffers).toBeLessThan(
      (result[2] as TPatientRecord).canceledOffers
    );
    expect((result[2] as TPatientRecord).acceptedOffers).toBeLessThan(
      (result[3] as TPatientRecord).acceptedOffers
    );
    expect((result[2] as TPatientRecord).canceledOffers).toBeLessThan(
      (result[3] as TPatientRecord).canceledOffers
    );
    expect((result[3] as TPatientRecord).acceptedOffers).toBeLessThan(
      (result[4] as TPatientRecord).acceptedOffers
    );
    expect((result[3] as TPatientRecord).canceledOffers).toBeLessThan(
      (result[4] as TPatientRecord).canceledOffers
    );
    expect((result[4] as TPatientRecord).acceptedOffers).toBeLessThan(
      (result[5] as TPatientRecord).acceptedOffers
    );
    expect((result[4] as TPatientRecord).canceledOffers).toBeLessThan(
      (result[5] as TPatientRecord).canceledOffers
    );
    expect((result[5] as TPatientRecord).acceptedOffers).toBeLessThan(
      (result[6] as TPatientRecord).acceptedOffers
    );
    expect((result[5] as TPatientRecord).canceledOffers).toBeLessThan(
      (result[6] as TPatientRecord).canceledOffers
    );
    expect((result[6] as TPatientRecord).acceptedOffers).toBeLessThan(
      (result[7] as TPatientRecord).acceptedOffers
    );
    expect((result[6] as TPatientRecord).canceledOffers).toBeLessThan(
      (result[7] as TPatientRecord).canceledOffers
    );
    expect((result[7] as TPatientRecord).acceptedOffers).toBeLessThan(
      (result[8] as TPatientRecord).acceptedOffers
    );
    expect((result[7] as TPatientRecord).canceledOffers).toBeLessThan(
      (result[8] as TPatientRecord).canceledOffers
    );
    expect((result[8] as TPatientRecord).acceptedOffers).toBeLessThan(
      (result[9] as TPatientRecord).acceptedOffers
    );
    expect((result[8] as TPatientRecord).canceledOffers).toBeLessThan(
      (result[9] as TPatientRecord).canceledOffers
    );
  });
});
