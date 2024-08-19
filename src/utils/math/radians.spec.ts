import toRadians from './radians';

describe('toRadians function', () => {
  it('should correctly convert 0 degrees to radians', () => {
    expect(toRadians(0)).toBe(0);
  });

  it('should correctly convert 90 degrees to radians', () => {
    expect(toRadians(90)).toBeCloseTo(Math.PI / 2, 10);
  });

  it('should correctly convert 180 degrees to radians', () => {
    expect(toRadians(180)).toBeCloseTo(Math.PI, 10);
  });

  it('should correctly convert 270 degrees to radians', () => {
    expect(toRadians(270)).toBeCloseTo(3 * Math.PI / 2, 10);
  });

  it('should correctly convert 360 degrees to radians', () => {
    expect(toRadians(360)).toBeCloseTo(2 * Math.PI, 10);
  });

  it('should handle negative angles', () => {
    expect(toRadians(-90)).toBeCloseTo(-Math.PI / 2, 10);
  });

  it('should handle angles greater than 360 degrees', () => {
    expect(toRadians(720)).toBeCloseTo(4 * Math.PI, 10);
  });

  it('should handle fractional degrees', () => {
    expect(toRadians(45)).toBeCloseTo(Math.PI / 4, 10);
  });

  it('should return 0 for very small angles close to 0', () => {
    expect(toRadians(1e-10)).toBeCloseTo(0, 10);
  });
});
