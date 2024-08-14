import type { Patient } from "../models";
import type { MinMaxPatientValues } from "../protocols";

export interface IPatientDataNormalizerService {
  normalizeField(value: number, min: number, max: number): number;

  normalize(
    patient: Required<Patient>,
    minMaxValues: MinMaxPatientValues
  ): IPatientDataNormalizerService.Result;
}

export namespace IPatientDataNormalizerService {
  export type Result = {
    age: number;
    distance: number;
    acceptedOffers: number;
    canceledOffers: number;
    averageReplyTime: number;
  };
}
