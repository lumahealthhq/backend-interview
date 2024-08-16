import {describe, expect, it} from '@jest/globals';
import {InvalidLocationException} from '../exceptions/invalid-location.exception';
import {LocationModel} from './location.model';

describe(LocationModel.name, () => {
  it('should create a valid LocationModel instance with valid coordinates', () => {
    //  Arrange
    const data: LocationModel = {
      latitude: '0',
      longitude: '0',
    };

    //  Act
    const actual = new LocationModel(data);

    //  Assert
    expect(actual).toBeInstanceOf(LocationModel);
  });

  it('should throw InvalidLocationException for invalid coordinates', () => {
    //  Arrange
    const data: LocationModel = {
      latitude: '-10000',
      longitude: '10000',
    };

    //  Act
    let actual: LocationModel;
    let error: InvalidLocationException;
    try {
      actual = new LocationModel(data);
    } catch (error_) {
      error = error_ as InvalidLocationException;
    }

    //  Assert
    expect(error!).toBeInstanceOf(InvalidLocationException);
    expect(error!.details).toHaveLength(2);

    expect(actual!).toBeUndefined();
  });
});
