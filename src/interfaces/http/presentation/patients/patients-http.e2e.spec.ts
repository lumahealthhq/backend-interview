import { FastifyInstance } from 'fastify';
import appSingleton from '../../../../app.singleton';

const url = '/api/v1/patients/recommend'

describe('Patient Recommendation API', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    await appSingleton.start()
    app = appSingleton.server.fastify
  });

  afterAll(async () => {
    await app.close();
  });

  it('should recommend patients with valid parameters', async () => {
    const response = await app.inject({
      url,
      method: 'GET',
      query: { lat: '40.7128', long: '-74.0060' }
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeLessThanOrEqual(10);
  });

  it('should return detailed patient information when include_details is true', async () => {
    const response = await app.inject({
      url,
      method: 'GET',
      query: { lat: '40.7128', long: '-74.0060', include_details: 'true' }
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(Array.isArray(body)).toBe(true);
    expect(body[0]).toHaveProperty('ageScore');
    expect(body[0]).toHaveProperty('offersScore');
    expect(body[0]).toHaveProperty('replyTimeScore');
    expect(body[0]).toHaveProperty('locationScore');
    expect(body[0]).toHaveProperty('score');
  });

  it('should respect the limit parameter', async () => {
    const limit = 5;
    const response = await app.inject({
      url,
      method: 'GET',
      query: { lat: '40.7128', long: '-74.0060', limit: limit.toString() }
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body.length).toBe(limit);
  });

  it('should return 400 for invalid latitude', async () => {
    const response = await app.inject({
      url,
      method: 'GET',
      query: { lat: '91', long: '-74.0060' }
    });

    expect(response.statusCode).toBe(400);
  });

  it('should return 400 for invalid longitude', async () => {
    const response = await app.inject({
      url,
      method: 'GET',
      query: { lat: '40.7128', long: '181' }
    });

    expect(response.statusCode).toBe(400);
  });

  it('should return 422 when limit is greater than available patients', async () => {
    const response = await app.inject({
      url,
      method: 'GET',
      query: { lat: '40.7128', long: '-74.0060', limit: '1000000' }
    });

    expect(response.statusCode).toBe(422);
    const body = JSON.parse(response.payload);
    expect(body).toHaveProperty('error_message');
  });
});
