import type { Patient } from "@/domain/models";
import type { MinMaxPatientValues } from "@/domain/protocols";

export interface IPatientDataMinMaxCalculatorService {
  calculate(patients: Patient[]): MinMaxPatientValues;
}
