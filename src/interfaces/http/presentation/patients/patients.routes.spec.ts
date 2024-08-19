import patientsRoutes from './patients.routes';
import patientsSchemas from './patients.schema';
import { RecommendPatientsController } from './patients.controller';

jest.mock('./patients.schema', () => ({
  recommendPatients: {
    // mock the schema structure as needed
  }
}));

jest.mock('./patients.controller', () => ({
  RecommendPatientsController: jest.fn()
}));

describe('patientsRoutes', () => {
  it('should be an array', () => {
    expect(Array.isArray(patientsRoutes)).toBe(true);
  });

  it('should contain one route', () => {
    expect(patientsRoutes).toHaveLength(1);
  });

  describe('recommend patients route', () => {
    const route = patientsRoutes[0];

    it('should have the correct method', () => {
      expect(route.method).toBe('GET');
    });

    it('should have the correct URL', () => {
      expect(route.url).toBe('/patients/recommend');
    });

    it('should use the correct handler', () => {
      expect(route.handler).toBe(RecommendPatientsController);
    });

    it('should have a schema', () => {
      expect(route.schema).toBeDefined();
    });

    it('should have a description in the schema', () => {
      expect(route.schema).toHaveProperty('description');
      expect(typeof (route.schema as any).description).toBe('string');
    });

    it('should include the recommendPatients schema', () => {
      expect(route.schema).toMatchObject(expect.objectContaining(patientsSchemas.recommendPatients));
    });
  });
});
