import type { Patient } from "../../../domain/models";
import type { IPatientScoreCalculatorService } from "../../../../src/domain/services";
import type { MinMaxPatientValues } from "../../../domain/protocols";

export class PatientScoreCalculatorSpy
  implements IPatientScoreCalculatorService
{
  WEIGHT = {
    age: 0.1,
    distance: 0.1,
    acceptedOffers: 0.3,
    canceledOffers: 0.3,
    replyTime: 0.2,
  };

  input?: any;
  result?: IPatientScoreCalculatorService.Result;
  calculate(patient: Required<Patient>, minMaxValues: MinMaxPatientValues) {
    this.input = { patient, minMaxValues };

    return (
      this.result || {
        score: 0.5,
        littleBehaviorScore: 0.2,
      }
    );
  }
}
