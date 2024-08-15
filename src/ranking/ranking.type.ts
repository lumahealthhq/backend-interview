import { Patient } from '@/patients/patients.type';

export type PatientWithDistance = Patient & {
  distance: number;
};

export type RankedPatient = PatientWithDistance & {
  demographicScore: number;
  behaviorScore: number;
  score: number;
};

export type Range = {
  min: number;
  max: number;
};
