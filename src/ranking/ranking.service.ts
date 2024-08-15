import { Injectable } from '@nestjs/common';
import { DistanceService } from '@/distance/distance.service';
import { Position } from '@/distance/distance.type';
import { NormalizationService } from '@/normalization/normalization.service';
import { Patient } from '@/patients/patients.type';
import { PatientWithDistance, Range, RankedPatient } from './ranking.type';

@Injectable()
export class RankingService {
  private DISTANCE_WEIGHT = 0.1;
  private AGE_WEIGHT = 0.1;
  private ACCEPTED_OFFERS_WEIGHT = 0.3;
  private CANCELED_OFFERS_WEIGHT = 0.3;
  private AVARAGE_REPLY_TIME_WEIGHT = 0.2;

  constructor(
    private _normalizationService: NormalizationService,
    private _distanceService: DistanceService,
  ) {}

  /**
   *
   * @param patients Array of patients with distance
   * @returns the range min and max of age, acceptedOffers, canceledOffers, averageReplyTime and distance
   */
  private getMinAndMaxValues(patients: PatientWithDistance[]) {
    let age: Range = { min: Infinity, max: -Infinity };
    let acceptedOffers: Range = {
      min: Infinity,
      max: -Infinity,
    };
    let canceledOffers: Range = {
      min: Infinity,
      max: -Infinity,
    };
    let averageReplyTime: Range = {
      min: Infinity,
      max: -Infinity,
    };
    let distance: Range = {
      min: Infinity,
      max: -Infinity,
    };

    patients.forEach((patient) => {
      const {
        age: pAge,
        acceptedOffers: pAcceptedOffers,
        canceledOffers: pCanceledOffers,
        averageReplyTime: pAverageReplyTime,
        distance: pDistance,
      } = patient;

      age = {
        min: Math.min(age.min, pAge),
        max: Math.max(age.max, pAge),
      };
      acceptedOffers = {
        min: Math.min(acceptedOffers.min, pAcceptedOffers),
        max: Math.max(acceptedOffers.max, pAcceptedOffers),
      };
      canceledOffers = {
        min: Math.min(canceledOffers.min, pCanceledOffers),
        max: Math.max(canceledOffers.max, pCanceledOffers),
      };
      averageReplyTime = {
        min: Math.min(averageReplyTime.min, pAverageReplyTime),
        max: Math.max(averageReplyTime.max, pAverageReplyTime),
      };
      distance = {
        min: Math.min(distance.min, pDistance),
        max: Math.max(distance.max, pDistance),
      };
    });

    return {
      age,
      acceptedOffers,
      canceledOffers,
      averageReplyTime,
      distance,
    };
  }

  /**
   *
   * Younger patients have a better score than older patients.
   * @param value value to be normalized
   * @param params the min and max range
   * @returns value normalized
   */
  private normalizeAge(value: number, params: Range) {
    return this._normalizationService.negativeNormalization(
      value,
      params.min,
      params.max,
    );
  }

  /**
   *
   * Patients who accept more offers are ranked higher.
   * @param value value to be normalized
   * @param params the min and max range
   * @returns value normalized
   */
  private normalizeAcceptedOffers(value: number, params: Range) {
    return this._normalizationService.positiveNormalization(
      value,
      params.min,
      params.max,
    );
  }

  /**
   *
   * Patients who cancel fewer offers are ranked higher.
   * @param value value to be normalized
   * @param params the min and max range
   * @returns value normalized
   */
  private normalizeCanceledOffers(value: number, params: Range) {
    return this._normalizationService.negativeNormalization(
      value,
      params.min,
      params.max,
    );
  }

  /**
   *
   * Patients with a shorter average reply time are ranked higher.
   * @param value value to be normalized
   * @param params the min and max range
   * @returns value normalized
   */
  private normalizeAverageReplyTime(value: number, params: Range) {
    return this._normalizationService.negativeNormalization(
      value,
      params.min,
      params.max,
    );
  }

  /**
   *
   * Patients who are closer are ranked higher.
   * @param value value to be normalized
   * @param params the min and max range
   * @returns value normalized
   */
  private normalizeDistance(value: number, params: Range) {
    return this._normalizationService.negativeNormalization(
      value,
      params.min,
      params.max,
    );
  }

  /**
   *
   * @param patients list of patients
   * @param location location to calculate distance between location and patients
   * @returns list of patients with behaviorScore, demographicScore and general score
   */
  private appendScoresToPatient(patients: Patient[], location: Position) {
    const patientsWithDistance: PatientWithDistance[] = patients.map(
      (patient) => ({
        ...patient,
        distance: this._distanceService.calculateDistance(
          {
            latitude: Number(patient.location.latitude),
            longitude: Number(patient.location.longitude),
          },
          location,
        ),
      }),
    );

    const { age, acceptedOffers, canceledOffers, averageReplyTime, distance } =
      this.getMinAndMaxValues(patientsWithDistance);

    const patientWithScores: RankedPatient[] = patientsWithDistance.map(
      (patient) => {
        const ageScore = this.normalizeAge(patient.age, age);
        const acceptedOffersScore = this.normalizeAcceptedOffers(
          patient.acceptedOffers,
          acceptedOffers,
        );
        const canceledOffersScore = this.normalizeCanceledOffers(
          patient.canceledOffers,
          canceledOffers,
        );
        const averageReplyTimeScore = this.normalizeAverageReplyTime(
          patient.averageReplyTime,
          averageReplyTime,
        );
        const distanceScore = this.normalizeDistance(
          patient.distance,
          distance,
        );

        const demographicScore =
          ageScore * this.AGE_WEIGHT + distanceScore * this.DISTANCE_WEIGHT;
        const behaviorScore =
          acceptedOffersScore * this.ACCEPTED_OFFERS_WEIGHT +
          canceledOffersScore * this.CANCELED_OFFERS_WEIGHT +
          averageReplyTimeScore * this.AVARAGE_REPLY_TIME_WEIGHT;

        return {
          ...patient,
          behaviorScore,
          demographicScore,
          score: demographicScore + behaviorScore,
        };
      },
    );

    return patientWithScores;
  }

  /**
   *
   * @param array Array to be sorted
   * @param property property of object item to use to sorte
   * @param mode if is ascending or descending order
   * @returns sorted array based in the property and mode
   */
  private sortBy(
    array: any[],
    property: keyof RankedPatient,
    mode: 'ASC' | 'DESC',
  ): RankedPatient[] {
    return array
      .slice()
      .sort((patientA, patientB) =>
        mode === 'ASC'
          ? (patientA[`${property}`] as any) - (patientB[`${property}`] as any)
          : (patientB[`${property}`] as any) - (patientA[`${property}`] as any),
      );
  }

  /**
   *
   * @param patients patients to be ranked
   * @param location location to calculate the distance
   * @returns patientsBetterRanked is the array with patients ranked by socre in descending order (better general score come first)
   * and patientsWithLittleBehaviorScore is the array with patients ranked by behavior in ascending order (worst behavior score come first)
   */
  public rankPatients(
    patients: Patient[],
    location: Position,
  ): {
    patientsWithLittleBehaviorScore: RankedPatient[];
    patientsBetterRanked: RankedPatient[];
  } {
    const patientsWithScores = this.appendScoresToPatient(patients, location);

    const patientsWithLittleBehaviorScore = this.sortBy(
      patientsWithScores,
      'behaviorScore',
      'ASC',
    );

    const patientsBetterRanked = this.sortBy(
      patientsWithScores,
      'score',
      'DESC',
    );

    return {
      patientsWithLittleBehaviorScore,
      patientsBetterRanked,
    };
  }
}
