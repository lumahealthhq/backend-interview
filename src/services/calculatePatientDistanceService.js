import { getDistance } from 'geolib';

class CalculatePatientDistanceService {
  execute({ patients, facilityLatitude, facilityLongitude }) {
    this._validateParams({
      facilityLatitude: facilityLatitude,
      facilityLongitude: facilityLongitude
    })

    return patients.map(patient => {
      const facilityDistance = getDistance(
        { latitude: facilityLatitude, longitude: facilityLongitude },
        { latitude: patient.location.latitude, longitude: patient.location.longitude }
      )

      return {
        ...patient,
        facilityDistance
      }
    })
  }

  _validateParams({ facilityLatitude, facilityLongitude }) {
    if (!this._paramIsMissing(facilityLatitude)) {
      throw new Error('Latitude param is missing');
    }

    if (!this._paramIsMissing(facilityLongitude)) {
      throw new Error('Longitude param is missing');
    }

    const latitudeNumber = Number(facilityLatitude)
    const longitudeNumber = Number(facilityLongitude)

    if (isNaN(latitudeNumber) || latitudeNumber < -90 || latitudeNumber > 90) {
      throw new Error(`Invalid latitude value. It must be a number between -90 and 90.`);
    }

    if (isNaN(longitudeNumber) || longitudeNumber < -180 || longitudeNumber > 180) {
      throw new Error(`Invalid longitude value. It must be a number between -180 and 180.`);
    }
  }

  _paramIsMissing(value) {
    return value !== '' && value !== null && value !== undefined;
  }
}

export default CalculatePatientDistanceService
