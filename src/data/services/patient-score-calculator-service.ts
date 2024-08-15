import type {
  IPatientDataNormalizerService,
  IPatientScoreCalculatorService,
} from "@/domain/services";
import type { Patient } from "@/domain/models";
import type { MinMaxPatientValues } from "@/domain/protocols";

export class PatientScoreCalculatorService
  implements IPatientScoreCalculatorService
{
  WEIGHT = {
    age: 0.1,
    distance: 0.1,
    acceptedOffers: 0.3,
    canceledOffers: 0.3,
    replyTime: 0.2,
  };

  constructor(private readonly normalizer: IPatientDataNormalizerService) {}

  calculate(patient: Required<Patient>, minMaxValues: MinMaxPatientValues) {
    const normalizedFields = this.normalizer.normalize(patient, minMaxValues);

    const { age, distance, acceptedOffers, averageReplyTime, canceledOffers } =
      normalizedFields;

    const littleBehaviorScore =
      10 *
      (acceptedOffers * this.WEIGHT.acceptedOffers +
        canceledOffers * this.WEIGHT.canceledOffers +
        averageReplyTime * this.WEIGHT.replyTime);

    const demographicScore =
      10 * (age * this.WEIGHT.age + distance * this.WEIGHT.distance);

    const scoreOriginal = demographicScore + littleBehaviorScore;

    const score = scoreOriginal < 0 ? 0 : scoreOriginal;

    return {
      score,
      distancePenalty: distance < 0 ? distance : 0,
      littleBehaviorScore,
    };
  }
}
