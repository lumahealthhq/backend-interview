import { scoreListOfPatients } from '.';
import { TCoordinates } from '../../types/coordinates';
import { TPatientRecordWithScore } from '../../types/patient-record';

describe('services: score list of patients', () => {
  it('should score a small list of patients and add some of them at the top of the list', () => {
    const records = [
      {
        id: '7',
        age: 19,
        acceptedOffers: 12,
        canceledOffers: 1,
        averageReplyTime: 888,
        location: {
          latitude: -41,
          longitude: 26,
        },
      },
      {
        id: '4',
        age: 30,
        acceptedOffers: 2,
        canceledOffers: 10,
        averageReplyTime: 200,
        location: {
          latitude: 50,
          longitude: 39,
        },
      },
      {
        id: '18',
        age: 18,
        acceptedOffers: 3,
        canceledOffers: 7,
        averageReplyTime: 8,
        location: {
          latitude: 43,
          longitude: -71,
        },
      },
      {
        id: '6',
        age: 44,
        acceptedOffers: 88,
        canceledOffers: 54,
        averageReplyTime: 843,
        location: {
          latitude: 32.322,
          longitude: 23.234,
        },
      },
      {
        id: '8',
        age: 23,
        acceptedOffers: 30,
        canceledOffers: 30,
        averageReplyTime: 30,
        location: {
          latitude: 30,
          longitude: 30,
        },
      },
      {
        id: '9',
        age: 24,
        acceptedOffers: 2,
        canceledOffers: 2,
        averageReplyTime: 54,
        location: {
          latitude: 20,
          longitude: 20,
        },
      },
      {
        id: '11',
        age: 26,
        acceptedOffers: 23,
        canceledOffers: 32,
        averageReplyTime: 243,
        location: {
          latitude: 12,
          longitude: 22,
        },
      },
      {
        id: '13',
        age: 26,
        acceptedOffers: 3,
        canceledOffers: 3,
        averageReplyTime: 12,
        location: {
          latitude: 60,
          longitude: 59,
        },
      },
      {
        id: '10',
        age: 56,
        acceptedOffers: 78,
        canceledOffers: 3,
        averageReplyTime: 56,
        location: {
          latitude: 89,
          longitude: 89,
        },
      },
      {
        id: '2',
        age: 22,
        acceptedOffers: 90,
        canceledOffers: 10,
        averageReplyTime: 20,
        location: {
          latitude: 3,
          longitude: 5,
        },
      },
      {
        id: '14',
        age: 29,
        acceptedOffers: 4,
        canceledOffers: 4,
        averageReplyTime: 66,
        location: {
          latitude: 64,
          longitude: 32,
        },
      },
      {
        id: '15',
        age: 32,
        acceptedOffers: 40,
        canceledOffers: 32,
        averageReplyTime: 98,
        location: {
          latitude: 10,
          longitude: 10,
        },
      },
      {
        id: '5',
        age: 55,
        acceptedOffers: 50,
        canceledOffers: 12,
        averageReplyTime: 560,
        location: {
          latitude: 16,
          longitude: 14,
        },
      },
      {
        id: '16',
        age: 44,
        acceptedOffers: 44,
        canceledOffers: 22,
        averageReplyTime: 450,
        location: {
          latitude: -12,
          longitude: -43,
        },
      },
      {
        id: '17',
        age: 37,
        acceptedOffers: 37,
        canceledOffers: 42,
        averageReplyTime: 20,
        location: {
          latitude: -13,
          longitude: 49,
        },
      },
      {
        id: '3',
        age: 25,
        acceptedOffers: 88,
        canceledOffers: 15,
        averageReplyTime: 32,
        location: {
          latitude: 10,
          longitude: -1,
        },
      },
      {
        id: '19',
        age: 88,
        acceptedOffers: 300,
        canceledOffers: 100,
        averageReplyTime: 56,
        location: {
          latitude: -46,
          longitude: 20,
        },
      },
      {
        id: '20',
        age: 20,
        acceptedOffers: 2,
        canceledOffers: 1,
        averageReplyTime: 18,
        location: {
          latitude: 50,
          longitude: 50,
        },
      },
      {
        id: '1',
        age: 20,
        acceptedOffers: 200,
        canceledOffers: 2,
        averageReplyTime: 0,
        location: {
          latitude: 1,
          longitude: 1,
        },
      },
      {
        id: '12',
        age: 64,
        acceptedOffers: 23,
        canceledOffers: 1,
        averageReplyTime: 560,
        location: {
          latitude: 21,
          longitude: 31,
        },
      },
    ];

    const mockPracticeLocation: TCoordinates = { longitude: 0, latitude: 0 };

    const result = scoreListOfPatients(
      records as TPatientRecordWithScore[],
      mockPracticeLocation
    );

    expect(result).toHaveLength(10);
    // @NOTE: is expected that the record with id = 1 be the fourth on the list
    // as three random records were added at the top of the list
    expect((result[3] as TPatientRecordWithScore).id).toBe('1');
    expect((result[4] as TPatientRecordWithScore).id).toBe('2');
    expect((result[5] as TPatientRecordWithScore).id).toBe('3');
  });
});
