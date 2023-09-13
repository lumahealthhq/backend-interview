const fs = require('fs');

let patientData = [];

try {
  const rawData = fs.readFileSync('./sample-data/patients.json');
  patientData = JSON.parse(rawData);
} catch (error){
  console.error('Error loading patient data:', error);
}

function getPatients(){
  return patientData;
}

function addPatient(newPatient){
  patientData.push(newPatient);
}

module.exports = {
  getPatients,
  addPatient,
};