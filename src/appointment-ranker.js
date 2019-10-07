const fs = require('fs');

import PatientScorer from "./patient-scorer";

const NUM_TOP_TO_RETURN = 10;

export default class AppointmentRanker {
  constructor() {
    this._patientData = {};
  }

  /**
   * Processes a set of historical patient data for ranking
   *
   * @param historicalDataPath
   */
  updateFromHistoricalData(historicalDataPath) {
    const data = JSON.parse(fs.readFileSync(historicalDataPath)); // TODO: Make this async
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

  /**
   * Get the top 10 patients that would schedule appointments for a given clinic location.
   * Note: Patients with little data on acceptance of scheduling offers will be randomly bumped up.
   * @param location
   * @returns {*[]} Ordered list of patients
   */
  getTopPatientsForLocation(location) {
    const dynamicData = {
      location: location
    };

    for (const patientId in this._patientData) {
      const dynamicScore = PatientScorer.getDynamicScoreForPatient(
        this._patientData[patientId].record,
        dynamicData
      );

      this._patientData[patientId].score = this._patientData[patientId].staticScore + dynamicScore;
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