import CalculatePatientDistanceService from "./calculatePatientDistanceService.js";
import * as geolib from 'geolib';

jest.mock('geolib')

describe('CalculatePatientDistanceService', () => {
  describe('#execute', () => {
    it('should return correct distance', () => {
      const mockDistance = 5000
      jest.spyOn(geolib, 'getDistance').mockReturnValue(mockDistance)

      const distanceData = { 
        facilityLatitude: -86.9857, facilityLongitude: -127.4535, 
        patientLatitude: -40.8377, patientLongitude: 79.4492 
      }

      const calculatePatientDistanceService = new CalculatePatientDistanceService()

      expect(calculatePatientDistanceService.execute(distanceData)).toEqual(mockDistance)
    });
  });
});