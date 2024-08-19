import patientsSchemas from './patients.schema';

describe('patientsSchemas', () => {
  describe('recommendPatients', () => {
    const schema = patientsSchemas.recommendPatients;

    it('should have the correct structure', () => {
      expect(schema).toHaveProperty('querystring');
      expect(schema).toHaveProperty('response');
    });

    describe('querystring', () => {
      const querystring = schema.querystring as any;

      it('should be an object type', () => {
        expect(querystring.type).toBe('object');
      });

      it('should have required properties', () => {
        expect(querystring.required).toEqual(['lat', 'long']);
      });

      it('should have correct properties', () => {
        expect(querystring.properties).toHaveProperty('lat');
        expect(querystring.properties).toHaveProperty('long');
        expect(querystring.properties).toHaveProperty('limit');
        expect(querystring.properties).toHaveProperty('include_details');
      });

      it('should have correct lat property', () => {
        const lat = querystring.properties.lat;
        expect(lat.type).toBe('number');
        expect(lat.minimum).toBe(-90);
        expect(lat.maximum).toBe(90);
      });

      it('should have correct long property', () => {
        const long = querystring.properties.long;
        expect(long.type).toBe('number');
        expect(long.minimum).toBe(-180);
        expect(long.maximum).toBe(180);
      });

      it('should have correct limit property', () => {
        const limit = querystring.properties.limit;
        expect(limit.type).toBe('number');
        expect(limit.default).toBe(10);
        expect(limit.exclusiveMinimum).toBe(0);
      });

      it('should have correct include_details property', () => {
        const includeDetails = querystring.properties.include_details;
        expect(includeDetails.type).toBe('boolean');
        expect(includeDetails.default).toBe(false);
      });
    });

    describe('response', () => {
      const response = schema.response as any;

      it('should have 422 status code', () => {
        expect(response).toHaveProperty('422');
      });

      it('should have correct 422 response structure', () => {
        const unprocessableEntity = response['422'];
        expect(unprocessableEntity.type).toBe('object');
        expect(unprocessableEntity).toHaveProperty('properties');
        expect(unprocessableEntity.properties).toHaveProperty('error_message');
        expect(unprocessableEntity.properties.error_message.type).toBe('string');
      });
    });
  });
});
