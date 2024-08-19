import apiRoutes from './routes';
import patientsRoutes from './presentation/patients/patients.routes';

jest.mock('./presentation/patients/patients.routes', () => [
  { url: '/patients', method: 'GET' },
  { url: '/patients/:id', method: 'POST' }
]);

describe('routes', () => {
  it('should include all patient routes with /api prefix', () => {
    const expectedRoutes = patientsRoutes.map(route => ({
      ...route,
      url: `/api/v1${route.url}`
    }));

    expect(apiRoutes).toEqual(expect.arrayContaining(
      expectedRoutes.map(route => expect.objectContaining(route))
    ));
  });

  it('should prefix all routes with /api', () => {
    apiRoutes.forEach(route => {
      expect(route.url).toMatch(/^\/api/);
    });
  });

  it('should maintain original properties of each route except for the url', () => {
    apiRoutes.forEach((route, index) => {
      const originalRoute = patientsRoutes[index];
      expect(route).toMatchObject({
        ...originalRoute,
        url: expect.any(String)
      });
    });
  });

  it('should correctly prefix the original URL', () => {
    apiRoutes.forEach((route, index) => {
      const originalRoute = patientsRoutes[index];
      expect(route.url).toBe(`/api/v1${originalRoute.url}`);
    });
  });
});
