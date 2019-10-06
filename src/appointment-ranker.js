const fs = require('fs');

import PatientScorer from "./patient-scorer";

const NUM_TOP_TO_RETURN = 10;

export default class AppointmentRanker {
  constructor() {
    this._patientData = {};
  }

  updateFromHistoricalData(historicalDataPath) {
    const data = JSON.parse(fs.readFileSync(historicalDataPath));
    data.forEach(record => {
      if (!record.id) {
        return;
      }

      this._patientData[record.id] = {
        record: record,
        staticScore: PatientScorer.getHistoricalScoreForPatient(record)
      };
    });
    }

  getTopPatientsForLocation(location) {
    const dynamicData = {
      location: location
    };

    for (const patientId in this._patientData) {
      this._patientData[patientId].score = PatientScorer.getDynamicScoreForPatient(
          this._patientData[patientId].record,
          this._patientData[patientId].staticScore,
          dynamicData
      );
    }

    return this._getSortedPatients('score').slice(0, NUM_TOP_TO_RETURN);
  }

  getTopPatients() {
    return this._getSortedPatients('staticScore').slice(0, NUM_TOP_TO_RETURN);
  }

  _getSortedPatients(sortingScore) {
    const sorted = [];
    for (const patientId in this._patientData) {
      sorted.push({
        score: this._patientData[patientId][sortingScore],
        patientId: patientId
      });
    }
    sorted.sort((a, b) => b.score - a.score);
    return sorted;
  }
}