import {describe, expect, it} from '@jest/globals';
import {type PatientFacilityModel} from '../types/patient-facility.type';
import {getDatasetMinMaxValues} from './get-dataset-min-max-values.helper';

describe(getDatasetMinMaxValues.name, () => {
  it('should return the max and min for the dataset - scenario 1', () => {
    //  Arrange
    const dataset: PatientFacilityModel[] = [
      {
        id: '541d25c9-9500-4265-8967-240f44ecf723',
        name: 'Samir Pacocha',
        location: {latitude: '46.7110', longitude: '-63.1150'},
        distanceToFacility: 2,
        age: 46,
        acceptedOffers: 49,
        canceledOffers: 92,
        averageReplyTime: 2598,
      },
      {
        id: '41fd45bc-b166-444a-a69e-9d527b4aee48',
        name: 'Bernard Mosciski',
        location: {latitude: '-81.0341', longitude: '144.9963'},
        distanceToFacility: 3,
        age: 21,
        acceptedOffers: 95,
        canceledOffers: 96,
        averageReplyTime: 1908,
      },
      {
        id: '90592106-a0d9-4329-8159-af7ce4ba45ad',
        name: 'Theo Effertz',
        location: {latitude: '-35.5336', longitude: '-25.2795'},
        distanceToFacility: 1,
        age: 67,
        acceptedOffers: 69,
        canceledOffers: 24,
        averageReplyTime: 3452,
      },
    ];

    //  Act
    const actual = getDatasetMinMaxValues(dataset);

    //  Assert
    expect(actual).toStrictEqual({
      age: {min: 21, max: 67},
      distanceToFacility: {min: 1, max: 3},
      acceptedOffers: {min: 49, max: 95},
      canceledOffers: {min: 24, max: 96},
      averageReplyTime: {min: 1908, max: 3452},
    });
  });

  it('should return the max and min for the dataset - scenario 2', () => {
    //  Arrange
    const dataset: PatientFacilityModel[] = [
      {
        id: 'a4080fe9-dd45-4b2b-bd30-8b87023946cd',
        name: 'Mr. Brenna Funk',
        location: {
          latitude: '87.5657',
          longitude: '1.3006',
        },
        distanceToFacility: 0.3,
        age: 38,
        acceptedOffers: 57,
        canceledOffers: 27,
        averageReplyTime: 309,
      },
      {
        id: 'e6843b4f-0351-479e-ab92-88e253d8682c',
        name: 'Kevon Friesen',
        location: {
          latitude: '14.7807',
          longitude: '-72.7663',
        },
        distanceToFacility: 15,
        age: 34,
        acceptedOffers: 36,
        canceledOffers: 58,
        averageReplyTime: 1781,
      },
      {
        id: 'bf137ca8-09c2-46d7-8221-db8d13b791f8',
        name: 'Tre Denesik',
        location: {
          latitude: '-11.7897',
          longitude: '148.3948',
        },
        distanceToFacility: 60.879,
        age: 36,
        acceptedOffers: 43,
        canceledOffers: 49,
        averageReplyTime: 1868,
      },
    ];

    //  Act
    const actual = getDatasetMinMaxValues(dataset);

    //  Assert
    expect(actual).toStrictEqual({
      age: {min: 34, max: 38},
      distanceToFacility: {min: 0.3, max: 60.879},
      acceptedOffers: {min: 36, max: 57},
      canceledOffers: {min: 27, max: 58},
      averageReplyTime: {min: 309, max: 1868},
    });
  });
});
