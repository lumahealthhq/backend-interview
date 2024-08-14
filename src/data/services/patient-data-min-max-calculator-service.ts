import type { IPatientDataMinMaxCalculatorService } from "../../domain/services";

export class PatientDataMinMaxCalculatorService
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

  calculate(patients: Patient[]): MinMaxPatientValues {
    const values = this.defaultValues;

    patients.forEach(
      ({ acceptedOffers, age, canceledOffers, averageReplyTime }) => {
        values.age.max = Math.max(values.age.max, age);
        values.age.min = Math.min(values.age.min, age);

        values.acceptedOffers.max = Math.max(
          values.acceptedOffers.max,
          acceptedOffers
        );
        values.acceptedOffers.min = Math.min(
          values.acceptedOffers.min,
          acceptedOffers
        );

        values.canceledOffers.max = Math.max(
          values.canceledOffers.max,
          canceledOffers
        );
        values.canceledOffers.min = Math.min(
          values.canceledOffers.min,
          canceledOffers
        );

        values.averageReplyTime.max = Math.max(
          values.averageReplyTime.max,
          averageReplyTime
        );
        values.averageReplyTime.min = Math.min(
          values.averageReplyTime.min,
          averageReplyTime
        );
      }
    );

    return values;
  }
}
