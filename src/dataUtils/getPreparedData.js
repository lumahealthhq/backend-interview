/**
 * This file takes the sample patient data and:
 *  1. transforms it into what tensorFlow is expecting (array of arrays),
 *  2. Separates patients with insufficient data to be handled later
 */

const patientDataSet = require("../../sample-data/patients.json");
const getDistanceToPractice = require("./getDistanceToPractice");

const patientsWithInsufficientData = [];
const patientsWithSufficientData = [];
const trainingFeatures = [];
const trainingTarget = [];

/**
 * Verify patient data is sufficient for training set
 * also verify that the lat & long values are within range
 * @param {number} totalOffers
 */
function verifyPatientData(totalOffers, lat, long) {
  const hasSufficientOffers = totalOffers > 30; // min number of offers needed to train model
  let hasCorrectCoordinates = true;
  if (lat < -90 || lat > 90 || long < -180 || long > 180) {
    hasCorrectCoordinates = false;
  }
  return hasCorrectCoordinates && hasSufficientOffers;
}

/**
 * Build training set for TensorFlow
 *  Clean data by removing patients with insufficient data
 * @param {number} practiceLat
 * @param {number} practiceLong
 */
function prepareTrainingSet(practiceLat, practiceLong) {
  patientDataSet.forEach(patient => {
    const totalOffers = patient.acceptedOffers + patient.canceledOffers;
    const patientHasSufficientData = verifyPatientData(
      totalOffers,
      practiceLat,
      practiceLong
    );

    // if the patient does not have sufficient data,
    // handle differently and return early
    if (!patientHasSufficientData) {
      return patientsWithInsufficientData.push(patient);
    }
    // otherwise, add patient to training set
    patient.probOfAccepting = patient.acceptedOffers / totalOffers;
    patient.distanceToPractice = getDistanceToPractice(
      practiceLat,
      practiceLong,
      patient.location.latitude,
      patient.location.longitude
    );
    return patientsWithSufficientData.push(patient);
  });
  cleanTrainingData();
  return {
    trainingFeatures,
    trainingTarget,
    testFeatures: trainingFeatures,
    testTarget: trainingTarget,
    numFeatures: 5,
    patientsWithSufficientData,
    patientsWithInsufficientData
  };
}

function cleanTrainingData() {
  // we need to transform the patientsWithSufficientData to be an array of arrays
  // we also need to strip fields that the regression model is not expecting
  patientsWithSufficientData.forEach(patient => {
    trainingFeatures.push([
      patient.distanceToPractice,
      patient.age,
      patient.acceptedOffers,
      patient.canceledOffers,
      patient.averageReplyTime
    ]);
    trainingTarget.push([patient.probOfAccepting]);
  });
}

function getDataForExport() {
  // Below I am assigning test sets to training set values
  // however, these should be different values in a real application
  // This results in overfitting out model, but will work for now.
  return {
    trainingFeatures,
    trainingTarget,
    testFeatures: trainingFeatures,
    testTarget: trainingTarget,
    numFeatures: 5,
    patientsWithSufficientData,
    patientsWithInsufficientData
  };
}

module.exports = prepareTrainingSet;
