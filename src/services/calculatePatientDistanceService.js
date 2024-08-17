import { getDistance } from 'geolib';

class CalculatePatientDistanceService {
  execute({ patients, facilityLatitude, facilityLongitude }) {
    this._validateParams({
      facilityLatitude: Number(facilityLatitude),
      facilityLongitude: Number(facilityLongitude)
    })

    return patients.map(patient => {
      const facilityDistance = getDistance(
        { latitude: Number(facilityLatitude), longitude: Number(facilityLongitude) },
        { latitude: patient.location.latitude, longitude: patient.location.longitude }
      )

      return {
        ...patient,
        facilityDistance
      }
    })
  }

  _validateParams({ facilityLatitude, facilityLongitude }) {
    if (!facilityLatitude || !facilityLongitude) {
      throw new Error('Facility location params is missing')
    }

    if (typeof facilityLatitude !== 'number' || facilityLatitude < -90 || facilityLatitude > 90) {
      throw new Error(`Invalid latitude value. It must be a number between -90 and 90.`);
    }

    if (typeof facilityLongitude !== 'number' || facilityLongitude < -180 || facilityLongitude > 180) {
      throw new Error(`Invalid longitude value. It must be a number between -180 and 180.`);
    }
  }
}

export default CalculatePatientDistanceService
