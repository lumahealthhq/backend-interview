import { faker } from '@faker-js/faker';
import Patient from '../@types/patient';

export default function generatePatientsData(numberOfPatients: number): Patient[] {
  return Array.from({ length: numberOfPatients }, (): Patient => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    location: {
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude()
    },
    age: faker.number.int({ min: 21, max: 90 }),
    acceptedOffers: faker.number.int({ min: 0, max: 100 }),
    canceledOffers: faker.number.int({ min: 0, max: 100 }),
    averageReplyTime: faker.number.int({ min: 1, max: 3600 })
  }));
}
