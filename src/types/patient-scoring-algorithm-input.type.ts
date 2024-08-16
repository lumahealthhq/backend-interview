import {type PatientModel} from '../models/patient.model';
import type {WeightParameterConfig} from './config.type';

export type PatientScoringAlgorithmInput = {
  dataset: PatientModel[];
  weightParameter?: WeightParameterConfig;
  resultLimitParameter?: number;
  usersFromPatientsWithInsufficientBehaviorDataLimit?: number;
};
