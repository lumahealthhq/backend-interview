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
};

export type Hospital = {
    location: Coordinate;
}

/**
 * Calculates the probability of a patient accepting an offer from a hospital based on demographic and behavioral data.
 * A higher score indicates a higher probability.
 *
 * @param patient - The patient's data
 * @param hospital - The hospital's data
 *
 * @returns The probability of the patient accepting an offer from the hospital between 0 and 1.
 */
export function calculateScore(patient: Patient, hospital: Hospital): number {
    const age = normalizeAge(patient.age);
    const distanceBetweenPoints = haversineDistanceBetweenPoints(patient.location, hospital.location);
    const distance = normalizeDistance(distanceBetweenPoints);
    const totalOffers = patient.acceptedOffers + patient.canceledOffers;
    const acceptedOffers = normalizeAcceptedOffers(patient.acceptedOffers, totalOffers);
    const canceledOffers = normalizeCanceledOffers(patient.canceledOffers, totalOffers);
    const replyTime = normalizeReplyTime(patient.averageReplyTime);
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
