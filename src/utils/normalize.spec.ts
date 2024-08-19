import { normalize } from "./normalize";

describe('normalize', () => {
    it('should be 0 when min and max are the same', () => {
        const normalized = normalize(10, 10, 10);
        expect(normalized).toBe(0);
    });

    it('should be close to 0 when value is close to min', () => {
        const normalized = normalize(1, 0, 10);
        expect(normalized).toBeCloseTo(0.1, 2);
    });

    it('should be close to 1 when value is close to max', () => {
        const normalized = normalize(9, 0, 10);
        expect(normalized).toBeCloseTo(0.9, 2);
    });
});