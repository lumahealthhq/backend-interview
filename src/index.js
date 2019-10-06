import AppointmentRanker from "./appointment-ranker";

const HISTORICAL_DATA_PATH = './sample-data/patients.json';

const appointmentRanker = new AppointmentRanker();
appointmentRanker.updateFromHistoricalData(HISTORICAL_DATA_PATH);

console.log(appointmentRanker.getTopPatientsForLocation({
  "latitude":"-46.2905","longitude":"108.2977"
}));