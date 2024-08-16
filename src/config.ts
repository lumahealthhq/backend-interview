import {random} from 'lodash';
import {type WeightParameterConfig} from './types/config.type';

/**
 * Correlation here means the higher the value, the better the result.
 */
export const weightParameter: WeightParameterConfig = {
  age: {percentage: 10, correlation: 0}, //  10%
  distanceToFacility: {percentage: 10, correlation: 1}, //  10%
  acceptedOffers: {percentage: 30, correlation: 0}, //  30%
  canceledOffers: {percentage: 30, correlation: 1}, //  30%
  averageReplyTime: {percentage: 20, correlation: 1}, //  20%
};

/**
 * The maximum number of results to return
 */
export const resultLimitParameter = 10;

/**
 * The number of users to return for patients with fewer behavior data.
 * We use a random number to allow users to be selected from both the list with fewer behavior data and the list with the better score.
 *
 * With this we can change the % of users to be selected from both of the lists
 */
export const randomUsersFromPatientsWithInsufficientBehaviorDataLimit = () => random(0, resultLimitParameter);
