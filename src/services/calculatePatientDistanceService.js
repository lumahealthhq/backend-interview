import { getDistance } from 'geolib';

class CalculatePatientDistanceService {
  execute({ facilityLatitude, facilityLongitude, patientLatitude, patientLongitude }) {
    return getDistance(
      { latitude: facilityLatitude, longitude: facilityLongitude },
      { latitude: patientLatitude, longitude: patientLongitude }
    )
  }
}

export default CalculatePatientDistanceService
