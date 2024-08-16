import CalculatePatientDataRangeService from './calculatePatientDataRangeService.js';

describe('CalculateDataRangeService', () => {
  let calculateDataRangeService;

  beforeEach(() => {
    calculateDataRangeService = new CalculatePatientDataRangeService();
  });

  it('should initialize dataRange with correct min and max values', () => {
    const expectedDataRange = {
      facilityDistance: { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
      age: { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
      acceptedOffers: { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
      canceledOffers: { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
      averageReplyTime: { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
    };

    expect(calculateDataRangeService.dataRange).toEqual(expectedDataRange);
  });

  describe('#execute', () => {
    it('should calculate correct min and max values for patients', () => {
      const patients = [
        {
          facilityDistance: 10,
          age: 25,
          acceptedOffers: 3,
          canceledOffers: 1,
          averageReplyTime: 2,
        },
        {
          facilityDistance: 20,
          age: 35,
          acceptedOffers: 5,
          canceledOffers: 2,
          averageReplyTime: 1,
        },
        {
          facilityDistance: 15,
          age: 30,
          acceptedOffers: 4,
          canceledOffers: 0,
          averageReplyTime: 3,
        },
      ];

      const expectedDataRange = {
        facilityDistance: { min: 10, max: 20 },
        age: { min: 25, max: 35 },
        acceptedOffers: { min: 3, max: 5 },
        canceledOffers: { min: 0, max: 2 },
        averageReplyTime: { min: 1, max: 3 },
      };

      const dataRange = calculateDataRangeService.execute(patients);
      expect(dataRange).toEqual(expectedDataRange);
    });

    it('should handle an empty patients array', () => {
      const patients = [];
      const expectedDataRange = {
        facilityDistance: { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
        age: { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
        acceptedOffers: { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
        canceledOffers: { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
        averageReplyTime: { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
      };

      const dataRange = calculateDataRangeService.execute(patients);

      expect(dataRange).toEqual(expectedDataRange);
    });

    it('should handle patients with missing fields', () => {
      const patients = [
        {
          facilityDistance: 10,
          age: 25,
          acceptedOffers: 3,
          canceledOffers: 1,
        },
        {
          facilityDistance: 20,
          averageReplyTime: 1,
        },
      ];

      const expectedDataRange = {
        facilityDistance: { min: 10, max: 20 },
        age: { min: 25, max: 25 },
        acceptedOffers: { min: 3, max: 3 },
        canceledOffers: { min: 1, max: 1 },
        averageReplyTime: { min: 1, max: 1 },
      };

      const dataRange = calculateDataRangeService.execute(patients);

      expect(dataRange).toEqual(expectedDataRange);
    });
  });
});
