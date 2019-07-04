/**
 * This file exports a function with three parameters
 * @function getPatientCallList(lat,long,numberOfPatients)
 * @param {string} lat - lattitude of the practice
 * @param {string} long - longitude of the practice
 * @param {string} numberOfPatients - how many patients to return on the call list. default = 10
 *
 *
 * @returns {Array} an array of patient objects (default = empty array)
 *  that represents the patients that are most likely to accept the appointment offer.
 *  Each Patient object contains Name, ID, and Score (0-10)
 *
 *  If there are patients with insufficient data to predict the likelyhood of accepting an offer
 *  they are given a score of -1, and one is randomly selected and put at the top of the list.
 *
 */

const tfRegression = require("./tfLinearRegression");
const getPreparedData = require("./dataUtils/getPreparedData");

/**
 * Function that returns a list of the patients that are most likely
 *  to accept the appointment offer
 * @name getPatientCallList
 * @function
 *
 * @param {string} lat - latitude of the practice
 * @param {string} long - longitude of the practice
 * @param {number} numberOfPatients - the requested length of the list
 */
async function getPatientCallList(lat, long, numberOfPatients = 10) {
  const bestFitPatientList = [];
  const preparedData = await getPreparedData(lat, long, numberOfPatients);
  const insufficientDataList = preparedData.patientsWithInsufficientData;
  const rankedPatients = await tfRegression(preparedData);

  rankedPatients.sort((a, b) => {
    a.prediction > b.prediction ? -1 : 1;
  });

  if (insufficientDataList.length) {
    // if there are patients with insufficient data,
    // decrease the number of requested patients by 1
    numberOfPatients = numberOfPatients - 1;
    // randomly select a patient with insufficient data
    // and add it to the top of the bestFitPatientList list
    bestFitPatientList.push(
      insufficientDataList[
        Math.floor(Math.random() * insufficientDataList.length)
      ]
    );
    bestFitPatientList[0].prediction = -1; // set the prediction to a negative value (aka no predictive value)
  }
  // create the patient list and convert the prediction to a 1 to 10 scale
  return bestFitPatientList
    .concat(rankedPatients.slice(0, numberOfPatients))
    .map((patient, index) => {
      return {
        id: patient.id,
        name: patient.name,
        ranking: patient.prediction == -1 ? -1 : index + 1
      };
    });
}

module.exports = getPatientCallList;
