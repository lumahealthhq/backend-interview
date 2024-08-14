import type { Patient } from "../models";
import type { MinMaxPatientValues } from "../protocols";

export interface IPatientDataMinMaxCalculatorService {
  calculate(patients: Patient[]): MinMaxPatientValues;
}
