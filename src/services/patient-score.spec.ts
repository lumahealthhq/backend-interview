import { Patient } from "../models/patient";
import { PatientScoreService } from "./patient-score.service";

describe('patient score service', () => {
    const patientScoreService = new PatientScoreService('sample-data/patients.json');

    describe('min max values', () => {
        it('should have min and max values', () => {
            expect(patientScoreService.minMaxValues.age.min).toBe(0);
            expect(patientScoreService.minMaxValues.age.max).toBe(90);
            expect(patientScoreService.minMaxValues.distance.min).toBe(0);
            expect(patientScoreService.minMaxValues.distance.max).toBe(0);
            expect(patientScoreService.minMaxValues.acceptedOffers.min).toBe(0);
            expect(patientScoreService.minMaxValues.acceptedOffers.max).toBe(100);
            expect(patientScoreService.minMaxValues.canceledOffers.min).toBe(0);
            expect(patientScoreService.minMaxValues.canceledOffers.max).toBe(100);
            expect(patientScoreService.minMaxValues.replyTime.min).toBe(0);
            expect(patientScoreService.minMaxValues.replyTime.max).toBe(3596);
        });
    });

    describe('getTopPatients', () => {
        it('should return 10 patients', () => {
            const patients = patientScoreService.getTopPatients({
                lat: 37.79044690045309,
                long: -122.40248653374681
            });
            expect(patients.length).toBe(10);
        });

        it('should have score and distance properties', () => {
            const patients = patientScoreService.getTopPatients({
                lat: 37.79044690045309,
                long: -122.40248653374681
            });
            expect(patients[0].score).toBeDefined();
            expect(patients[0].distance).toBeDefined();
        });

        it('should be sorterd by score', () => {
            const patients = patientScoreService.getTopPatients({
                lat: 37.79044690045309,
                long: -122.40248653374681
            });
            expect(patients[0].score).toBeGreaterThan(patients[1].score ?? 0);
        });
    });

    describe('calculateDistance', () => {
        it('should calculate distance between two points', () => {
            const patient: Patient = {
                id: '541d25c9-9500-4265-8967-240f44ecf723',
                name: "Samir Pacocha",
                age: 47,
                location: {
                    latitude: 46.7110,
                    longitude: -63.1150
                },
                acceptedOffers: 49,
                canceledOffers: 92,
                averageReplyTime: 2598,
                distance: 2000,
            }

            const distance = patientScoreService.calculateDistance(patient, {
                lat: 37.79044690045309,
                long: -122.40248653374681
            });

            expect(distance).toBeCloseTo(4860.87, 2);
        });
    });

    describe('calculatePatientScore', () => {
        it('should score patient with no little behavior data', () => {
            const score = patientScoreService.calculatePatientScore({
                id: '541d25c9-9500-4265-8967-240f44ecf723',
                name: "Samir Pacocha",
                age: 47,
                location: {
                    latitude: 46.7110,
                    longitude: -63.1150
                },
                acceptedOffers: 49,
                canceledOffers: 92,
                averageReplyTime: 2598,
                distance: 2000,
            });

            expect(score).toBeCloseTo(6.197);
        });

        it('should score patient with little behavior data', () => {
            const score = patientScoreService.calculatePatientScore({
                id: '541d25c9-9500-4265-8967-240f44ecf723',
                name: "Samir Pacocha",
                age: 47,
                location: {
                    latitude: 46.7110,
                    longitude: -63.1150
                },
                acceptedOffers: 9,
                canceledOffers: 8,
                averageReplyTime: 2598,
                distance: 2000,
            });

            // this score is without boost for little behavior
            expect(score).toBeGreaterThan(2.477);
        });
    });

    describe('applyBoostForLittleBehavior', () => {
        it('expect to apply boost and be less than 10', () => {
            const score = patientScoreService.applyBoostForLittleBehavior(9.98);
            expect(score).toBeLessThan(10);
            expect(score).toBeGreaterThan(9.98);
        });
    });

});