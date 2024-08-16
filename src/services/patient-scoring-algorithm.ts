import _ from 'lodash';
import {randomUsersFromPatientsWithInsufficientBehaviorDataLimit, resultLimitParameter, weightParameter} from '../config';
import {InvalidDatasetException} from '../exceptions/invalid-dataset.exception';
import {calculateWeight} from '../helpers/calculate-weight.helper';
import {distanceBetweenCoordinates} from '../helpers/distance-between-coordinates.helper';
import {getDatasetMinMaxValues} from '../helpers/get-dataset-min-max-values.helper';
import {Normalization} from '../helpers/normalization.helper';
import {LocationModel} from '../models/location.model';
import {PatientResponseModel} from '../models/patient-response.model';
import {PatientModel} from '../models/patient.model';
import {type WeightParameterConfig} from '../types/config.type';
import {type DatasetMinMaxValues} from '../types/dataset-min-max-values.type';
import {type PatientFacilityModel} from '../types/patient-facility.type';
import {type PatientScoringAlgorithmInput} from '../types/patient-scoring-algorithm-input.type';

export class PatientScoringAlgorithm {
  public readonly dataset: PatientFacilityModel[];
  public readonly weightParameter: WeightParameterConfig;
  public readonly resultLimitParameter: number;
  public readonly usersFromPatientsWithInsufficientBehaviorDataLimit: number;

  public datasetMinMaxValues!: DatasetMinMaxValues;

  constructor(data: PatientScoringAlgorithmInput) {
    //  Validate the dataset before using it
    if (!Array.isArray(data.dataset) || data.dataset.length === 0) {
      throw new InvalidDatasetException();
    }

    this.dataset = data.dataset.map(row => new PatientModel(row));
    this.weightParameter = _.merge(weightParameter, data.weightParameter);
    this.resultLimitParameter = data.resultLimitParameter ?? resultLimitParameter;
    this.usersFromPatientsWithInsufficientBehaviorDataLimit = data.usersFromPatientsWithInsufficientBehaviorDataLimit ?? randomUsersFromPatientsWithInsufficientBehaviorDataLimit();
  }

  public getPatientList(facilityLocation: LocationModel): PatientResponseModel[] {
    //  Validate location before use it
    facilityLocation = new LocationModel(facilityLocation);

    this.enrichPatientData(facilityLocation);
    this.normalizeValues();
    this.calculateScore();

    return this.prioritizeUsersWithLimitedData();
  }

  /**
   * Enrich patient metadata values.
   * @param facilityLocation
   */
  private enrichPatientData(facilityLocation: LocationModel) {
    for (const patient of this.dataset) {
      patient.totalOffers = patient.acceptedOffers + patient.canceledOffers;
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
      const score: number = 0
        + calculateWeight(patient.ageNormalize!, this.weightParameter.age)
        + calculateWeight(patient.distanceToFacilityNormalize!, this.weightParameter.distanceToFacility)
        + calculateWeight(patient.acceptedOffersNormalize!, this.weightParameter.acceptedOffers)
        + calculateWeight(patient.canceledOffersNormalize!, this.weightParameter.canceledOffers)
        + calculateWeight(patient.averageReplyTimeNormalize!, this.weightParameter.averageReplyTime);

      patient.score = score / 10;
    }
  }

  /**
   * Prioritizes users with limited behavior data and combines them with users having the best scores.
   * This method sorts the dataset to identify users with the fewest behavior data points and users with the highest scores.
   * It then combines these two lists, ensuring the total number of users does not exceed the specified result limit.
   * @returns
   */
  private prioritizeUsersWithLimitedData(): PatientResponseModel[] {
    //  Sort the dataset to identify users with the fewer behavior data points
    const insufficientBehaviorDataList: PatientFacilityModel[] = this.dataset
      .sort((a, b) => a.totalOffers! - b.totalOffers!)
      .slice(0, this.usersFromPatientsWithInsufficientBehaviorDataLimit);

    //  Sort the dataset to identify users with the highest scores
    const scoreList = this.dataset
      .sort((a, b) => b.score! - a.score!)
      .slice(0, this.resultLimitParameter);

    return _(insufficientBehaviorDataList)
      .concat(scoreList)
      .uniqBy('id')
      .slice(0, this.resultLimitParameter)
      .sort((a, b) => b.score! - a.score!)
      .map(row => new PatientResponseModel(row))
      .value();
  }
}

