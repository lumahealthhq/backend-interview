import { computePatientScore } from '../src/scoring.js';

describe('computePatientScore', () => {
  // Test case 1: Testing with sample input values
  it('calculates patient score correctly with sample input', () => {
    const patient = {
      age: 30,
      acceptedOffers: 10,
      canceledOffers: 2,
      averageReplyTime: 1800,
    };

    const expectedScore = '2.52';

    const result = computePatientScore(patient);

    expect(result).toBe(expectedScore);
  });

  // Test case 2: Testing with different input values
  it('calculates patient score correctly with different input', () => {
    const patient = {
      age: 25,
      acceptedOffers: 8,
      canceledOffers: 3,
      averageReplyTime: 2700,
    };

    const expectedScore = '1.45';

    const result = computePatientScore(patient);

    expect(result).toBe(expectedScore);
  });

});
