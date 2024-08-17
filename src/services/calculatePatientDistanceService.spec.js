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
  });
});