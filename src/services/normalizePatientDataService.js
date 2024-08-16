
class NormalizePatientDataService {
  execute({ patients, patientDataRange }) {
    const normalizedPatients = patients.map(patient => {
      for (const field in patientDataRange) {
        if (patient[field]) {
          patient[field] = this._normalizeValue(
            patient[field],
            patientDataRange[field].min,
            patientDataRange[field].max
          );
        }
      }
      return patient
    })

    return normalizedPatients
  }

  _normalizeValue(value, min, max) {
    if (min === max) return 0;
    return (value - min) / (max - min);
  }
}

export default NormalizePatientDataService