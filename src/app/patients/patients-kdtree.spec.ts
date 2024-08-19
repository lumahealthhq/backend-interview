import PatientsKdtree from './patients-kdtree';
import { ScoredPatient } from "../../@types/scored-patient";
import { RecommenderConfig } from '../../domain/patients/patients-recommender-config';
import Patient from '../../@types/patient';

describe('PatientsKdtree', () => {
  let kdtree: PatientsKdtree;
  let scoredPatients: ScoredPatient[];
  let config: RecommenderConfig;

  beforeEach(() => {
    const basePatient: Patient = {
      id: '',
      name: '',
      location: { latitude: 0, longitude: 0 },
      age: 0,
      acceptedOffers: 0,
      canceledOffers: 0,
      averageReplyTime: 0,
    };

    scoredPatients = [
      {
        ...basePatient,
        id: '1',
        name: 'John Doe',
        age: 30,
        location: { latitude: 40.7128, longitude: -74.0060 },
        acceptedOffers: 20,
        canceledOffers: 5,
        averageReplyTime: 120,
        ageScore: 0.8,
        offersScore: 0.7,
        replyTimeScore: 0.9,
        lowDataBonus: 0,
      },
      {
        ...basePatient,
        id: '2',
        name: 'Jane Smith',
        age: 45,
        location: { latitude: 34.0522, longitude: -118.2437 },
        acceptedOffers: 8,
        canceledOffers: 2,
        averageReplyTime: 90,
        ageScore: 0.6,
        offersScore: 0.8,
        replyTimeScore: 0.7,
        lowDataBonus: 0.2,
      },
      {
        ...basePatient,
        id: '3',
        name: 'Bob Johnson',
        age: 55,
        location: { latitude: 41.8781, longitude: -87.6298 },
        acceptedOffers: 3,
        canceledOffers: 0,
        averageReplyTime: 180,
        ageScore: 0.9,
        offersScore: 0.6,
        replyTimeScore: 0.8,
        lowDataBonus: 0.5,
      },
    ];

    config = {
      weights: {
        age: 0.1,
        location: 0.1,
        offers: 0.6,
        replyTime: 0.2,
      },
      thresholdLocationDistance: 4500,
      lowDataThreshold: 25,
      lowDataRecommendedRatio: 0.2,
    };

    kdtree = new PatientsKdtree(scoredPatients, config);
  });

  test('findPatients returns correct number of patients', () => {
    const result = kdtree.findPatients(40.7128, -74.0060, 2);
    expect(result).toHaveLength(2);
  });

  test('findPatients returns patients sorted by score', () => {
    const result = kdtree.findPatients(40.7128, -74.0060, 3);
    expect(result[0].score).toBeLessThanOrEqual(result[1].score);
    expect(result[1].score).toBeLessThanOrEqual(result[2].score);
  });

  test('findPatients includes locationScore and overall score', () => {
    const result = kdtree.findPatients(40.7128, -74.0060, 1);
    expect(result[0].locationScore).toBeDefined();
    expect(result[0].score).toBeDefined();
  });

  test('score calculates correct score for a patient', () => {
    const patient = scoredPatients[0];
    const score = kdtree.score(patient, 40.7128, -74.0060);
    const expectedScore =
      (config.weights.age * (1 - patient.ageScore)) +
      (config.weights.offers * (1 - patient.offersScore)) +
      (config.weights.replyTime * (1 - patient.replyTimeScore)) +
      (config.weights.location * 0); // Same location, so distance is 0
    expect(score).toBeCloseTo(expectedScore, 2);
  });

  test('calculateLocationDistance returns correct normalized distance', () => {
    const distance = kdtree.calculateLocationDistance(40.7128, -74.0060, 34.0522, -118.2437);
    expect(distance).toBeGreaterThan(0);
    expect(distance).toBeLessThanOrEqual(config.weights.location);
  });

  test('findPatients handles distances beyond thresholdLocationDistance', () => {
    const farAwayLocation = { latitude: 0, longitude: 180 }; // Opposite side of the world
    const result = kdtree.findPatients(farAwayLocation.latitude, farAwayLocation.longitude, 3);
    result.forEach(patient => {
      expect(patient.locationScore).toBe(config.weights.location);
    });
  });
});
