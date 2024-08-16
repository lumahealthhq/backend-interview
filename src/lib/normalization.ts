/**
 * Normalizes a value between 0 and 1.
 * @param value The value to normalize.
 * @param min The minimum value.
 * @param max The maximum value.
 * @returns The normalized value.
 */
export function normalize(value: number, min: number, max: number): number {
    if (max === min) {
        return 1;
    }
    return (value - min) / (max - min);
}

/**
 * Normalizes an age between 0 and 0.1.
 * The older the person, the higher the normalized value.
 * @param age The age to normalize.
 * @returns The normalized age.
 */
export function normalizeAge(age: number): number {
    return normalize(Math.min(age, 100), 0, 100) * 0.10;
}

/**
 * Normalizes a distance between 0 and 0.1.
 * @param distance The distance to normalize.
 * @param max The maximum distance.
 * @returns The normalized distance.
 */
export function normalizeDistance(distance: number, max = 20000): number {
    return (1 - normalize(Math.min(distance, max), 0, max)) * 0.10;
}

/**
 * Normalizes the number of accepted offers between 0 and 0.3.
 * @param offers - How many offers the user has accepted.
 * @param total - The total number of offers the user has received.
 * @returns The normalized offers.
 */
export function normalizeAcceptedOffers(offers: number, total: number): number {
    return normalize(offers, 0, total) * 0.30;
}

/**
 * Normalizes the number of cancelled offers between 0 and 0.3.
 * @param offers - How many offers the user has cancelled.
 * @param total - The total number of offers the user has received.
 * @returns The normalized offers.
 */
export function normalizeCancelledOffers(offers: number, total: number): number {
    return (1 - normalize(offers, 0, total)) * 0.30;
}

/**
 * Normalizes the reply time between 0 and 0.2.
 * @param replyTime - How much time the user takes to reply.
 * @returns The normalized reply time.
 */
export function normalizeReplyTime(replyTime: number): number {
    return (1 - normalize(Math.min(replyTime, 3600), 0, 3600)) * 0.20;
}
