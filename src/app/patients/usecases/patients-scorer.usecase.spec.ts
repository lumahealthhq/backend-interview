import PatientsScorerUsecase from './patients-scorer.usecase';
import Patient from "../../../@types/patient";
import { SetStats } from "./get-set-stats.usecase";

describe('PatientsScorerUsecase', () => {
  let patients: Patient[];
  let stats: SetStats;
  let scorer: PatientsScorerUsecase;

  beforeEach(() => {
    patients = [
      {
        id: '1',
        name: 'John Doe',
        location: { latitude: 40.7128, longitude: -74.0060 },
        age: 30,
        averageReplyTime: 10,
        acceptedOffers: 5,
        canceledOffers: 2
      },
      {
        id: '2',
        name: 'Jane Smith',
        location: { latitude: 34.0522, longitude: -118.2437 },
        age: 40,
        averageReplyTime: 15,
        acceptedOffers: 3,
        canceledOffers: 1
      }
    ];

    stats = {
      age: { mean: 35, std: 5 },
      replyTime: { mean: 12.5, std: 2.5 },
      offer: {
        mean: 0.6,
        std: 0.2,
        meanNumberOfOffers: 12,
        medianAcceptance: 0.7
      },
      location: {
        latMean: 37.0902
      }
    };

    scorer = new PatientsScorerUsecase(patients, stats);
  });

  describe('execute', () => {
    test('should return scored patients', () => {
      const result = scorer.execute();

      expect(result).toHaveLength(2);
      result.forEach(patient => {
        expect(patient).toHaveProperty('ageScore');
        expect(patient).toHaveProperty('replyTimeScore');
        expect(patient).toHaveProperty('offersScore');

        expect(patient.ageScore).toBeGreaterThanOrEqual(0);
        expect(patient.ageScore).toBeLessThanOrEqual(1);
        expect(patient.replyTimeScore).toBeGreaterThanOrEqual(0);
        expect(patient.replyTimeScore).toBeLessThanOrEqual(1);
        expect(patient.offersScore).toBeGreaterThanOrEqual(0);
        expect(patient.offersScore).toBeLessThanOrEqual(1);

        // Ensure locationScore and score are not present
        expect(patient).not.toHaveProperty('locationScore');
        expect(patient).not.toHaveProperty('score');
      });
    });
  });
});
