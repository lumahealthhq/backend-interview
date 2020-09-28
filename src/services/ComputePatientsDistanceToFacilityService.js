/* eslint-disable class-methods-use-this */
const geolib = require('geolib');

/**
 * Service responsible for calculating the distance of the patient's location to the facility's
 */

class ComputePatientsDistanceToFacilityService {
  /**
   * Execute the service
   * @param {Object} facilityLocation Object containing the coordinate location of the facility.
   * @param {Object[]} patients List of patients.
   *
   * @returns {Object[]} patientsWithDistanceCalculated List of patients containing distanceToFacility.
   */
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
