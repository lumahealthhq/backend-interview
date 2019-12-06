// import dependencies
import RankGenerator from '../RankGenerator'

// output top patients to contact given a location
let dataPath = "../sample-data/patients.json";
let location = {
    "latitude": "68.8129",
    "longitude": "71.3018"
}
const rankGenerator = new RankGenerator();
rankGenerator.loadPatientData(dataPath);

console.log(rankGenerator.fetchBestPatients(location));