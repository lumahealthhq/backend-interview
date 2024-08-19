import { validateCoordinate } from '.';

describe('Coordinates validator', () => {
  it.each([
    [0, 0],
    [-90, -180],
    [90, 180],
  ])(
    'should return true when coordinate is valid (%p %p)',
    (latitude, longitude) => {
      expect(validateCoordinate(latitude, longitude)).toBe(true);
    }
  );

  it.each([
    [undefined, undefined],
    [true, false],
    ['', ''],
    [{}, {}],
  ])(
    'should return false when coordinate is not valid (%p %p)',
    (latitude: unknown, longitude: unknown) => {
      expect(validateCoordinate(latitude as number, longitude as number)).toBe(
        false
      );
    }
  );
});
