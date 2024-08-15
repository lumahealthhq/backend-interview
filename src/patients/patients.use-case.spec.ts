import { Test, TestingModule } from '@nestjs/testing';
import { PatientsUseCase } from './patients.use-case';
import { RankingModule } from '@/ranking/ranking.module';
import { PatientsRepository } from './patients.repository';
import { Patient } from './patients.type';
import { Position } from '@/distance/distance.type';

describe('PatientsUseCase', () => {
  let service: PatientsUseCase;
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

  const PATIENTS_RANKED_BY_BEHAVIOR: Patient[] = [
    PATIENTS[0],
    PATIENTS[3],
    PATIENTS[2],
    PATIENTS[1],
  ];

  const PATIENTS_RANKED_BY_SCORE: Patient[] = [
    PATIENTS[2],
    PATIENTS[1],
    PATIENTS[3],
    PATIENTS[0],
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RankingModule],
      providers: [
        PatientsUseCase,
        {
          provide: PatientsRepository,
          useValue: {
            getWaitlist() {
              return PATIENTS;
            },
          },
        },
      ],
    }).compile();

    service = module.get<PatientsUseCase>(PatientsUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it(`GIVEN a call to getWaitlist
      WHEN position is { latitude: 39, longitude: 138 }
      AND page is 1
      AND perPage is 2
      AND percentLittleBehavior is 30
      THEN should return a list with 2 itens
      AND one item should be the best patient ranked
      AND the other one should be the little behavior`, () => {
    const perPage = 2;
    const result = service.getWaitlist({
      page: 1,
      perPage,
      percentLittleBehavior: 30,
      lat: POSITION.latitude,
      long: POSITION.longitude,
    });

    expect(result).toHaveLength(perPage);

    expect(result).toStrictEqual([
      PATIENTS_RANKED_BY_SCORE[0],
      PATIENTS_RANKED_BY_BEHAVIOR[0],
    ]);
  });

  it(`GIVEN a call to getWaitlist
      WHEN position is { latitude: 39, longitude: 138 }
      AND page is 2
      AND perPage is 2
      AND percentLittleBehavior is 30
      THEN should return a list with 2 itens
      AND one item should be the best patient ranked
      AND the other one should be the little behavior`, () => {
    const perPage = 2;
    const result = service.getWaitlist({
      page: 2,
      perPage,
      percentLittleBehavior: 30,
      lat: POSITION.latitude,
      long: POSITION.longitude,
    });

    expect(result).toHaveLength(perPage);

    expect(result).toStrictEqual([
      PATIENTS_RANKED_BY_SCORE[1],
      PATIENTS_RANKED_BY_BEHAVIOR[1],
    ]);
  });
});
