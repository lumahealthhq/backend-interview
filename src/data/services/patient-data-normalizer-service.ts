import type { IPatientDataNormalizerService } from "../../domain/services";

export class PatientDataNormalizerService
  implements IPatientDataNormalizerService
{
  /**
   * @param value Must be greater than min and less than max
   * @returns A number between 0 and 1, representing how close "value" is to either "max" or "min".
   */
  normalizeField(value: number, min: number, max: number): number {
    // ? Avoid division by 0. Returning 0.5 because it's common ground.
    if (max === min) return 0.5;

    return Math.abs(value - min) / Math.abs(max - min);
  }

  /**
   * Used to scale a value to a range between 0 and 1, based on given min and max value.
   * Useful to compare different metrics with different units or ranges.
   * Normalize the metrics mean bringing them to a common scale, allowing them to be weighted for scoring or ranking.
   *
   * @param patient
   * @param minMaxValues
   */
  normalize(patient: Required<Patient>, minMaxValues: MinMaxPatientValues) {
    // ? Assuming distances min=100 and max=0
    // ? The closer to the office, the higher the chance of accepting the appointment
    const distanceMax = 100;
    const distance =
      patient.distance > distanceMax
        ? 0
        : this.normalizeField(patient.distance, distanceMax, 0);

    // ? The younger, the higher the chance of accepting the appointment
    const age = this.normalizeField(
      patient.age,
      minMaxValues.age.max,
      minMaxValues.age.min
    );

    // ? The higher the amount of accepted offers, higher the possibility of accepting an offer
    const acceptedOffers = this.normalizeField(
      patient.acceptedOffers,
      minMaxValues.acceptedOffers.min,
      minMaxValues.acceptedOffers.max
    );

    // ? The lower the amount of canceled offers, the higher the possibility of accepting an offer
    const canceledOffers = this.normalizeField(
      patient.canceledOffers,
      minMaxValues.canceledOffers.max,
      minMaxValues.canceledOffers.min
    );

    // ? The lower the reply time, higher the possibility of accepting an offer
    const averageReplyTime = this.normalizeField(
      patient.averageReplyTime,
      minMaxValues.averageReplyTime.max,
      minMaxValues.averageReplyTime.min
    );

    return {
      age,
      distance,
      acceptedOffers,
      canceledOffers,
      averageReplyTime,
    };
  }
}