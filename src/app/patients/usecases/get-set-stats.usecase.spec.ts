import getSetStatsUsecase, { SetStats } from './get-set-stats.usecase';
import Patient from '../../../@types/patient';

// Mock the median function
jest.mock('../../../utils/math/median', () => ({
  __esModule: true,
  default: jest.fn((arr) => arr.sort((a: any, b: any) => a - b)[Math.floor(arr.length / 2)])
}));

describe('getSetStatsUsecase', () => {
  const mockPatients: Patient[] = [
    {
      id: '1',
      name: 'John Doe',
      location: { latitude: 40.7128, longitude: -74.0060 },
      age: 30,
      acceptedOffers: 5,
      canceledOffers: 2,
      averageReplyTime: 120
    },
    {
      id: '2',
      name: 'Jane Smith',
      location: { latitude: 34.0522, longitude: -118.2437 },
      age: 25,
      acceptedOffers: 3,
      canceledOffers: 1,
      averageReplyTime: 90
    },
    {
      id: '3',
      name: 'Bob Johnson',
      location: { latitude: 41.8781, longitude: -87.6298 },
      age: 40,
      acceptedOffers: 8,
      canceledOffers: 3,
      averageReplyTime: 150
    }
  ];

  it('should calculate correct statistics', () => {
    const result: SetStats = getSetStatsUsecase(mockPatients);

    // Test age statistics
    expect(result.age.mean).toBeCloseTo(31.67, 0);
    expect(result.age.std).toBeCloseTo(6.23, 0);

    // Test offer statistics
    expect(result.offer.mean).toBeCloseTo(0.7, 0);
    expect(result.offer.std).toBeCloseTo(0.0033, 0);
    expect(result.offer.meanNumberOfOffers).toBeCloseTo(7.33, 0);
    expect(result.offer.medianAcceptance).toBeCloseTo(0.75, 0);

    // Test reply time statistics
    expect(result.replyTime.mean).toBeCloseTo(120, 0);
    expect(result.replyTime.std).toBeCloseTo(24.49, 0);

    // Test location statistics
    expect(result.location.latMean).toBeCloseTo(38.88, 0);
  });

  it('should handle empty patient array', () => {
    const result: SetStats = getSetStatsUsecase([]);

    expect(result.age.mean).toBe(0);
    expect(result.age.std).toBe(0);
    expect(result.offer.mean).toBe(0);
    expect(result.offer.std).toBe(0);
    expect(result.offer.meanNumberOfOffers).toBe(0);
    expect(result.offer.medianAcceptance).toBe(0);
    expect(result.replyTime.mean).toBe(0);
    expect(result.replyTime.std).toBe(0);
    expect(result.location.latMean).toBe(0);
  });
});
