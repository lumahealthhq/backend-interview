import { jest } from '@jest/globals';
import app from './app.singleton';
import patientsRecommender from './app/patients/patients-recommender.singleton';
import * as PatientsRepositoryModule from './infra/repositories/patients/patients.repository';
import defaultRecommenderConfig from './domain/patients/patients-recommender-config';
import Patient from './@types/patient';
import PatientsRecommenderAdapter from './app/patients/patients-recommender';
import { RecommenderConfig } from './domain/patients/patients-recommender-config';
import { FastifyBaseLogger } from 'fastify';

// Mock dependencies
jest.mock('./interfaces/http/server', () => {
  return jest.fn().mockImplementation(() => ({
    getLogger: jest.fn().mockReturnValue({} as FastifyBaseLogger),
    start: jest.fn<() => Promise<void>>().mockResolvedValue()
  }));
});
jest.mock('./app/patients/patients-recommender');
jest.mock('./infra/repositories/patients/patients.repository');

describe('app singleton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should export a singleton instance of Application', () => {
    expect(app).toBeDefined();
    expect(app.patientsRecommender).toBeInstanceOf(PatientsRecommenderAdapter);
    expect(app['server']).toBeInstanceOf(Object);
    expect(app.logger).toBeDefined();
  });

  describe('start', () => {
    it('should call setup and start the server', async () => {
      await app.start();

      expect(app['server'].start).toHaveBeenCalledTimes(1);
    });
  });

  describe('setup', () => {
    it('should set up patientsRecommender with patients from repository', async () => {
      const mockPatients: Patient[] = [
        {
          id: '1',
          name: 'John Doe',
          location: {
            latitude: 40.7128,
            longitude: -74.0060
          },
          age: 30,
          acceptedOffers: 5,
          canceledOffers: 1,
          averageReplyTime: 300
        }
      ];

      const getPatientsWaitlistMock = jest.fn<() => Promise<Patient[]>>().mockResolvedValue(mockPatients);

      // Mock the entire PatientsRepository module
      (jest.spyOn(PatientsRepositoryModule, 'default') as any).mockImplementation(() => ({
        getPatientsWaitlist: getPatientsWaitlistMock,
        getPatientsSchema: jest.fn().mockReturnValue({} as any),
      }));

      const patientsRecommenderSetupMock = jest.fn<(config: RecommenderConfig, patients: Patient[]) => Promise<void>>().mockResolvedValue();
      (patientsRecommender as PatientsRecommenderAdapter).setup = patientsRecommenderSetupMock;

      await app.start();  // This will call the real setup method

      expect(getPatientsWaitlistMock).toHaveBeenCalledTimes(1);
      expect(patientsRecommenderSetupMock).toHaveBeenCalledWith(defaultRecommenderConfig, mockPatients);
    });
  });
});
