import {describe, expect, it} from '@jest/globals';
import sampleData from '../../sample-data/patients.json';
import {InvalidDatasetException} from '../exceptions/invalid-dataset.exception';
import {InvalidLocationException} from '../exceptions/invalid-location.exception';
import {PatientResponseModel} from '../models/patient-response.model';
import {PatientModel} from '../models/patient.model';
import {PatientScoringAlgorithm} from './patient-scoring-algorithm';

describe(PatientScoringAlgorithm, () => {
  it('should throw InvalidDatasetException when instantiated with an empty dataset', () => {
    //  Arrange
    const mockDataset: PatientModel[] = [];

    //  Act
    let actual;
    let error;
    try {
      actual = new PatientScoringAlgorithm({dataset: mockDataset});
    } catch (error_) {
      error = error_;
    }

    //  Assert
    expect(error).toBeInstanceOf(InvalidDatasetException);
    expect(actual).toBeUndefined();
  });

  it('should throw InvalidLocationException when location is invalid', () => {
    //  Arrange
    const mockDataset: PatientModel[] = sampleData.map(row => new PatientModel(row));
    const sut = new PatientScoringAlgorithm({dataset: mockDataset});

    //  Act
    let actual;
    let error;
    try {
      actual = sut.getPatientList({latitude: '9999999999', longitude: '9999999999'});
    } catch (error_) {
      error = error_;
    }

    //  Assert
    expect(error).toBeInstanceOf(InvalidLocationException);
    expect(actual).toBeUndefined();
  });

  it('should return a list of 10 PatientResponseModel instances when given valid coordinates', () => {
    //  Arrange
    const mockDataset: PatientModel[] = sampleData.map(row => new PatientModel(row));
    const sut = new PatientScoringAlgorithm({dataset: mockDataset});

    //  Act
    const actual = sut.getPatientList({latitude: '48.7120', longitude: '-60.1170'});

    //  Assert
    expect(actual).toHaveLength(10);
    expect(actual[0]).toBeInstanceOf(PatientResponseModel);
  });

  it('should return a list of 15 PatientResponseModel instances when resultLimitParameter is set to 15', () => {
    //  Arrange
    const mockDataset: PatientModel[] = sampleData.map(row => new PatientModel(row));
    const sut = new PatientScoringAlgorithm({dataset: mockDataset, resultLimitParameter: 15});

    //  Act
    const actual = sut.getPatientList({latitude: '48.7120', longitude: '-60.1170'});

    //  Assert
    expect(actual).toHaveLength(15);
    expect(actual[0]).toBeInstanceOf(PatientResponseModel);
  });

  it('should return a list of PatientResponseModel instances including 3 with insufficient behavior data when limit is set to 3', () => {
    //  Arrange
    const mockDataset: PatientModel[] = sampleData.map(row => new PatientModel(row));
    const sut = new PatientScoringAlgorithm({dataset: mockDataset, usersFromPatientsWithInsufficientBehaviorDataLimit: 3});

    //  Act
    const actual = sut.getPatientList({latitude: '48.7120', longitude: '-60.1170'});

    //  Assert
    expect(actual[0]).toBeInstanceOf(PatientResponseModel);

    //  These are the 7 patients with Higher Score
    expect(actual[0].name).toBe('Tamara Roberts');
    expect(actual[1].name).toBe('Adeline Corwin');
    expect(actual[2].name).toBe('Miss Frida Harris');
    expect(actual[3].name).toBe('Laurine Kshlerin');
    expect(actual[4].name).toBe('Jess Deckow');
    expect(actual[5].name).toBe('Ms. Damien Ziemann');
    expect(actual[6].name).toBe('Mrs. Jaquan Lemke');

    //  These are the 3 patients with insufficient behavior data
    expect(actual[7].name).toBe('Dina Orn');
    expect(actual[8].name).toBe('Etha Bauch');
    expect(actual[9].name).toBe('Arnold Krajcik');
  });
});
