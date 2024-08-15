import type { Patient } from "@/domain/models";
import type { MinMaxPatientValues } from "@/domain/protocols";

export interface IPatientScoreCalculatorService {
  calculate(
    patient: Required<Patient>,
    minMaxValues: MinMaxPatientValues
  ): IPatientScoreCalculatorService.Result;
}

export namespace IPatientScoreCalculatorService {
  export type Result = {
    score: number;
    distancePenalty: number;
    littleBehaviorScore: number;
  };
}
