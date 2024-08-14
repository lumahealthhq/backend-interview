const { normalize } = require("./normalize");

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

  describe("Return values between 0 and 1", () => {
    it("Should return 0 when value is less or equal than min", () => {
      const cases = [
        { value: 10, min: 10, max: 50 },
        { value: 5, min: 10, max: 50 },
      ];

      cases.forEach((x) => {
        expect(normalize(x.value, x.min, x.max)).toBe(0);
      });
    });

    it("Should return 1 when value is greater or equal than max", () => {
      const cases = [
        { value: 0, min: -100, max: 0 },
        { value: 1, min: -100, max: 0 },
      ];

      cases.forEach((x) => {
        expect(normalize(x.value, x.min, x.max)).toBe(1);
      });
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
