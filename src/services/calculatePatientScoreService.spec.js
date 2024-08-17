import CalculatePatientScoreService from './calculatePatientScoreService.js';

describe('CalculatePatientScoreService', () => {
  describe('#execute', () => {
    let service;

    beforeEach(() => {
      service = new CalculatePatientScoreService();
    });

    it('should correctly calculate score with positive and negative impact fields', () => {
      const normalizedPatients = [
        {
          id: '1',
          normalizedData: {
            age: 0.5,
            facilityDistance: 0.8,
            acceptedOffers: 0.9,
            canceledOffers: 0.2,
            averageReplyTime: 0.7,
          }
        },
      ];

      const result = service.execute(normalizedPatients);

      expect(result[0].score).toEqual(6)
    });

    it('should identify little behavioral data when applicable', () => {
      const normalizedPatients = [
        {
          id: '2',
          normalizedData: {
            age: 0.5,
            facilityDistance: 0.2,
            acceptedOffers: 0.05, // Low accepted offers
            canceledOffers: 0.95, // High cancelled offers
            averageReplyTime: 0.9, // High reply time
          }
        },
      ];

      const result = service.execute(normalizedPatients);

      expect(result[0].hasLittleBehaviorData).toBe(true);
    });

    it('should not flag little behavioral data when sufficient data is present', () => {
      const normalizedPatients = [
        {
          id: '3',
          normalizedData: {
            age: 0.5,
            facilityDistance: 0.3,
            acceptedOffers: 0.8,
            canceledOffers: 0.2,
            averageReplyTime: 0.2,
          }
        },
      ];

      const result = service.execute(normalizedPatients);

      expect(result[0].hasLittleBehaviorData).toBe(false);
    });

    it('should handle edge cases with maximum and minimum values', () => {
      const normalizedPatients = [
        {
          id: '4',
          normalizedData: {
            age: 1,
            facilityDistance: 1,
            acceptedOffers: 1,
            canceledOffers: 0,
            averageReplyTime: 0,
          }
        },
      ];

      const result = service.execute(normalizedPatients);

      expect(result[0].score).toEqual(9);
    });
  });
});
