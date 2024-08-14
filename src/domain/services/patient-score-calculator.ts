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
