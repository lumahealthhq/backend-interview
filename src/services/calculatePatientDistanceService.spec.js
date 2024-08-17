import CalculatePatientDistanceService from "./calculatePatientDistanceService.js";
import * as geolib from 'geolib';

jest.mock('geolib')

describe('CalculatePatientDistanceService', () => {
  describe('#execute', () => {
    let service;

    beforeEach(() => {
      service = new CalculatePatientDistanceService();
    });

    it('should return correct distance', () => {
      const patients = [{
        id: 1,
        name: "Samir Pacocha",
        location: {
          latitude: "46.7110",
          longitude: "-63.1150"
        },
        age: 46,
        acceptedOffers: 49,
        canceledOffers: 92,
        averageReplyTime: 2598
      }]

      const mockDistance = 5000
      jest.spyOn(geolib, 'getDistance').mockReturnValue(mockDistance)

      const result = service.execute({
        patients,
        facilityLatitude: -86.9857, 
        facilityLongitude: -127.4535
      })

      expect(result[0].facilityDistance).toEqual(mockDistance)
    });

    it('should throw an error if facilityLatitude or facilityLongitude is missing', () => {
      expect(() => service._validateParams({ facilityLatitude: null, facilityLongitude: -122.4194 }))
        .toThrow('Facility location params is missing');
      expect(() => service._validateParams({ facilityLatitude: 37.7749, facilityLongitude: undefined }))
        .toThrow('Facility location params is missing');
    });

    it('should throw an error if facilityLatitude is out of range', () => {
      expect(() => service._validateParams({ facilityLatitude: 100, facilityLongitude: -122.4194 }))
        .toThrow('Invalid latitude value. It must be a number between -90 and 90.');
      expect(() => service._validateParams({ facilityLatitude: -100, facilityLongitude: -122.4194 }))
        .toThrow('Invalid latitude value. It must be a number between -90 and 90.');
    });

    it('should throw an error if facilityLongitude is out of range', () => {
      expect(() => service._validateParams({ facilityLatitude: 37.7749, facilityLongitude: 200 }))
        .toThrow('Invalid longitude value. It must be a number between -180 and 180.');
      expect(() => service._validateParams({ facilityLatitude: 37.7749, facilityLongitude: -200 }))
        .toThrow('Invalid longitude value. It must be a number between -180 and 180.');
    });
  });
});