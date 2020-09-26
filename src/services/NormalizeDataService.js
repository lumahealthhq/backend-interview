/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */

class NormalizeDataService {
  execute(patients) {
    const DATA_RANGE = {
      age: { min: Infinity, max: -Infinity, positiveCorrelation: true },
      acceptedOffers: { min: Infinity, max: -Infinity, positiveCorrelation: true },
      canceledOffers: { min: Infinity, max: -Infinity, positiveCorrelation: false },
      averageReplyTime: { min: Infinity, max: -Infinity, positiveCorrelation: false },
      distanceToFacility: { min: Infinity, max: -Infinity, positiveCorrelation: false },
    };

    patients.forEach((patient) => {
      for (const data in DATA_RANGE) {
        if (DATA_RANGE[data].min > patient[data]) {
          DATA_RANGE[data].min = patient[data];
        }
        if (DATA_RANGE[data].max < patient[data]) {
          DATA_RANGE[data].max = patient[data];
        }
        DATA_RANGE[data].den = DATA_RANGE[data].max - DATA_RANGE[data].min;
        patient.normalizedData = { [data]: 0 };
      }
    });

    const normalizedPatients = patients.map((patient) => {
      for (const data in DATA_RANGE) {
        if (DATA_RANGE[data].positiveCorrelation) {
          patient.normalizedData[data] =
            (patient[data] - DATA_RANGE[data].min) / DATA_RANGE[data].den;
        } else {
          patient.normalizedData[data] =
            (DATA_RANGE[data].max - patient[data]) / DATA_RANGE[data].den;
        }
      }
      return patient;
    });
    return normalizedPatients;
  }
}

module.exports = NormalizeDataService;
