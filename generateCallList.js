/** 
 * @param {number} facilityLat
 * @param {number} facilityLong
 * @param {string} filePath - .json file of all the patients at the facility
 * @returns {Promise} - array of 10 patient objects. An ordered list of 10 patients who will most likely accept the appointment offer. should be also based on their fifo order of when they called in (entered on to the waitlist). if a patient doesn't have much behavior data, should be randomly added to the top list to give them a chance to be selected
*/
const Promise = require('bluebird');
const calculatePatientScores = require('./calculateScore.js').calculatePatientScores;

const generateCallList = (facilityLat, facilityLong, filePath) => {
  const results = []; //10 patients ordered in most likely to accept
  const resultSize = 10;

  return new Promise ((resolve) => {
    calculatePatientScores(facilityLat, facilityLong, filePath)
    .then((patients) => {
      patients.sufficientData.sort((a, b) => {
        return b.score - a.score;
      });
   
      let numOfPatients = patients.insufficientData.length + patients.sufficientData.length;

      for (var i = 0; i < Math.min(resultSize, numOfPatients) ; i++) {
        //special treatment: patient with not enough behavioral data
        if (i % 2 === 1 && patients.insufficientData.length > 0) {
          results.push(patients.insufficientData.shift());
          continue;
        }
        results.push(patients.sufficientData.shift())
      }
      resolve(results);
    })
  });
}

module.exports = {
  generateCallList,
}