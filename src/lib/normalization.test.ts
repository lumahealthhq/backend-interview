import {
    normalize,
    normalizeAcceptedOffers,
    normalizeAge,
    normalizeCancelledOffers,
    normalizeDistance, normalizeReplyTime
} from "./normalization";

describe('Normalization Tests', () => {
    it('should return a normalized value between 0 and 1', () => {
        expect(normalize(50, 0, 100)).toBe(0.5);
    });

    it('should return a normalized age between 0 and 0.1', () => {
        expect(normalizeAge(50)).toBe(0.05);
    });

    it('should return a normalized age of 0.1 for ages over maximum age', () => {
        expect(normalizeAge(150)).toBe(0.1);
    });

    it('should return a normalized distance between 0 and 0.1', () => {
        expect(normalizeDistance(10000, 20000)).toBe(0.05);
    });

    it('should return a normalized distance of 0 for values over maximum distance', () => {
        expect(normalizeDistance(25000, 20000)).toBe(0);
    });

    it('should return a normalized value for accepted offers between 0 and 0.3', () => {
        expect(normalizeAcceptedOffers(50, 100)).toBe(0.15);
    });

    it('should return a normalized value for cancelled offers between 0 and 0.3', () => {
        expect(normalizeCancelledOffers(50, 100)).toBe(0.15);
    });

    it('should return a normalized value for reply time between 0 and 0.2', () => {
        expect(normalizeReplyTime(1800)).toBe(0.1);
    });
});
