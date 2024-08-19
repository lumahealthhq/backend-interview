import removeDetailUsecase from './remove-scoring-detail.usecase';
import { ScoredPatient } from "../../../@types/scored-patient";

describe('removeDetailUsecase', () => {
  it('should remove specified properties from each patient object', () => {
    const mockScoredPatients: Required<ScoredPatient>[] = [
      {
        id: '1',
        name: 'John Doe',
        location: {
          latitude: 40.7128,
          longitude: -74.0060
        },
        age: 30,
        acceptedOffers: 10,
        canceledOffers: 2,
        averageReplyTime: 120,
        ageScore: 5,
        offersScore: 3,
        replyTimeScore: 2,
        lowDataBonus: 1,
        locationScore: 4,
        score: 15
      },
      {
        id: '2',
        name: 'Jane Smith',
        location: {
          latitude: 34.0522,
          longitude: -118.2437
        },
        age: 25,
        acceptedOffers: 15,
        canceledOffers: 1,
        averageReplyTime: 60,
        ageScore: 4,
        offersScore: 5,
        replyTimeScore: 4,
        lowDataBonus: 0,
        locationScore: 3,
        score: 16
      }
    ];

    const result = removeDetailUsecase(mockScoredPatients);

    expect(result).toHaveLength(2);

    result.forEach((patient: any) => {
      expect(patient).toHaveProperty('id');
      expect(patient).toHaveProperty('name');
      expect(patient).toHaveProperty('score');

      expect(patient).not.toHaveProperty('ageScore');
      expect(patient).not.toHaveProperty('offersScore');
      expect(patient).not.toHaveProperty('locationScore');
      expect(patient).not.toHaveProperty('replyTimeScore');
      expect(patient).not.toHaveProperty('age');
      expect(patient).not.toHaveProperty('location');
      expect(patient).not.toHaveProperty('averageReplyTime');
      expect(patient).not.toHaveProperty('acceptedOffers');
      expect(patient).not.toHaveProperty('canceledOffers');
    });
  });

  it('should return an empty array if input is empty', () => {
    const result = removeDetailUsecase([]);
    expect(result).toEqual([]);
  });

  it('should handle patients with missing optional properties', () => {
    const patientWithMissingProps: any = {
      id: '3',
      name: 'Bob Johnson',
      location: {
        latitude: 51.5074,
        longitude: -0.1278
      },
      age: 40,
      acceptedOffers: 5,
      canceledOffers: 0,
      averageReplyTime: 90,
      ageScore: 3,
      offersScore: 4,
      replyTimeScore: 3,
      lowDataBonus: 2,
      score: 12
      // locationScore is intentionally omitted
    };

    const result = removeDetailUsecase([patientWithMissingProps]);

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('id');
    expect(result[0]).toHaveProperty('name');
    expect(result[0]).toHaveProperty('score');
    expect(result[0]).not.toHaveProperty('locationScore');
  });
});
