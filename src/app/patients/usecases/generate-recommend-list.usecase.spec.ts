import generateRecommendListUsecase from './generate-recommend-list.usecase';
import shuffleArray from '../../../utils/shuffle-array';

// Mock the shuffleArray function
jest.mock('../../../utils/shuffle-array');

describe('generateRecommendListUsecase', () => {
  const createMockPatient = (id: number, score: number): any => ({
    id: id.toString(),
    score,
    // Add other required properties here
  });

  beforeEach(() => {
    (shuffleArray as jest.Mock).mockImplementation((arr) => arr);
  });

  it('should generate a list with the correct size', () => {
    const bestScoringPatients = Array(10).fill(null).map((_, i) => createMockPatient(i, 100 - i));
    const lowHistoricalDataPatients = Array(5).fill(null).map((_, i) => createMockPatient(i + 10, 50));

    const result = generateRecommendListUsecase(8, bestScoringPatients, lowHistoricalDataPatients);

    expect(result).toHaveLength(8);
  });

  it('should include the correct ratio of low historical data patients', () => {
    const bestScoringPatients = Array(10).fill(null).map((_, i) => createMockPatient(i, 100 - i));
    const lowHistoricalDataPatients = Array(5).fill(null).map((_, i) => createMockPatient(i + 10, 50));

    const result = generateRecommendListUsecase(10, bestScoringPatients, lowHistoricalDataPatients, 0.3);

    const lowDataPatients = result.filter((patient: any) => patient.low_data);
    expect(lowDataPatients).toHaveLength(3);
  });

  it('should use best scoring patients when there are not enough low historical data patients', () => {
    const bestScoringPatients = Array(10).fill(null).map((_, i) => createMockPatient(i, 100 - i));
    const lowHistoricalDataPatients = Array(1).fill(null).map((_, i) => createMockPatient(i + 10, 50));

    const result = generateRecommendListUsecase(10, bestScoringPatients, lowHistoricalDataPatients, 0.3);

    expect(result).toHaveLength(10);
    expect(result.filter((patient: any) => patient.low_data)).toHaveLength(1);
  });

  it('should shuffle the low historical data patients', () => {
    const bestScoringPatients = Array(8).fill(null).map((_, i) => createMockPatient(i, 100 - i));
    const lowHistoricalDataPatients = Array(5).fill(null).map((_, i) => createMockPatient(i + 10, 50));

    generateRecommendListUsecase(10, bestScoringPatients, lowHistoricalDataPatients, 0.2);

    expect(shuffleArray).toHaveBeenCalledWith(lowHistoricalDataPatients);
  });

  it('should maintain the order of best scoring patients', () => {
    const bestScoringPatients = Array(10).fill(null).map((_, i) => createMockPatient(i, 100 - i));
    const lowHistoricalDataPatients = Array(5).fill(null).map((_, i) => createMockPatient(i + 10, 50));

    const result = generateRecommendListUsecase(8, bestScoringPatients, lowHistoricalDataPatients);

    const bestScoringResult = result.filter((patient: any) => !patient.low_data);
    expect(bestScoringResult).toEqual(bestScoringPatients.slice(0, 6));
  });

  it('should mark low historical data patients', () => {
    const bestScoringPatients = Array(8).fill(null).map((_, i) => createMockPatient(i, 100 - i));
    const lowHistoricalDataPatients = Array(5).fill(null).map((_, i) => createMockPatient(i + 10, 50));

    const result = generateRecommendListUsecase(10, bestScoringPatients, lowHistoricalDataPatients, 0.2);

    const lowDataPatients = result.filter((patient: any) => patient.low_data);
    expect(lowDataPatients).toHaveLength(2);
    lowDataPatients.forEach((patient: any) => {
      expect(patient.low_data).toBe(true);
    });
  });
});
