import {faker} from '@faker-js/faker';
import {describe, expect, it} from '@jest/globals';
import {InvalidPatientException} from '../exceptions/invalid-patient.exception';
import {PatientModel} from './patient.model';

describe(PatientModel.name, () => {
  it('should create a valid PatientModel instance with complete data', () => {
    //  Arrange
    const data: PatientModel = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      location: {
        latitude: faker.location.latitude().toString(),
        longitude: faker.location.longitude().toString(),
      },
      age: faker.number.int({min: 21, max: 90}),
      acceptedOffers: faker.number.int({min: 0, max: 100}),
      canceledOffers: faker.number.int({min: 0, max: 100}),
      averageReplyTime: faker.number.int({min: 1, max: 3600}),
    };

    //  Act
    const actual = new PatientModel(data);

    //  Assert
    expect(actual).toBeInstanceOf(PatientModel);
  });

  it('should throw InvalidPatientException for incomplete data', () => {
    //  Arrange
    const data = {
      location: {
        latitude: faker.location.latitude().toString(),
        longitude: faker.location.longitude().toString(),
      },
    } as unknown as PatientModel;

    //  Act
    let actual: PatientModel;
    let error: InvalidPatientException;
    try {
      actual = new PatientModel(data);
    } catch (error_) {
      error = error_ as InvalidPatientException;
    }

    //  Assert
    expect(error!).toBeInstanceOf(InvalidPatientException);
    expect(error!.details).toHaveLength(6);

    expect(actual!).toBeUndefined();
  });
});
