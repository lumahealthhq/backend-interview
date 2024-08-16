import {Coordinate, haversineDistanceBetweenPoints} from "./utils/coordinates";
import {
    normalizeAcceptedOffers,
    normalizeAge,
    normalizeCanceledOffers,
    normalizeDistance,
    normalizeReplyTime
} from "./lib/normalization";

export type Patient = {
    id: string;
    name: string;
    location: Coordinate;
    age: number;
    acceptedOffers: number;
    canceledOffers: number;
    averageReplyTime: number;
    score?: number;
};

export type Hospital = {
    location: Coordinate;
}

export type ScoreOptions = {
    minBehaviorDataThreshold: number;
}

/**
 * Calculates the probability of a patient accepting an offer from a hospital based on demographic and behavioral data.
 * A higher score indicates a higher probability.
 *
 * @param patient - The patient's data
 * @param hospital - The hospital's data
 * @param options - The options for calculating the score
 *
 * @returns The probability of the patient accepting an offer from the hospital between 0 and 1.
 */
export function calculateScore(patient: Patient, hospital: Hospital, {minBehaviorDataThreshold}: ScoreOptions = {minBehaviorDataThreshold: 10}): number {
    const age = normalizeAge(patient.age);
    const distanceBetweenPoints = haversineDistanceBetweenPoints(patient.location, hospital.location);
    const distance = normalizeDistance(distanceBetweenPoints);
    const totalOffers = patient.acceptedOffers + patient.canceledOffers;
    const acceptedOffers = totalOffers >= minBehaviorDataThreshold ? normalizeAcceptedOffers(patient.acceptedOffers, totalOffers) : 0.3;
    const canceledOffers = totalOffers >= minBehaviorDataThreshold ? normalizeCanceledOffers(patient.canceledOffers, totalOffers) : 0.3;
    const replyTime = totalOffers >= minBehaviorDataThreshold ? normalizeReplyTime(patient.averageReplyTime) : 0.2;
    return age + distance + acceptedOffers + canceledOffers + replyTime;
}

/**
 * Gets the top patients that are most likely to accept an offer from the hospital.
 *
 * @param patients - The list of patients
 * @param hospital - The hospital
 * @param top - The number of top patients to return
 *
 * @returns The top patients ordered by score
 */
export function getTopPatients(patients: Patient[], hospital: Hospital, top: number): Patient[] {
    return patients
        .map(patient => ({
            ...patient,
            score: calculateScore(patient, hospital)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, top);
}
