/**
 * Normalizes a value between 0 and 1.
 * @param value The value to normalize.
 * @param min The minimum value.
 * @param max The maximum value.
 * @returns The normalized value.
 */
function normalize(value: number, min: number, max: number): number {
    return (value - min) / (max - min);
}

/**
 * Normalizes an age between 0 and 1.
 * @param age The age to normalize.
 * @returns The normalized age.
 */
function normalizeAge(age: number): number {
    return normalize(Math.min(age, 100), 0, 100) * 0.10;
}

/**
 * Normalizes a distance between 0 and 1.
 * @param distance The distance to normalize.
 * @param max The maximum distance.
 * @returns The normalized distance.
 */
function normalizeDistance(distance: number, max = 20000): number {
    return normalize(Math.min(distance, max), 0, max) * 0.10;
}

/**
 * Normalizes the number of accepted offers between 0 and 1.
 * @param offers - How many offers the user has accepted.
 * @returns The normalized offers.
 */
function normalizeAcceptedOffers(offers: number): number {
    return normalize(Math.min(offers, 100), 0, 100) * 0.30;
}

/**
 * Normalizes the number of cancelled offers between 0 and 1.
 * @param offers - How many offers the user has cancelled.
 * @returns The normalized offers.
 */
function normalizeCancelledOffers(offers: number): number {
    return (1 - normalize(Math.min(offers, 100), 0, 100)) * 0.30;
}

/**
 * Normalizes the reply time between 0 and 1.
 * @param replyTime - How much time the user takes to reply.
 * @returns The normalized reply time.
 */
function normalizeReplyTime(replyTime: number): number {
    return (1 - normalize(Math.min(replyTime, 3600), 0, 3600)) * 0.20;
}
