// Import the function to test
import { computePatientScore } from './your-module'; // Replace './your-module' with the actual path to your module

// Describe a test suite for the computePatientScore function
describe('computePatientScore', () => {
  // Test case 1: Testing with sample input values
  it('calculates patient score correctly with sample input', () => {
    const patient = {
      age: 30,
      acceptedOffers: 10,
      canceledOffers: 2,
      averageReplyTime: 1800, // 30 minutes in seconds
    };

    const expectedScore = '2.95'; // The expected score after calculation

    const result = computePatientScore(patient);

    expect(result).toBe(expectedScore);
  });

  // Test case 2: Testing with different input values
  it('calculates patient score correctly with different input', () => {
    const patient = {
      age: 25,
      acceptedOffers: 8,
      canceledOffers: 3,
      averageReplyTime: 2700, // 45 minutes in seconds
    };

    const expectedScore = '2.25'; // The expected score after calculation

    const result = computePatientScore(patient);

    expect(result).toBe(expectedScore);
  });

  // Add more test cases as needed to cover different scenarios
});
