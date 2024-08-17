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
          age: 0.5,
          facilityDistance: 0.8,
          acceptedOffers: 0.9,
          cancelledOffers: 0.2,
          replyTime: 0.7,
        },
      ];

      const result = service.execute(normalizedPatients);

      expect(result[0].score).toEqual(6)
    });

    it('should identify little behavioral data when applicable', () => {
      const normalizedPatients = [
        {
          id: '2',
          age: 0.5,
          facilityDistance: 0.2,
          acceptedOffers: 0.05, // Low accepted offers
          cancelledOffers: 0.95, // High cancelled offers
          replyTime: 0.9, // High reply time
        },
      ];

      const result = service.execute(normalizedPatients);

      expect(result[0].hasLittleBehaviorData).toBe(true);
    });

    it('should not flag little behavioral data when sufficient data is present', () => {
      const normalizedPatients = [
        {
          id: '3',
          age: 0.5,
          facilityDistance: 0.3,
          acceptedOffers: 0.8,
          cancelledOffers: 0.2,
          replyTime: 0.2,
        },
      ];

      const result = service.execute(normalizedPatients);

      expect(result[0].hasLittleBehaviorData).toBe(false);
    });

    it('should handle edge cases with maximum and minimum values', () => {
      const normalizedPatients = [
        {
          id: '4',
          age: 1,
          facilityDistance: 1,
          acceptedOffers: 1,
          cancelledOffers: 0,
          replyTime: 0,
        },
      ];

      const result = service.execute(normalizedPatients);

      expect(result[0].score).toEqual(9); 
    });
  });
});
