import { Test, TestingModule } from '@nestjs/testing';
import { DistanceService } from './distance.service';
import { Position } from './distance.type';

describe('DistanceService', () => {
  let service: DistanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DistanceService],
    }).compile();

    service = module.get<DistanceService>(DistanceService);
  });

  it(`GIVEN a positionA equal to { latitude: -40, longitude: -20 }
      AND a positionB equal to { latitude: 39, longitude: 138 }
      WHEN call calculateDistance
      THEN should return 18128.99246454286`, () => {
    const positionA: Position = { latitude: -40, longitude: -20 };
    const positionB: Position = { latitude: 39, longitude: 138 };

    const result = service.calculateDistance(positionA, positionB);
    expect(result).toBe(18128.99246454286);
  });

  it(`GIVEN a positionA equal to { latitude: -40, longitude: -20 }
      AND a positionB is equal to positionA
      WHEN call calculateDistance
      THEN should return 0`, () => {
    const positionA: Position = { latitude: -40, longitude: -20 };
    const positionB: Position = positionA;

    const result = service.calculateDistance(positionA, positionB);
    expect(result).toBe(0);
  });
});
