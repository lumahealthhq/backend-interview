import request from 'supertest';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/app.module';

describe(`Patients e2e`, () => {
  let app: INestApplication;
  const DEFAULT_QUERY = {
    page: 1,
    perPage: 10,
    lat: 49,
    long: 49,
    percentLittleBehavior: 20,
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        always: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        transform: true,
      }),
    );
    await app.init();
  });

  describe('fail', () => {
    describe(`page`, () => {
      it(`GIVEN a call to '/patients/waitlist''
        WHEN page is not a number
        THEN response should be 422 with error message`, () => {
        return request(app.getHttpServer())
          .get('/patients/waitlist')
          .query({
            ...DEFAULT_QUERY,
            page: 'anyValue',
          })
          .expect(422)
          .expect({
            message: [
              'Page value should be equal or greater than 1',
              'Page value should be a number',
            ],
            error: 'Unprocessable Entity',
            statusCode: 422,
          });
      });

      it(`GIVEN a call to '/patients/waitlist''
        WHEN page is not a less than 1
        THEN response should be 422 with error message`, () => {
        return request(app.getHttpServer())
          .get('/patients/waitlist')
          .query({
            ...DEFAULT_QUERY,
            page: '0.9',
          })
          .expect(422)
          .expect({
            message: ['Page value should be equal or greater than 1'],
            error: 'Unprocessable Entity',
            statusCode: 422,
          });
      });
    });

    describe(`perPage`, () => {
      it(`GIVEN a call to '/patients/waitlist''
        WHEN perPage is not a number
        THEN response should be 422 with error message`, () => {
        return request(app.getHttpServer())
          .get('/patients/waitlist')
          .query({
            ...DEFAULT_QUERY,
            perPage: 'anyValue',
          })
          .expect(422)
          .expect({
            message: [
              'PerPage value should be equal or greater than 1',
              'PerPage value should be a number',
            ],
            error: 'Unprocessable Entity',
            statusCode: 422,
          });
      });

      it(`GIVEN a call to '/patients/waitlist''
        WHEN perPage is not less than 1
        THEN response should be 422 with error message`, () => {
        return request(app.getHttpServer())
          .get('/patients/waitlist')
          .query({
            ...DEFAULT_QUERY,
            perPage: '0.9',
          })
          .expect(422)
          .expect({
            message: ['PerPage value should be equal or greater than 1'],
            error: 'Unprocessable Entity',
            statusCode: 422,
          });
      });
    });

    describe(`lat`, () => {
      it(`GIVEN a call to '/patients/waitlist''
        WHEN lat is not a number
        THEN response should be 422 with error message`, () => {
        return request(app.getHttpServer())
          .get('/patients/waitlist')
          .query({
            ...DEFAULT_QUERY,
            lat: 'anyValue',
          })
          .expect(422)
          .expect({
            message: [
              'Lat value should be equal or less than 90',
              'Lat value should be equal or greater than -90',
              'Lat value should be a number',
            ],
            error: 'Unprocessable Entity',
            statusCode: 422,
          });
      });

      it(`GIVEN a call to '/patients/waitlist''
        WHEN lat is less than -90
        THEN response should be 422 with error message`, () => {
        return request(app.getHttpServer())
          .get('/patients/waitlist')
          .query({
            ...DEFAULT_QUERY,
            lat: '-91',
          })
          .expect(422)
          .expect({
            message: ['Lat value should be equal or greater than -90'],
            error: 'Unprocessable Entity',
            statusCode: 422,
          });
      });

      it(`GIVEN a call to '/patients/waitlist''
        WHEN lat is greater than 90
        THEN response should be 422 with error message`, () => {
        return request(app.getHttpServer())
          .get('/patients/waitlist')
          .query({
            ...DEFAULT_QUERY,
            lat: '91',
          })
          .expect(422)
          .expect({
            message: ['Lat value should be equal or less than 90'],
            error: 'Unprocessable Entity',
            statusCode: 422,
          });
      });
    });

    describe(`long`, () => {
      it(`GIVEN a call to '/patients/waitlist''
        WHEN long is not a number
        THEN response should be 422 with error message`, () => {
        return request(app.getHttpServer())
          .get('/patients/waitlist')
          .query({
            ...DEFAULT_QUERY,
            long: 'anyValue',
          })
          .expect(422)
          .expect({
            message: [
              'Long value should be equal or less than 180',
              'Long value should be equal or greater than -180',
              'Long value should be a number',
            ],
            error: 'Unprocessable Entity',
            statusCode: 422,
          });
      });

      it(`GIVEN a call to '/patients/waitlist''
        WHEN long is less than -180
        THEN response should be 422 with error message`, () => {
        return request(app.getHttpServer())
          .get('/patients/waitlist')
          .query({
            ...DEFAULT_QUERY,
            long: '-181',
          })
          .expect(422)
          .expect({
            message: ['Long value should be equal or greater than -180'],
            error: 'Unprocessable Entity',
            statusCode: 422,
          });
      });

      it(`GIVEN a call to '/patients/waitlist''
        WHEN long is greater than 180
        THEN response should be 422 with error message`, () => {
        return request(app.getHttpServer())
          .get('/patients/waitlist')
          .query({
            ...DEFAULT_QUERY,
            long: '181',
          })
          .expect(422)
          .expect({
            message: ['Long value should be equal or less than 180'],
            error: 'Unprocessable Entity',
            statusCode: 422,
          });
      });
    });

    describe(`percentLittleBehavior`, () => {
      it(`GIVEN a call to '/patients/waitlist''
        WHEN percentLittleBehavior is not a number
        THEN response should be 422 with error message`, () => {
        return request(app.getHttpServer())
          .get('/patients/waitlist')
          .query({
            ...DEFAULT_QUERY,
            percentLittleBehavior: 'anyValue',
          })
          .expect(422)
          .expect({
            message: [
              'PercentLittleBehavior value should be equal or less than 100',
              'PercentLittleBehavior value should be equal or greater than 20',
              'PercentLittleBehavior value should be a number',
            ],
            error: 'Unprocessable Entity',
            statusCode: 422,
          });
      });

      it(`GIVEN a call to '/patients/waitlist''
        WHEN percentLittleBehavior is less than 20
        THEN response should be 422 with error message`, () => {
        return request(app.getHttpServer())
          .get('/patients/waitlist')
          .query({
            ...DEFAULT_QUERY,
            percentLittleBehavior: '19',
          })
          .expect(422)
          .expect({
            message: [
              'PercentLittleBehavior value should be equal or greater than 20',
            ],
            error: 'Unprocessable Entity',
            statusCode: 422,
          });
      });

      it(`GIVEN a call to '/patients/waitlist''
        WHEN percentLittleBehavior is greater than 100
        THEN response should be 422 with error message`, () => {
        return request(app.getHttpServer())
          .get('/patients/waitlist')
          .query({
            ...DEFAULT_QUERY,
            percentLittleBehavior: '101',
          })
          .expect(422)
          .expect({
            message: [
              'PercentLittleBehavior value should be equal or less than 100',
            ],
            error: 'Unprocessable Entity',
            statusCode: 422,
          });
      });
    });
  });

  describe(`success`, () => {
    it(`GIVEN a call to '/patients/waitlist''
        WHEN all querySearch is right
        THEN response should be 200`, () => {
      return request(app.getHttpServer())
        .get('/patients/waitlist')
        .query(DEFAULT_QUERY)
        .expect(200);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
