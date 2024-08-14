import type { Patient } from "../models";
import type { MinMaxPatientValues } from "../protocols";

export interface IPatientScoreCalculatorService {
  calculate(
    patient: Required<Patient>,
    minMaxValues: MinMaxPatientValues
  ): IPatientScoreCalculatorService.Result;
}

export namespace IPatientScoreCalculatorService {
  export type Result = {
    score: number;
    littleBehaviorScore: number;
  };
}
