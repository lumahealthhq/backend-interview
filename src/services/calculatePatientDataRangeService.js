class CalculatePatientDataRangeService {
  constructor() {
    this.fields = ['facilityDistance', 'age', 'acceptedOffers', 'canceledOffers', 'averageReplyTime'];
    this.dataRange = this._initializeDataRange();
  }

  _initializeDataRange() {
    const dataRange = {};
    this.fields.forEach(field => {
      dataRange[field] = { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY };
    });
    return dataRange;
  }

  execute(patients) {
    patients.forEach(patient => {
      this.fields.forEach(field => {
        this._updateFieldRange(field, patient[field]);
      });
    });

    return this.dataRange;
  }

  _updateFieldRange(field, value) {
    if (value < this.dataRange[field].min) {
      this.dataRange[field].min = value;
    }
    if (value > this.dataRange[field].max) {
      this.dataRange[field].max = value;
    }
  }
}

export default CalculatePatientDataRangeService;
