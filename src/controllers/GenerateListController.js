/* eslint-disable class-methods-use-this */
const {
  ComputePatientsDistanceToFacilityService,
  NormalizeDataService,
  ComputeScoreService,
  GenerateListOfPatientsService,
} = require('../services/index');

const patients = require('../../patients.json');

const computePatientsDistanceToFacility = new ComputePatientsDistanceToFacilityService();
const normalizeData = new NormalizeDataService();
const computeScore = new ComputeScoreService();
const generateListOfPatients = new GenerateListOfPatientsService();

class GenerateListController {
  index({ lat, long }) {
    const facilityLocation = { latitude: Number(lat), longitude: Number(long) };

    const patientsWithDistance = computePatientsDistanceToFacility.execute(
      facilityLocation,
      patients,
    );

    const normalizedData = normalizeData.execute(patientsWithDistance);

    const patientsWithScore = computeScore.execute(normalizedData);

    const listOfPatients = generateListOfPatients.execute(patientsWithScore);

    return listOfPatients;
  }
}

module.exports = GenerateListController;
