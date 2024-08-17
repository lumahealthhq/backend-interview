import CreatePatientPriorityListService from './createPatientPriorityListService.js';

describe('CreatePatientPriorityListService', () => {
  describe('#execute', () => {
    let service;
    let patients;

    beforeEach(() => {
      service = new CreatePatientPriorityListService();
      patients = [
        { id: 1, score: 9, hasLittleBehaviorData: false },
        { id: 2, score: 8, hasLittleBehaviorData: false },
        { id: 3, score: 7, hasLittleBehaviorData: false },
        { id: 4, score: 2, hasLittleBehaviorData: true },
        { id: 5, score: 1, hasLittleBehaviorData: true }
      ];
    });

    it('should return empty array if scoredPatients is empty', () => {
      const result = service.execute({ scoredPatients: [] });
      expect(result).toEqual([]);
    });

    it('should throw error if listSize is not a positive number', () => {
      expect(() => service.execute({ scoredPatients: patients, listSize: -1 }))
        .toThrow("listSize must be a positive number.");
    });

    it('should throw error if littleBehavioralDataListPercentage is not between 0 and 1', () => {
      expect(() => service.execute({ scoredPatients: patients, littleBehavioralDataListPercentage: 1.5 }))
        .toThrow("littleBehavioralDataListPercentage must be a number between 0 and 1.");
    });

    it('should select the correct number of patients based on listSize', () => {
      const result = service.execute({ scoredPatients: patients, listSize: 3 });
      expect(result.length).toBe(3);
    });

    it('should select the correct number of little behavior patients based on percentage', () => {
      const result = service.execute({ scoredPatients: patients, listSize: 4, littleBehavioralDataListPercentage: 0.5 });
      const littleBehaviorPatients = result.filter(patient => patient.hasLittleBehaviorData);
      expect(littleBehaviorPatients.length).toBe(2);
    });

    it('should maintain the order of scored patients and randomly mix in little behavior patients', () => {
      const result = service.execute({ scoredPatients: patients, listSize: 5, littleBehavioralDataListPercentage: 0.4 });

      // Check that high-score patients are ordered correctly
      const scoredPart = result.filter(patient => !patient.hasLittleBehaviorData);
      expect(scoredPart[0].score).toBeGreaterThanOrEqual(scoredPart[1].score);

      // Check that little behavior patients are included
      const littleBehaviorPart = result.filter(patient => patient.hasLittleBehaviorData);
      expect(littleBehaviorPart.length).toBeGreaterThan(0);
    });

    it('should handle case where littleBehavioralDataListPercentage is 0', () => {
      const result = service.execute({ scoredPatients: patients, listSize: 3, littleBehavioralDataListPercentage: 0 });
      const littleBehaviorPatients = result.filter(patient => patient.hasLittleBehaviorData);

      expect(littleBehaviorPatients.length).toBe(0);
    });

    it('should handle case where littleBehavioralDataListPercentage is 1', () => {
      const result = service.execute({ scoredPatients: patients, listSize: 3, littleBehavioralDataListPercentage: 1 });
      const littleBehaviorPatients = result.filter(patient => patient.hasLittleBehaviorData);
      expect(littleBehaviorPatients.length).toBe(2);
    });

    it('should not exceed listSize in final output', () => {
      const result = service.execute({ scoredPatients: patients, listSize: 3 });
      expect(result.length).toBe(3);
    });
  });
});
