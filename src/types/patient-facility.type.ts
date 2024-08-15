import {type PatientModel} from '../models/patient.model';

export type PatientFacilityModel = {
  distanceToFacility?: number;

  ageNormalize?: number;
  distanceToFacilityNormalize?: number;
  acceptedOffersNormalize?: number;
  canceledOffersNormalize?: number;
  averageReplyTimeNormalize?: number;

  score?: number;
} & PatientModel;
