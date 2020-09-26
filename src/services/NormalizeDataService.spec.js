const NormalizeDataService = require('./NormalizeDataService');

const normalizeData = new NormalizeDataService();

const TEST_DATA = [
  {
    age: 10,
    acceptedOffers: 10,
    canceledOffers: 10,
    averageReplyTime: 10,
    distanceToFacility: 10,
  },
  {
    age: 20,
    acceptedOffers: 20,
    canceledOffers: 20,
    averageReplyTime: 20,
    distanceToFacility: 20,
  },
  {
    age: 50,
    acceptedOffers: 50,
    canceledOffers: 50,
    averageReplyTime: 50,
    distanceToFacility: 50,
  },
];

let normalizedPatients;

describe('NormalizeData', () => {
  beforeEach(() => {
    normalizedPatients = normalizeData.execute(TEST_DATA);
  });

  it('should contain normalized data from patients', () => {
    normalizedPatients.forEach((patient) => {
      expect(patient).toHaveProperty('normalizedData');
      expect(patient.normalizedData).toHaveProperty('age');
      expect(patient.normalizedData).toHaveProperty('acceptedOffers');
      expect(patient.normalizedData).toHaveProperty('canceledOffers');
      expect(patient.normalizedData).toHaveProperty('averageReplyTime');
      expect(patient.normalizedData).toHaveProperty('distanceToFacility');
    });
  });

  it('should normalize all datas from a given patient list', () => {
    // const patientDataRanges = {
    //   age: { min: 10, max: 50 },
    //   acceptedOffers: { min: 10, max: 50 },
    //   canceledOffers: { min: 10, max: 50 },
    //   averageReplyTime: { min: 10, max: 50 },
    //   distanceToFacility: { min: 10, max: 50 },
    // };

    expect(normalizedPatients[1].normalizedData.age).toBe(0.25);
    expect(normalizedPatients[1].normalizedData.acceptedOffers).toBe(0.25);
    expect(normalizedPatients[1].normalizedData.canceledOffers).toBe(0.75);
    expect(normalizedPatients[1].normalizedData.averageReplyTime).toBe(0.75);
    expect(normalizedPatients[1].normalizedData.distanceToFacility).toBe(0.75);
  });
});
