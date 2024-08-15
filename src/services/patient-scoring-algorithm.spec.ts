import {
  beforeEach, describe, expect, it,
} from '@jest/globals';
import sampleData from '../../sample-data/patients.json';
import {PatientModel} from '../models/patient.model';
import {PatientScoringAlgorithm} from './patient-scoring-algorithm';

describe(PatientScoringAlgorithm, () => {
  let mockDataset: PatientModel[];

  beforeEach(() => {
    mockDataset = sampleData.map(row => new PatientModel(row));
  });

  it('should instantiate PatientScoringAlgorithm with a dataset', () => {
    const algorithm = new PatientScoringAlgorithm(mockDataset);
    expect(algorithm.dataset).toEqual(mockDataset);
  });
});
