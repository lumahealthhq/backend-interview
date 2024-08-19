import fs from 'fs/promises';
import path from 'path';
import PatientsJsonRepositoryImpl from './patients-json-file.repository.impl';

jest.mock('fs/promises');
jest.mock('path');

describe('PatientsJsonRepositoryImpl', () => {
  let repository: PatientsJsonRepositoryImpl;

  beforeEach(() => {
    repository = new PatientsJsonRepositoryImpl();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getPatientsWaitlist', () => {
    it('should return an array of patients', async () => {
      const mockPatients = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'John Doe',
          age: 30,
          acceptedOffers: 2,
          canceledOffers: 1,
          averageReplyTime: 3600,
          location: {
            latitude: 40.7128,
            longitude: -74.0060,
          },
        },
      ];

      (path.join as jest.Mock).mockReturnValue('/mock/path/patients.json');
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockPatients));

      const result = await repository.getPatientsWaitlist();

      expect(result).toEqual(mockPatients);
      expect(fs.readFile).toHaveBeenCalledWith('/mock/path/patients.json', 'utf-8');
    });

    it('should throw an error if the JSON is invalid', async () => {
      (path.join as jest.Mock).mockReturnValue('/mock/path/patients.json');
      (fs.readFile as jest.Mock).mockResolvedValue('invalid json');

      await expect(repository.getPatientsWaitlist()).rejects.toThrow();
    });

    it('should throw an error if the data does not match the schema', async () => {
      const invalidData = [
        {
          id: 'not-a-uuid',
          name: 'John Doe',
          age: 'not-a-number',
          acceptedOffers: -1,
          canceledOffers: 'not-a-number',
          averageReplyTime: -1,
          location: {
            latitude: 200,
            longitude: -200,
          },
        },
      ];

      (path.join as jest.Mock).mockReturnValue('/mock/path/patients.json');
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(invalidData));

      await expect(repository.getPatientsWaitlist()).rejects.toThrow();
    });
  });
});
