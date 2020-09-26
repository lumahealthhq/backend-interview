/* eslint-disable class-methods-use-this */
const geolib = require('geolib');

class ComputePatientsDistanceToFacilityService {
  execute({ latitude, longitude }, patients) {
    const patientsWithDistanceCalculated = patients.map(patient => {
      const distanceToFacility = geolib.getDistance(
        {
          latitude,
          longitude,
        },
        {
          latitude: patient.location.latitude,
          longitude: patient.location.longitude,
        },
      );
      return { ...patient, distanceToFacility };
    });
    return patientsWithDistanceCalculated;
  }
}

module.exports = ComputePatientsDistanceToFacilityService;
