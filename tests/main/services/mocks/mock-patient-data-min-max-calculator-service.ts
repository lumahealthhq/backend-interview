import type { Patient } from "@/domain/models";
import type { MinMaxPatientValues } from "@/domain/protocols";
import type { IPatientDataMinMaxCalculatorService } from "@/domain/services";

export class PatientDataMinMaxCalculatorSpy
  implements IPatientDataMinMaxCalculatorService
{
  defaultValues = {
    age: {
      max: 0,
      min: Number.MAX_SAFE_INTEGER,
    },
    acceptedOffers: {
      max: 0,
      min: Number.MAX_SAFE_INTEGER,
    },
    canceledOffers: {
      max: 0,
      min: Number.MAX_SAFE_INTEGER,
    },
    averageReplyTime: {
      max: 0,
      min: Number.MAX_SAFE_INTEGER,
    },
  };

  input?: any;
  result?: MinMaxPatientValues;
  calculate(patients: Patient[]): MinMaxPatientValues {
    this.input = patients;

    return (
      this.result || {
        age: { min: 10, max: 100 },
        acceptedOffers: { min: 0, max: 100 },
        canceledOffers: { min: 10, max: 100 },
        averageReplyTime: { min: 30, max: 3000 },
      }
    );
  }
}
