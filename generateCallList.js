/* 
input: facility's location
output: ordered list of 10 patients who will most likely accept the appointment offer. should be also based on their fifo order of when they called in (entered on to the waitlist)
*/
const Promise = require('bluebird');
const calculatePatientScores = require('./calculateScore.js').calculatePatientScores;

const generateCallList = (facilityLat, facilityLong) => {
  const results = []; //10 patients ordered in most likely to accept
  const resultSize = 10;

  return new Promise ((resolve) => {
    calculatePatientScores(facilityLat, facilityLong)
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

generateCallList('46.7110', '-63.1150')
.then((result) => {
  console.log(result)
})