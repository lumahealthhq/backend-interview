const fs = require('fs');

import PatientScorer from "./patient-scorer";

const NUM_TOP_TO_RETURN = 10;

export default class AppointmentRanker {
  constructor() {
    this._patientData = {};
  }

  updateFromHistoricalData(historicalDataPath) {
    // TODO: Read historical data and calculate static scores
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

    const sorted = [];
    for (const patientId in this._patientData) {
      sorted.push([this._patientData[patientId].score, patientId]);
    }
    sorted.sort((a, b) => b[0] - a[0]);

    return sorted.slice(0, NUM_TOP_TO_RETURN - 1);
  }
}

/**
 Number of records: 1000
 {
  id: 1000,
  name: 1000,
  location: { lat: 1000, long: 1000 },
  age: 1000,
  acceptedOffers: 983,
  canceledOffers: 991,
  averageReplyTime: 1000
}
 **/