import PatientsRecommenderAdapter from './patients-recommender';
import { RecommenderConfig } from '../../domain/patients/patients-recommender-config';
import Patient from '../../@types/patient';
import AppError from '../../domain/error/AppError';
import { ScoredPatient } from '../../@types/scored-patient';
import PatientsScorerUsecase from './usecases/patients-scorer.usecase';
import PatientsKdtree from './patients-kdtree';
import getSetStatsUsecase from './usecases/get-set-stats.usecase';
import generateRecommendListUsecase from './usecases/generate-recommend-list.usecase';

// Define the SetStats interface
interface SetStats {
  age: {
    mean: number;
    std: number;
  }
  offer: {
    mean: number;
    std: number;
    meanNumberOfOffers: number;
    medianAcceptance: number;
  }
  replyTime: {
    mean: number;
    std: number;
  }
  location: {
    latMean: number;
  }
}

// Mock dependencies
jest.mock('./usecases/get-set-stats.usecase');
jest.mock('./usecases/patients-scorer.usecase');
jest.mock('./usecases/generate-recommend-list.usecase');
jest.mock('./patients-kdtree');

describe('PatientsRecommenderAdapter', () => {
  let adapter: PatientsRecommenderAdapter;
  let mockConfig: RecommenderConfig;
  let mockPatients: Patient[];
  let mockScoredPatients: ScoredPatient[];
  let mockKdtree: jest.Mocked<PatientsKdtree>;
  let mockSetStats: SetStats;

  beforeEach(() => {
    adapter = new PatientsRecommenderAdapter();
    mockConfig = {
      weights: { age: 0.1, location: 0.1, offers: 0.6, replyTime: 0.2 },
      thresholdLocationDistance: 5000,
      lowDataThreshold: 25,
      lowDataRecommendedRatio: 0.2,
    };
    mockPatients = [
      {
        id: '1',
        name: 'John Doe',
        location: { latitude: 40.7128, longitude: -74.0060 },
        age: 35,
        acceptedOffers: 10,
        canceledOffers: 2,
        averageReplyTime: 3600,
      },
      {
        id: '2',
        name: 'Jane Smith',
        location: { latitude: 34.0522, longitude: -118.2437 },
        age: 28,
        acceptedOffers: 5,
        canceledOffers: 1,
        averageReplyTime: 1800,
      },
    ];
    mockScoredPatients = mockPatients.map(patient => ({
      ...patient,
      ageScore: 0.5,
      offersScore: 0.7,
      replyTimeScore: 0.6,
      lowDataBonus: 0,
      locationScore: undefined,
      score: undefined,
    }));

    mockSetStats = {
      age: {
        mean: 31.5,
        std: 3.5,
      },
      offer: {
        mean: 7.5,
        std: 2.5,
        meanNumberOfOffers: 9,
        medianAcceptance: 0.8,
      },
      replyTime: {
        mean: 2700,
        std: 900,
      },
      location: {
        latMean: 37.3825,
      },
    };

    // Mock getSetStatsUsecase
    (getSetStatsUsecase as jest.MockedFunction<typeof getSetStatsUsecase>).mockReturnValue(mockSetStats);

    // Mock PatientsScorerUsecase
    (PatientsScorerUsecase as jest.MockedClass<typeof PatientsScorerUsecase>).mockImplementation(() => ({
      execute: jest.fn().mockReturnValue(mockScoredPatients),
    } as any));

    // Mock PatientsKdtree
    mockKdtree = {
      findPatients: jest.fn().mockReturnValue(mockScoredPatients),
      score: jest.fn().mockReturnValue(0.75),
      calculateLocationDistance: jest.fn().mockReturnValue(0.2),
    } as any;
    (PatientsKdtree as jest.MockedClass<typeof PatientsKdtree>).mockImplementation(() => mockKdtree);

    // Mock generateRecommendListUsecase
    (generateRecommendListUsecase as jest.MockedFunction<typeof generateRecommendListUsecase>).mockImplementation((limit, bestScoring) => bestScoring.slice(0, limit));
  });

  describe('setup', () => {
    it('should set up the adapter correctly', async () => {
      await adapter.setup(mockConfig, mockPatients);
      expect(adapter['config']).toBe(mockConfig);
      expect(adapter['scoredPatients']).toEqual(mockScoredPatients);
      expect(adapter['lowHistoricalDataPatients']).toBeDefined();
      expect(adapter['kdtree']).toBeDefined();
    });

    it('should call getSetStatsUsecase with correct parameters', async () => {
      await adapter.setup(mockConfig, mockPatients);
      expect(getSetStatsUsecase).toHaveBeenCalledWith(mockPatients);
    });

    it('should initialize PatientsScorerUsecase with correct parameters', async () => {
      await adapter.setup(mockConfig, mockPatients);
      expect(PatientsScorerUsecase).toHaveBeenCalledWith(mockPatients, mockSetStats);
    });
  });

  describe('recommend', () => {
    it('should throw an error if setup is not called', () => {
      expect(() => adapter.recommend(40.7128, -74.0060, 10)).toThrow(AppError);
    });

    it('should throw an error if limit is greater than available patients', async () => {
      await adapter.setup(mockConfig, mockPatients);
      expect(() => adapter.recommend(40.7128, -74.0060, 100)).toThrow(AppError);
    });

    it('should return the correct number of recommended patients', async () => {
      await adapter.setup(mockConfig, mockPatients);
      const result = adapter.recommend(40.7128, -74.0060, 1);
      expect(result).toHaveLength(1);
    });

    it('should calculate score and locationScore for patients without them', async () => {
      await adapter.setup(mockConfig, mockPatients);
      const result = adapter.recommend(40.7128, -74.0060, 2);

      expect(mockKdtree.score).toHaveBeenCalledTimes(2);
      expect(mockKdtree.calculateLocationDistance).toHaveBeenCalledTimes(2);

      result.forEach(patient => {
        expect(patient.score).toBeDefined();
        expect(patient.locationScore).toBeDefined();
      });
    });

    it('should adjust scores to be within 0-10 range', async () => {
      await adapter.setup(mockConfig, mockPatients);
      const result = adapter.recommend(40.7128, -74.0060, 2);
      result.forEach(patient => {
        expect(patient.score).toBeGreaterThanOrEqual(0);
        expect(patient.score).toBeLessThanOrEqual(10);
      });
    });
  });
});
