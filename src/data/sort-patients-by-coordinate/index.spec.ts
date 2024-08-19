import { faker } from '@faker-js/faker';

import { sortPatientsByCoordinate } from '.';
import { TCoordinates } from '../../types/coordinates';
import { TPatientRecord } from '../../types/patient-record';

describe('Sort patients by coordinate', () => {
  it('should sort the patients', () => {
    const mockPatients: TPatientRecord[] = [];
    const mockLocations: TCoordinates[] = [
      // nw
      {
        latitude: 0,
        longitude: 0,
      },
      // nw
      {
        latitude: 1,
        longitude: 1,
      },
      // ne
      {
        latitude: -1,
        longitude: 1,
      },
      // sw
      {
        latitude: 0,
        longitude: -1,
      },
      // sw
      {
        latitude: 1,
        longitude: -1,
      },
      // se
      {
        latitude: -1,
        longitude: -1,
      },
    ];

    for (let index = 0; index < 6; index++) {
      mockPatients.push({
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        age: faker.number.int({ min: 21, max: 90 }),
        acceptedOffers: faker.number.int({ min: 0, max: 100 }),
        canceledOffers: faker.number.int({ min: 0, max: 100 }),
        averageReplyTime: faker.number.int({ min: 1, max: 3600 }),
        location: mockLocations[index] as TCoordinates,
      });
    }

    const sorted = sortPatientsByCoordinate(mockPatients);

    expect(sorted.nw).toHaveLength(2);
    expect(sorted.ne).toHaveLength(1);
    expect(sorted.sw).toHaveLength(2);
    expect(sorted.se).toHaveLength(1);
  });
});
