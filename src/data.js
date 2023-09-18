import { readFileSync } from 'fs';

let patientData = [];

try {
  const rawData = readFileSync('./sample-data/patients.json');
  patientData = JSON.parse(rawData);
} catch (error){
  console.error('Error loading patient data:', error);
}

export const getPatient = () => {
  return patientData;
}

export const addPatient = (newPatient) => {
  patientData.push(newPatient);
}

export { patientData };