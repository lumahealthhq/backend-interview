const {PatientModel, PatientScoringAlgorithm} = require('./lib');
const sampleDate = require('./sample-data/patients.json');

function main() {
  const patientScoringAlgorithm = new PatientScoringAlgorithm(sampleDate);

  const result = patientScoringAlgorithm.calculateScore(sampleDate[0].location);
}

main();

