import { Test, TestingModule } from '@nestjs/testing';
import { PatientsController } from './patients.controller';
import { PatientsUseCase } from './patients.use-case';
import { Patient } from './patients.type';
import { Position } from '@/distance/distance.type';
import { PatientsRepository } from './patients.repository';
import { RankingModule } from '@/ranking/ranking.module';

describe('PatientsController', () => {
  let controller: PatientsController;
  const POSITION: Position = { latitude: 39, longitude: 138 };
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
      controllers: [PatientsController],
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

    controller = module.get<PatientsController>(PatientsController);
  });

  it(`GIVEN a call to getWaitlist
      WHEN position is { latitude: 39, longitude: 138 }
      AND page is 1
      AND perPage is 2
      AND percentLittleBehavior is 30
      THEN should return a list with 2 itens
      AND one item should be the best patient ranked
      AND the other one should be the little behavior`, () => {
    const result = controller.getWaitlist({
      page: 1,
      perPage: 2,
      percentLittleBehavior: 30,
      lat: POSITION.latitude,
      long: POSITION.longitude,
    });

    expect(result).toStrictEqual([
      PATIENTS_RANKED_BY_SCORE[0],
      PATIENTS_RANKED_BY_BEHAVIOR[0],
    ]);
  });
});
