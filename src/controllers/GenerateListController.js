/* eslint-disable class-methods-use-this */
const {
  ComputePatientsDistanceToFacilityService,
  NormalizeDataService,
  ComputeScoreService,
  GenerateListOfPatientsService,
} = require('../services/index');

const patients = require('../../patients.json');

// Creating the instances of each service
const computePatientsDistanceToFacility = new ComputePatientsDistanceToFacilityService();
const normalizeData = new NormalizeDataService();
const computeScore = new ComputeScoreService();
const generateListOfPatients = new GenerateListOfPatientsService();

/**
 * Controller responsible for wrapping all services to generate the list of promising patients to attend the appointment
 */

class GenerateListController {
  /**
   * Returns the 10 most promising patients to attend the appointment given the facility location
   * Execute the service
   * @param {String} lat latitude of the facility location
   * @param {String} long longitude of the facility location
   * @returns {Object[]} listOfPatients List of the top 10 promising patients to attend the appointment
   */
  index({ lat, long }) {
    const facilityLocation = { latitude: Number(lat), longitude: Number(long) };

    // Executing the ComputePatientsDistanceToFacilityService
    const patientsWithDistance = computePatientsDistanceToFacility.execute(
      facilityLocation,
      patients,
    );

    // Executing the NormalizeDataService
    const normalizedData = normalizeData.execute(patientsWithDistance);

    // Executing the ComputeScoreService
    const patientsWithScore = computeScore.execute(normalizedData);

    // Executing the GenerateListOfPatientsService
    const listOfPatients = generateListOfPatients.execute(patientsWithScore);

    return listOfPatients;
  }
}

module.exports = GenerateListController;
