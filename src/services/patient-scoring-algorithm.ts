import {weightParameter} from '../const.js';
import {distanceBetweenCoordinates} from '../helpers/distance-between-coordinates.helper';
import {getDatasetMinMaxValues} from '../helpers/get-dataset-min-max-values.helper';
import {Normalization} from '../helpers/normalization.helper.js';
import {LocationModel} from '../models/location.model';
import {PatientModel} from '../models/patient.model';
import {type DatasetMinMaxValues} from '../types/dataset-min-max-values.type';
import {type PatientFacilityModel} from '../types/patient-facility.type';

export class PatientScoringAlgorithm {
  public readonly dataset: PatientFacilityModel[];
  public datasetMinMaxValues!: DatasetMinMaxValues;

  constructor(dataset: PatientModel[]) {
    //  Validate the dataset before using it
    if (!Array.isArray(dataset) || dataset.length === 0) {
      throw new Error('Invalid dataset');
    }

    this.dataset = dataset.map(row => new PatientModel(row));
  }

  public getPatientList(facilityLocation: LocationModel) {
    //  Validate location before use it
    facilityLocation = new LocationModel(facilityLocation);

    this.calculateDistanceToFacility(facilityLocation);
    this.normalizeValues();
    this.calculateScore();

    console.log(this.dataset);
    console.log(this.datasetMinMaxValues);
  }

  /**
   * We need to calculate the distance between the facility and each pacient
   * @param facilityLocation
   */
  private calculateDistanceToFacility(facilityLocation: LocationModel) {
    for (const patient of this.dataset) {
      patient.distanceToFacility = distanceBetweenCoordinates(patient.location, facilityLocation);
    }
  }

  /**
   * In order to compare values with different scales, we need to normalize them (Put them in a scale from 0 to 1)
   * Reference: https://www.codecademy.com/article/normalization
   */
  private normalizeValues() {
    this.datasetMinMaxValues = getDatasetMinMaxValues(this.dataset);

    for (const patient of this.dataset) {
      patient.ageNormalize = Normalization.minMaxNormalize(patient.age, this.datasetMinMaxValues.age);
      patient.distanceToFacilityNormalize = Normalization.minMaxNormalize(patient.distanceToFacility!, this.datasetMinMaxValues.distanceToFacility);
      patient.acceptedOffersNormalize = Normalization.minMaxNormalize(patient.acceptedOffers, this.datasetMinMaxValues.acceptedOffers);
      patient.canceledOffersNormalize = Normalization.minMaxNormalize(patient.canceledOffers, this.datasetMinMaxValues.canceledOffers);
      patient.averageReplyTimeNormalize = Normalization.minMaxNormalize(patient.averageReplyTime, this.datasetMinMaxValues.averageReplyTime);
    }
  }

  /**
   * Apply the weight to each normalized value of each pacient
   */
  private calculateScore() {
    //  Calculate the score for each patient
    for (const patient of this.dataset) {
      patient.score = 0
        + ((patient.ageNormalize! + weightParameter.age.correlation) * weightParameter.age.percentage)
        + ((patient.distanceToFacilityNormalize! + weightParameter.distanceToFacility.correlation) * weightParameter.distanceToFacility.percentage)
        + ((patient.acceptedOffersNormalize! + weightParameter.acceptedOffers.correlation) * weightParameter.acceptedOffers.percentage)
        + ((patient.canceledOffersNormalize! + weightParameter.canceledOffers.correlation) * weightParameter.canceledOffers.percentage)
        + ((patient.averageReplyTimeNormalize! + weightParameter.averageReplyTime.correlation) * weightParameter.averageReplyTime.percentage);
    }

    //  Normalize the values
    // const scoreMinMaxValues = {
    //   min: Math.min(...this.dataset.map(row => row.score!)),
    //   max: Math.max(...this.dataset.map(row => row.score!)),
    // };

    // For (const patient of this.dataset) {
    //   patient.score = Normalization.minMaxNormalize(patient.score!, scoreMinMaxValues);
    // }
  }
}

