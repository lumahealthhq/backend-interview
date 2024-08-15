import type { Patient } from "@/domain/models";
import type { MinMaxPatientValues } from "@/domain/protocols";
import type { IPatientDataNormalizerService } from "@/domain/services";

export class PatientDataNormalizerSpy implements IPatientDataNormalizerService {
  normalizeFieldInput?: any;
  normalizeFieldResult?: number;
  normalizeField(value: number, min: number, max: number) {
    this.normalizeFieldInput = { value, min, max };

    return this.normalizeFieldResult || this.normalizeFieldInput;
  }

  normalizeInput?: any;
  normalizeResult?: IPatientDataNormalizerService.Result;
  normalize(patient: Required<Patient>, minMaxValues: MinMaxPatientValues) {
    this.normalizeInput = { patient, minMaxValues };

    return (
      this.normalizeResult || {
        age: 0.5,
        distance: 0.5,
        acceptedOffers: 0.5,
        averageReplyTime: 0.5,
        canceledOffers: 0.5,
      }
    );
  }
}
