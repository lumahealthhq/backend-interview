import { IPatientScoreService } from "./patient-score.interface";
import { PatientDatasetValues, Patient } from "../models/patient";
import { distanceBetweenTwoPoints } from "../utils/distance-calculator";
import { normalize } from "../utils/normalize";
import * as fs from "fs";

export class PatientScoreService implements IPatientScoreService {
    private readonly patients: Array<Patient> = [];
    private readonly WEIGHTS = {
        age: 0.1, // 10% of the score
        distance: 0.1, // 10% of the score
        acceptedOffers: 0.3, // 30% of the score
        canceledOffers: 0.3, // 30% of the score
        replyTime: 0.2 // 20% of the score
    }
    public minMaxValues: PatientDatasetValues = {
        age: {
            min: 0,
            max: 0
        },
        distance: {
            min: 0,
            max: 0
        },
        acceptedOffers: {
            min: 0,
            max: 0
        },
        canceledOffers: {
            min: 0,
            max: 0
        },
        replyTime: {
            min: 0,
            max: 0
        }
    };

    constructor(patientDataPath: string) {
        const patientData = fs.readFileSync(patientDataPath, 'utf8');
        this.patients = JSON.parse(patientData);
        this.calculateMinMaxValues();
    }

    private calculateMinMaxValues(): void {
        this.patients.forEach(patient => {
            this.minMaxValues.age.min = Math.min(this.minMaxValues.age.min, patient.age);
            this.minMaxValues.acceptedOffers.min = Math.min(this.minMaxValues.acceptedOffers.min, patient.acceptedOffers);
            this.minMaxValues.canceledOffers.min = Math.min(this.minMaxValues.canceledOffers.min, patient.canceledOffers);
            this.minMaxValues.replyTime.min = Math.min(this.minMaxValues.replyTime.min, patient.averageReplyTime);

            this.minMaxValues.age.max = Math.max(this.minMaxValues.age.max, patient.age);
            this.minMaxValues.acceptedOffers.max = Math.max(this.minMaxValues.acceptedOffers.max, patient.acceptedOffers);
            this.minMaxValues.canceledOffers.max = Math.max(this.minMaxValues.canceledOffers.max, patient.canceledOffers);
            this.minMaxValues.replyTime.max = Math.max(this.minMaxValues.replyTime.max, patient.averageReplyTime);
        });
    }

    public getTopPatients(facilityLocation: { lat: number, long: number }): Array<Patient> {
        const patients = this.patients.map(patient => {
            patient.distance = this.calculateDistance(patient, facilityLocation);
            patient.score = this.calculatePatientScore(patient);

            return patient;
        });

        patients.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
        return patients.slice(0, 10);
    }

    public calculateDistance(patient: Patient, facilityLocation: { lat: number, long: number }): number {
        const distance = distanceBetweenTwoPoints(patient.location.latitude, patient.location.longitude,
            facilityLocation.lat, facilityLocation.long);

        this.minMaxValues.distance.min = Math.min(this.minMaxValues.distance.min, distance);
        this.minMaxValues.distance.max = Math.max(this.minMaxValues.distance.max, distance);

        return distance;
    }

    public calculatePatientScore(patient: Patient): number {
        const normalizedAge = normalize(patient.age, this.minMaxValues.age.min, this.minMaxValues.age.max);

        // Limit distance to 1000 kilometers, not scoring when patient is more than 1000 km away.
        // This would still be a high value in real life, but we're just going to limit to 1000 for this demo.
        const normalizedDistance = patient.distance > 1000 ? 0 : normalize(patient.distance, this.minMaxValues.distance.min, this.minMaxValues.distance.max);

        const normalizedAcceptedOffers = normalize(patient.acceptedOffers, this.minMaxValues.acceptedOffers.min, this.minMaxValues.acceptedOffers.max);
        const normalizedCanceledOffers = normalize(patient.canceledOffers, this.minMaxValues.canceledOffers.min, this.minMaxValues.canceledOffers.max);
        const normalizedReplyTime = normalize(patient.averageReplyTime, this.minMaxValues.replyTime.min, this.minMaxValues.replyTime.max);

        // Consider analyze data and check if patients who are younger, are more likely to accept.
        // Consider penalize patients who has many canceled offers.
        // Consider boost patients who are closer to the facility.
        // Consider boost patients who responds quickly.
        let score = (
            normalizedAge * this.WEIGHTS.age +
            normalizedDistance * this.WEIGHTS.distance +
            normalizedAcceptedOffers * this.WEIGHTS.acceptedOffers +
            normalizedCanceledOffers * this.WEIGHTS.canceledOffers +
            normalizedReplyTime * this.WEIGHTS.replyTime
        );

        score = score * 10;

        // litte behaviour, I'm considering little behavior as patients 
        // who have less than 10 accepted offers and less than 10 canceled offers.
        if (patient.acceptedOffers < 10 && patient.canceledOffers < 10) {
            score = this.applyBoostForLittleBehavior(score);
        }

        return score;
    }

    // apply a random boost to patients with little behavior
    public applyBoostForLittleBehavior(score: number): number {
        score += Math.random() * (10 - score);
        return score;
    }
}