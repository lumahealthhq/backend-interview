export interface IPatientDataMinMaxCalculatorService {
  calculate(patients: Patient[]): MinMaxPatientValues;
}
