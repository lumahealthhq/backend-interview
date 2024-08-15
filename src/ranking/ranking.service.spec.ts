import { Test, TestingModule } from '@nestjs/testing';
import { DistanceModule } from '@/distance/distance.module';
import { Position } from '@/distance/distance.type';
import { NormalizationModule } from '@/normalization/normalization.module';
import { Patient } from '@/patients/patients.type';
import { RankingService } from './ranking.service';

describe('RankingService', () => {
  let service: RankingService;
  const PATIENTS: Patient[] = [
    {
      id: '1745bab0-8fdf-4dc7-9eb9-984a7ab246c3',
      name: 'Ford Farrell',
      location: { latitude: '-41.4158', longitude: '-57.9107' },
      age: 22,
      acceptedOffers: 0,
      canceledOffers: 93,
      averageReplyTime: 738,
    },
    {
      id: '88eac218-d96c-45f1-8e5a-b171cc6339a9',
      name: 'Cleta Hintz',
      location: { latitude: '-58.4370', longitude: '-67.4155' },
      age: 51,
      acceptedOffers: 63,
      canceledOffers: 83,
      averageReplyTime: 1171,
    },
    {
      id: '7507327c-28df-459f-a987-090daf2aab10',
      name: 'Neoma Konopelski DDS',
      location: { latitude: '77.9889', longitude: '151.2630' },
      age: 28,
      acceptedOffers: 19,
      canceledOffers: 1,
      averageReplyTime: 2625,
    },
    {
      id: '7311dda9-70fd-482d-87e6-238becbacc69',
      name: 'Autumn Boehm',
      location: { latitude: '66.1983', longitude: '18.8214' },
      age: 80,
      acceptedOffers: 11,
      canceledOffers: 38,
      averageReplyTime: 2296,
    },
  ];
  const POSITION: Position = { latitude: 39, longitude: 138 };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [NormalizationModule, DistanceModule],
      providers: [RankingService],
    }).compile();

    service = module.get<RankingService>(RankingService);
  });

  it(`GIVEN a list of patients
      AND a position
      WHEN call rankPatients
      THEN should return a object with patients ranked in descendant order by total score
      AND patients ranked in ascending order by behavior score`, () => {
    const result = service.rankPatients(PATIENTS, POSITION);

    const patientsWithLittleBehaviorScoreResult = [
      PATIENTS[0].id,
      PATIENTS[3].id,
      PATIENTS[2].id,
      PATIENTS[1].id,
    ];

    const patientsBetterRankedResult = [
      PATIENTS[2].id,
      PATIENTS[1].id,
      PATIENTS[3].id,
      PATIENTS[0].id,
    ];

    expect(result.patientsBetterRanked.map(({ id }) => id)).toStrictEqual(
      patientsBetterRankedResult,
    );
    expect(
      result.patientsWithLittleBehaviorScore.map(({ id }) => id),
    ).toStrictEqual(patientsWithLittleBehaviorScoreResult);
  });

  it(`GIVEN a list of patients
      AND a position
      WHEN call rankPatients
      THEN should return a array of patients with this properties: behaviorScore, demographicScore, score and distance`, () => {
    const result = service.rankPatients(PATIENTS, POSITION);

    const patientBetterRanked = result.patientsBetterRanked[0];
    const patientWithLittleBehaviorScore =
      result.patientsWithLittleBehaviorScore[0];

    expect(patientBetterRanked.behaviorScore).toEqual(expect.any(Number));
    expect(patientBetterRanked.demographicScore).toEqual(expect.any(Number));
    expect(patientBetterRanked.score).toEqual(expect.any(Number));
    expect(patientBetterRanked.distance).toEqual(expect.any(Number));

    expect(patientWithLittleBehaviorScore.behaviorScore).toEqual(
      expect.any(Number),
    );
    expect(patientWithLittleBehaviorScore.demographicScore).toEqual(
      expect.any(Number),
    );
    expect(patientWithLittleBehaviorScore.score).toEqual(expect.any(Number));
    expect(patientWithLittleBehaviorScore.distance).toEqual(expect.any(Number));
  });
});
