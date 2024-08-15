import { Injectable } from '@nestjs/common';
import { RankingService } from '@/ranking/ranking.service';
import { PatientsSearchQuery } from './patients.search-query';
import { RankedPatient } from '@/ranking/ranking.type';
import { PatientsRepository } from './patients.repository';
import { Patient } from './patients.type';

@Injectable()
export class PatientsUseCase {
  constructor(
    private _patientsRepository: PatientsRepository,
    private _rankingService: RankingService,
  ) {}

  /**
   *
   * @param patient item with behaviorScore, demographicScore and score
   * @returns object without any score
   */
  private toPatient(patient: RankedPatient): Patient {
    return {
      id: patient.id,
      name: patient.name,
      location: {
        latitude: patient.location.latitude,
        longitude: patient.location.longitude,
      },
      age: patient.age,
      acceptedOffers: patient.acceptedOffers,
      canceledOffers: patient.canceledOffers,
      averageReplyTime: patient.averageReplyTime,
    };
  }

  /**
   *
   * @param param0 object with lat, long, perPage, page and percentLittleBehavior
   * @returns array of patients based in the params information
   */
  public getWaitlist({
    lat,
    long,
    perPage,
    page,
    percentLittleBehavior,
  }: PatientsSearchQuery) {
    const patients = this._patientsRepository.getWaitlist();

    const { patientsWithLittleBehaviorScore, patientsBetterRanked } =
      this._rankingService.rankPatients(patients, {
        latitude: lat,
        longitude: long,
      });

    const littleBehaviorQnt = Math.ceil(
      perPage * (percentLittleBehavior / 100),
    );

    const betterRankedPerPage = perPage - littleBehaviorQnt;
    const startAtBetterRanked = (page - 1) * betterRankedPerPage;
    const endAtBetterRanked = startAtBetterRanked + betterRankedPerPage;

    const littleBehaviorScorePerPage = littleBehaviorQnt;
    const startAtLittleBehaviorScore = (page - 1) * littleBehaviorScorePerPage;
    const endAtLittleBehaviorScore =
      startAtLittleBehaviorScore + littleBehaviorScorePerPage;

    const patientsBehavior = patientsWithLittleBehaviorScore.slice(
      startAtLittleBehaviorScore,
      endAtLittleBehaviorScore,
    );

    const patientsScore = patientsBetterRanked.slice(
      startAtBetterRanked,
      endAtBetterRanked,
    );

    const patientsWithoutDuplicates = [
      ...new Set([...patientsScore, ...patientsBehavior]),
    ];

    return patientsWithoutDuplicates.map(this.toPatient);
  }
}
