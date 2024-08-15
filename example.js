const {PatientModel, PatientScoringAlgorithm} = require('./lib');
const sampleDate = require('./sample-data/patients.json').slice(0, 3);

function main() {
  sampleDate.push({
    id: '541d25c9-9500-4265-8967-240f44ecf723',
    name: 'TOP',
    location: {latitude: '48.7120', longitude: '-60.1170'},
    age: 68,
    acceptedOffers: 96,
    canceledOffers: 23,
    averageReplyTime: 1907,
  });

  const patientScoringAlgorithm = new PatientScoringAlgorithm(sampleDate);
  const result = patientScoringAlgorithm.getPatientList({latitude: '48.7120', longitude: '-60.1170'});
}

main();

