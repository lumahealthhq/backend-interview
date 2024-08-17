import { getDistance } from 'geolib';

class CalculatePatientDistanceService {
  execute({ patients, facilityLatitude, facilityLongitude }) {
    return patients.map(patient => {
      const facilityDistance = getDistance(
        { latitude:facilityLatitude, longitude:facilityLongitude },
        { latitude:patient.location.latitude, longitude:patient.location.longitude }
      )

      return {
        ...patient,
        facilityDistance
      }
    })
  }
}

export default CalculatePatientDistanceService
