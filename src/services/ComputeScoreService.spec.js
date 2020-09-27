const ComputeScoreService = require('./ComputeScoreService');
const NormalizeDataService = require('./NormalizeDataService');

const computeScore = new ComputeScoreService();
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

let patientsWithScore;
let normalizedData;

describe('ComputeScore', () => {
  normalizedData = normalizeData.execute(TEST_DATA);
  patientsWithScore = computeScore.execute(normalizedData);

  it('should calculate score for each patient in a given list', () => {
    patientsWithScore.forEach((patient) => {
      expect(patient).toHaveProperty('score');
      expect(patient).toHaveProperty('behaviorScore');
      expect(patient).toHaveProperty('demographicScore');
    });
  });

  it('should return the correct score for the patients', () => {
    expect(patientsWithScore[1].score).toBe('5.50');
    expect(patientsWithScore[1].behaviorScore).toBe('1.75');
    expect(patientsWithScore[1].demographicScore).toBe('1.00');
  });
});
