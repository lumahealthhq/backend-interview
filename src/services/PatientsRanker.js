const PatientScorer = require('./PatientScorer');
const ScoreNormalizer = require('../utils/ScoreNormalizer');

class PatientRanker {
  call(patients, facilityLocation) {
    return this.mountOrderedList(patients, facilityLocation);
  }

  mountOrderedList(patients, facilityLocation) {
    const patientsWithScore = this.scoreAllPatients(patients, facilityLocation);
    const orderedList = this.sortPatients(patientsWithScore);
    const limitedOrderedList = orderedList.slice(
      orderedList.length - 10,
      orderedList.length
    );

    const maxScore = limitedOrderedList[limitedOrderedList.length - 1].score;
    const minScore = limitedOrderedList[0].score;

    const normalizedList = limitedOrderedList.map(patient => {
      Object.assign(patient, {
        score: ScoreNormalizer.call(patient.score, maxScore, minScore),
      });

      return patient;
    });

    return normalizedList;
  }

  sortPatients(patientsWithScore) {
    patientsWithScore.sort((a, b) => (a.score > b.score ? 1 : -1));

    return patientsWithScore;
  }

  scoreAllPatients(patients, facilityLocation) {
    return patients.map(patient => {
      const score = PatientScorer.call(patient, facilityLocation);
      Object.assign(patient, { score });

      return patient;
    });
  }
}

// If you want to test the service alone, just uncomment these lines.
// const patients = PatientsGenerator.call(15);
// const facilityLocation = { latitude: '-10.7420', longitude: '-143.9456' };
// console.log(new PatientRanker().call(patients, facilityLocation));

module.exports = new PatientRanker();
