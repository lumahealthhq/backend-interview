/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/**
 * Service responsible for normalizing all datas values between 0 and 1
 */
class NormalizeDataService {
  /**
   * Execute the service
   * @param {Object[]} patients List of patients.
   * @returns {Object[]} normalizedPatients List of patients with normalized data.
   */
  execute(patients) {
    // Object containing initial data ranges and correlation in the normalization calculation
    const DATA_RANGE = {
      age: { min: Infinity, max: -Infinity, positiveCorrelation: true },
      acceptedOffers: { min: Infinity, max: -Infinity, positiveCorrelation: true },
      canceledOffers: { min: Infinity, max: -Infinity, positiveCorrelation: false },
      averageReplyTime: { min: Infinity, max: -Infinity, positiveCorrelation: false },
      distanceToFacility: { min: Infinity, max: -Infinity, positiveCorrelation: false },
    };

    // Finding out the min and max values of each feature for all patients
    patients.forEach((patient) => {
      for (const data in DATA_RANGE) {
        if (DATA_RANGE[data].min > patient[data]) {
          DATA_RANGE[data].min = patient[data];
        }
        if (DATA_RANGE[data].max < patient[data]) {
          DATA_RANGE[data].max = patient[data];
        }
        // Denominator of the normalization
        DATA_RANGE[data].den = DATA_RANGE[data].max - DATA_RANGE[data].min;
        // Initializing normalizedData for each feature with the value of 0
        patient.normalizedData = { [data]: 0 };
      }
    });

    // Normalizing the data for each feature in all patients
    const normalizedPatients = patients.map((patient) => {
      for (const data in DATA_RANGE) {
        if (DATA_RANGE[data].positiveCorrelation) {
          // The normalization uses the following formula for positive correlation
          patient.normalizedData[data] =
            (patient[data] - DATA_RANGE[data].min) / DATA_RANGE[data].den;
        } else {
          // The normalization uses the following formula for negative correlation
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
