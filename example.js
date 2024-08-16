//  Import Library
const {PatientScoringAlgorithm} = require('./lib');

//  Import Patients Sample Data
const sampleDate = require('./sample-data/patients.json');

//  Create a new instance of PatientScoringAlgorithm using the sample data
const patientScoringAlgorithm = new PatientScoringAlgorithm({dataset: sampleDate});

//  Get the patient list
const result = patientScoringAlgorithm.getPatientList({latitude: '48.7120', longitude: '-60.1170'});
console.table(result);
