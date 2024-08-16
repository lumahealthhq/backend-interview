import type {DatasetMinMaxValues} from '../types/dataset-min-max-values.type';
import type {PatientFacilityModel} from '../types/patient-facility.type';

/**
 * Loop through the dataset and get the min and max values for each column
 * My main focus here was the legibility. If the performance it's the main concern, we can use only one loop to get the min/max for each column
 * @param dataset
 * @returns
 */
export function getDatasetMinMaxValues(dataset: PatientFacilityModel[]): DatasetMinMaxValues {
  const datasetArray = {
    age: dataset.map(row => row.age),
    distanceToFacility: dataset.map(row => row.distanceToFacility!),
    acceptedOffers: dataset.map(row => row.acceptedOffers),
    canceledOffers: dataset.map(row => row.canceledOffers),
    averageReplyTime: dataset.map(row => row.averageReplyTime),
  };

  const datasetMinMaxValues: DatasetMinMaxValues = {
    age: {
      min: Math.min(...datasetArray.age),
      max: Math.max(...datasetArray.age),
    },
    distanceToFacility: {
      min: Math.min(...datasetArray.distanceToFacility),
      max: Math.max(...datasetArray.distanceToFacility),
    },
    acceptedOffers: {
      min: Math.min(...datasetArray.acceptedOffers),
      max: Math.max(...datasetArray.acceptedOffers),
    },
    canceledOffers: {
      min: Math.min(...datasetArray.canceledOffers),
      max: Math.max(...datasetArray.canceledOffers),
    },
    averageReplyTime: {
      min: Math.min(...datasetArray.averageReplyTime),
      max: Math.max(...datasetArray.averageReplyTime),
    },
  };

  return datasetMinMaxValues;
}
