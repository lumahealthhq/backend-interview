const request = require('supertest');
const faker = require('faker');
const app = require('../src/App');

const facilityLocation = {
  facilityLocation: {
    latitude: faker.address.latitude(),
    longitude: faker.address.longitude(),
  },
};

describe('Patient', () => {
  it('should be able to return top 10 patients', async () => {
    const response = await request(app)
      .get('/patients/rank')
      .send({ ...facilityLocation });

    expect(response.body).toHaveLength(10);
  });

  it('should return 400 status code if facilityLocation is missing', async () => {
    const response = await request(app)
      .get('/patients/rank')
      .send();

    expect(response.status).toBe(400);
  });

  it('should return 400 status code if patientsQty is less than 10', async () => {
    const response = await request(app)
      .get('/patients/rank')
      .send({
        ...facilityLocation,
        patientsQty: faker.random.number({ max: 9, min: 0 }),
      });

    expect(response.status).toBe(400);
  });

  it('should return at least one patient with score 10', async () => {
    const response = await request(app)
      .get('/patients/rank')
      .send({ ...facilityLocation });

    const firstPatientScore = response.body[0].score;

    expect(+firstPatientScore.toFixed()).toBe(10);
  });

  it('should return at least one patient with score 1', async () => {
    const response = await request(app)
      .get('/patients/rank')
      .send({ ...facilityLocation });

    const firstPatientScore = response.body[9].score;

    expect(+firstPatientScore.toFixed()).toBe(1);
  });
});
