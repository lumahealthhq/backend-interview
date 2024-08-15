import { Test, TestingModule } from '@nestjs/testing';
import { PatientsRepository } from './patients.repository';

jest.mock('../../sample-data/patients.json', () => ({
  __esModule: true, // this property makes it work
  default: [],
}));

describe('PatientsRepository', () => {
  let service: PatientsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatientsRepository],
    }).compile();

    service = module.get<PatientsRepository>(PatientsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it(`GIVEN a PatientsRepository
      WHEN call getWaitlist
      THEN should return an Array`, () => {
    const result = service.getWaitlist();
    expect(result).toBeInstanceOf(Array);
  });
});
