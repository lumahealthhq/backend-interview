import NormalizePatientDataService from './normalizePatientDataService.js';

describe('NormalizePatientDataService', () => {
  describe('#execute', () => {
    let normalizePatientDataService;

    beforeEach(() => {
      normalizePatientDataService = new NormalizePatientDataService();
    });

    it('should normalize all patient fields correctly', () => {
      const patients = [
        {
          facilityDistance: 10,
          age: 25,
          acceptedOffers: 5,
          canceledOffers: 0,
          averageReplyTime: 120,
        },
        {
          facilityDistance: 20,
          age: 35,
          acceptedOffers: 10,
          canceledOffers: 10,
          averageReplyTime: 60,
        },
        {
          facilityDistance: 15,
          age: 30,
          acceptedOffers: 4,
          canceledOffers: 2,
          averageReplyTime: 90,
        },
      ];

      const patientDataRange = {
        facilityDistance: { min: 10, max: 20 },
        age: { min: 25, max: 35 },
        acceptedOffers: { min: 0, max: 10 },
        canceledOffers: { min: 0, max: 10 },
        averageReplyTime: { min: 60, max: 120 },
      };

      const normalizedPatients = normalizePatientDataService.execute({
        patients,
        patientDataRange,
      });

      const expectedNormalizedPatients = [
        {
          ...patients[0],
          normalizedData: {
            facilityDistance: 0,
            age: 0,
            acceptedOffers: 0.5,
            canceledOffers: 0,
            averageReplyTime: 1,
          }
        },
        {
          ...patients[1],
          normalizedData: {
            facilityDistance: 1,
            age: 1,
            acceptedOffers: 1,
            canceledOffers: 1,
            averageReplyTime: 0,
          }
        },
        {
          ...patients[2],
          normalizedData: {
            facilityDistance: 0.5,
            age: 0.5,
            acceptedOffers: 0.4,
            canceledOffers: 0.2,
            averageReplyTime: 0.5,
          }
        },
      ];

      expect(normalizedPatients).toEqual(expectedNormalizedPatients);
    });

    it('should return 0 for all fields if min and max are the same', () => {
      const patients = [
        {
          facilityDistance: 10,
          age: 25,
          acceptedOffers: 3,
          canceledOffers: 1,
          averageReplyTime: 120,
        },
        {
          facilityDistance: 10,
          age: 25,
          acceptedOffers: 3,
          canceledOffers: 1,
          averageReplyTime: 120,
        },
      ];

      const patientDataRange = {
        facilityDistance: { min: 10, max: 10 },
        age: { min: 25, max: 25 },
        acceptedOffers: { min: 3, max: 3 },
        canceledOffers: { min: 1, max: 1 },
        averageReplyTime: { min: 120, max: 120 },
      };

      const normalizedPatients = normalizePatientDataService.execute({
        patients,
        patientDataRange,
      });

      const expectedNormalizedPatients = [
        {
          ...patients[0],
          normalizedData: {
            facilityDistance: 0,
            age: 0,
            acceptedOffers: 0,
            canceledOffers: 0,
            averageReplyTime: 0,
          }
        },
        {
          ...patients[1],
          normalizedData: {
            facilityDistance: 0,
            age: 0,
            acceptedOffers: 0,
            canceledOffers: 0,
            averageReplyTime: 0,
          }
        }
      ];

      expect(normalizedPatients).toEqual(expectedNormalizedPatients);
    });

    it('should handle an empty patients array', () => {
      const patients = [];

      const patientDataRange = {
        facilityDistance: { min: 10, max: 20 },
        age: { min: 25, max: 35 },
        acceptedOffers: { min: 3, max: 5 },
        canceledOffers: { min: 1, max: 3 },
        averageReplyTime: { min: 60, max: 120 },
      };

      const normalizedPatients = normalizePatientDataService.execute({
        patients,
        patientDataRange,
      });

      expect(normalizedPatients).toEqual([]);
    });

    it('should handle patients with missing fields', () => {
      const patients = [
        { facilityDistance: 10, age: 25 },
        { acceptedOffers: 5, canceledOffers: 3 },
      ];

      const patientDataRange = {
        facilityDistance: { min: 10, max: 20 },
        age: { min: 25, max: 35 },
        acceptedOffers: { min: 3, max: 5 },
        canceledOffers: { min: 1, max: 3 },
        averageReplyTime: { min: 60, max: 120 },
      };

      const normalizedPatients = normalizePatientDataService.execute({
        patients,
        patientDataRange,
      });

      const expectedNormalizedPatients = [
        {
          ...patients[0],
          normalizedData: {
            facilityDistance: 0,
            age: 0,
          },
        },
        {
          ...patients[1],
          normalizedData: {
            acceptedOffers: 1,
            canceledOffers: 1,
          },
        }
      ];

      expect(normalizedPatients).toEqual(expectedNormalizedPatients);
    });
  });
});
