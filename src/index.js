import AppointmentRanker from "./appointment-ranker";

const HISTORICAL_DATA_PATH = './sample-data/patients.json';

const patientScorer = new AppointmentRanker();
patientScorer.updateFromHistoricalData(HISTORICAL_DATA_PATH);

console.log(patientScorer.getTopPatientsForLocation({
  "latitude":"-46.2905","longitude":"108.2977"
}));