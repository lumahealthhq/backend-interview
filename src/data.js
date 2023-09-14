import { readFileSync } from 'fs';

let patientData = [];

try {
  const rawData = readFileSync('./sample-data/patients.json');
  patientData = JSON.parse(rawData);
  console.log(patientData)
} catch (error){
  console.error('Error loading patient data:', error);
}

export const getPatients = () => {
  return patientData;
}

export const addPatient = (newPatient) => {
  patientData.push(newPatient);
}
