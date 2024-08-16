import {faker} from '@faker-js/faker';
import {describe, expect, it} from '@jest/globals';
import {InvalidPatientException} from '../exceptions/invalid-patient.exception';
import {PatientResponseModel} from './patient-response.model';

describe(PatientResponseModel.name, () => {
  it('should create a valid PatientResponseModel instance with valid data', () => {
    //  Arrange
    const data: PatientResponseModel = {
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
      score: faker.number.float({min: 0, max: 10}),
    };

    //  Act
    const actual = new PatientResponseModel(data);

    //  Assert
    expect(actual).toBeInstanceOf(PatientResponseModel);
  });

  it('should throw InvalidPatientException for incomplete data', () => {
    //  Arrange
    const data = {
      location: {
        latitude: faker.location.latitude().toString(),
        longitude: faker.location.longitude().toString(),
      },
    } as unknown as PatientResponseModel;

    //  Act
    let actual: PatientResponseModel;
    let error: InvalidPatientException;
    try {
      actual = new PatientResponseModel(data);
    } catch (error_) {
      error = error_ as InvalidPatientException;
    }

    //  Assert
    expect(error!).toBeInstanceOf(InvalidPatientException);
    expect(error!.details).toHaveLength(7);

    expect(actual!).toBeUndefined();
  });
});
