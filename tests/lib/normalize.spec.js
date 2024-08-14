const { normalize } = require("../../src/lib/normalize");

describe("normalize", () => {
  it("Should return 0.5 when min is equal to max", () => {
    const cases = [
      [0, 0],
      [1, 1],
      [5, 5],
      [100, 100],
      [500, 500],
    ];

    const value = 100;
    cases.forEach(([min, max]) => {
      const result = normalize(value, min, max);

      expect(result).toBe(0.5);
    });
  });

  it("Should always return positive values", () => {
    const value = 5;
    const min = 250;
    const max = 20;

    expect(normalize(value, max, min)).toBe(0.06521739130434782);
  });

  describe("Return values between 0 and 1", () => {
    it("Should return 0 when value is equal min", () => {
      const value = -100;
      const min = -100;
      const max = 100;
      expect(normalize(value, min, max)).toBe(0);
    });

    it("Should return 1 when value is equal max", () => {
      const value = 99;
      const min = 0;
      const max = 99;
      expect(normalize(value, min, max)).toBe(1);
    });

    it("Should return closer to 1 when value is closer to max", () => {
      const value = 666;
      const result = normalize(value, 0, 1000);

      expect(result).toBe(0.666);
    });

    it("Should return closer to 0 when value is closer to min", () => {
      const value = 3;
      const result = normalize(value, 0, 1000);

      expect(result).toBe(0.003);
    });
  });
});
