import CreatePatientPriorityListFacade from './CreatePatientPriorityListFacade';
import patients from '../sample-data/patients.json' with { "type": "json" }

jest.mock('geolib', () => ({
  getDistance: jest.fn().mockReturnValue(1000)
}))

describe('CreatePatientPriorityListFacade', () => {
  describe('#create', () => {
    let facade;

    beforeEach(() => {
      facade = new CreatePatientPriorityListFacade();
    });

    it('should return a correctly prioritized list of patients', () => {
      const facilityLatitude = 40.7128;
      const facilityLongitude = -74.0060;

      const result = facade.create({
        patients,
        facilityLatitude,
        facilityLongitude,
        listSize: 3,
        littleBehavioralDataListPercentage: 0.3
      });

      const expectedResult = [
        {
          id: '0f784355-09d4-49a5-892c-23d610c62b00',
          name: 'Marielle Conroy',
          location: { latitude: '-8.8599', longitude: '175.1182' },
          age: 65,
          acceptedOffers: 96,
          canceledOffers: 0,
          averageReplyTime: 1830,
          facilityDistance: 1000,
          normalizedData: {
            facilityDistance: 0,
            age: 0.6376811594202898,
            acceptedOffers: 0.96,
            canceledOffers: 0,
            averageReplyTime: 0.5087621696801112
          },
          score: 9,
          hasLittleBehaviorData: false
        },
        {
          id: '87fcd0bf-1381-4604-b801-4fec170ce156',
          name: 'Anastasia Jast',
          location: { latitude: '-57.7905', longitude: '149.3499' },
          age: 80,
          acceptedOffers: 90,
          canceledOffers: 0,
          averageReplyTime: 1626,
          facilityDistance: 1000,
          normalizedData: {
            facilityDistance: 0,
            age: 0.855072463768116,
            acceptedOffers: 0.9,
            canceledOffers: 0,
            averageReplyTime: 0.4520166898470097
          },
          score: 9,
          hasLittleBehaviorData: false
        },
        {
          id: 'b4ffa1b5-a496-47de-af84-9ace7fe4ec6d',
          name: 'Miss Frida Harris',
          location: { latitude: '31.4513', longitude: '20.8874' },
          age: 73,
          acceptedOffers: 88,
          canceledOffers: 2,
          averageReplyTime: 953,
          facilityDistance: 1000,
          normalizedData: {
            facilityDistance: 0,
            age: 0.7536231884057971,
            acceptedOffers: 0.88,
            canceledOffers: 0.02,
            averageReplyTime: 0.2648122392211405
          },
          score: 9,
          hasLittleBehaviorData: false
        }
      ]

      expect(result).toEqual(expectedResult);
      expect(result.length).toBe(3);
    });

    it('should return an empty list if no patients are provided', () => {
      const result = facade.create({
        patients: [],
        facilityLatitude: 40.7128,
        facilityLongitude: -74.0060
      });

      expect(result).toEqual([]);
    });

    it('should correctly prioritize patients with little behavioral data', () => {
      const result = facade.create({
        patients,
        facilityLatitude: 40.7128,
        facilityLongitude: -74.0060,
        listSize: 5,
        littleBehavioralDataListPercentage: 0.4
      });

      const littleBehaviorPatients = result.filter(patient => patient.hasLittleBehaviorData);
      expect(littleBehaviorPatients.length).toEqual(2);
    });
  });
});
