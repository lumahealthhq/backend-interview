import { Test, TestingModule } from '@nestjs/testing';
import { NormalizationService } from './normalization.service';

describe('NormalizationService', () => {
  let service: NormalizationService;
  const MAX_VALUE = 300;
  const MIN_VALUE = 50;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NormalizationService],
    }).compile();

    service = module.get<NormalizationService>(NormalizationService);
  });

  it(`GIVEN a max value equal to ${MAX_VALUE}
      AND min value equal to ${MIN_VALUE}
      WHEN call positiveNormalization with value equal to 150
      THEN should return 4.6`, () => {
    const result = service.positiveNormalization(150, MIN_VALUE, MAX_VALUE);
    expect(result).toBe(4.6);
  });

  it(`GIVEN a max value equal to ${MAX_VALUE}
      AND min value equal to ${MIN_VALUE}
      WHEN call negativeNormalization with value equal to 150
      THEN should return 6.4`, () => {
    const result = service.negativeNormalization(150, MIN_VALUE, MAX_VALUE);
    expect(result).toBe(6.4);
  });

  it(`GIVEN a max value equal to min value
      WHEN call positiveNormalization with value equal to 150
      THEN should return 5.5`, () => {
    const result = service.positiveNormalization(150, MAX_VALUE, MAX_VALUE);
    expect(result).toBe(5.5);
  });

  it(`GIVEN a max value equal to min value
      WHEN call negativeNormalization with value equal to 150
      THEN should return 5.5`, () => {
    const result = service.negativeNormalization(150, MAX_VALUE, MAX_VALUE);
    expect(result).toBe(5.5);
  });
});
