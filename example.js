const {PatientScoringAlgorithm} = require('./lib');
const sampleDate = require('./sample-data/patients.json');

function main() {
  const patientScoringAlgorithm = new PatientScoringAlgorithm(sampleDate);
  const result = patientScoringAlgorithm.getPatientList({latitude: '48.7120', longitude: '-60.1170'});

  console.table(result);
}

main();

