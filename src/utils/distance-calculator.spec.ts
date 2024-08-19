import { distanceBetweenTwoPoints } from "./distance-calculator";

describe('distance calculator', () => {
    it('should calculate distance between lumas office and golden state bridge', () => {
        const distance = distanceBetweenTwoPoints(37.79044690045309, -122.40248653374681, 37.82009732520937, -122.47850615876979);
        expect(distance).toBeCloseTo(7.448, 2);
    });

    it('should be 0 when points are the same', () => {
        const distance = distanceBetweenTwoPoints(37.79044690045309, -122.40248653374681, 37.79044690045309, -122.40248653374681);
        expect(distance).toBe(0);
    });
});