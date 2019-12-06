const fs = require('fs');

import PatientScorer from "./PatientScorer";

const NUM_PATIENTS_TO_FETCH = 10;
//returns the top candidates given the input location
export default class RankGenerator {
    constructor() {
        this._patientData = {};
    }

    loadPatientData(path) {
        let data = JSON.parse(fs.readFileSync(path));
        data.forEach(entry => {
            if (!entry.id) {
                return;
            }

            this._patientData[entry.id] = {
                entry: entry,
                score: PatientScorer.calculatePartialPatientScore(entry)
            }
        });
    }

    fetchBestPatients(location) {
        for (const patientId in this._patientData) {
            let patient = this._patientData[patientId];
            this._patientData[patientId].score = PatientScorer.calculateFinalPatientScore(patient, location);
        }

        let sortedPatients = this._getSortedPatientList(this._patientData);

        return sortedPatients.slice(0, NUM_PATIENTS_TO_FETCH);
    }

    _getSortedPatientList(patients) {
        let sortedPatients = [];

        for (const patientId in this._patientData) {
            sortedPatients.push({ score: patients[patientId].score, entry: patients[patientId].entry});
        }

        sortedPatients.sort((a, b) => a.score < b.score ? 1 : -1);

        return sortedPatients;
    }
}