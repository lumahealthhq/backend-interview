import * as fs from "node:fs";
import {calculateScore, getTopPatients, Hospital, Patient} from "./index";

const mockPatient = (overrides: Partial<Patient> = {}): Patient => ({
    id: '1',
    name: 'John Doe',
    location: {latitude: 0, longitude: 0},
    age: 100,
    acceptedOffers: 2,
    canceledOffers: 0,
    averageReplyTime: 0,
    ...overrides
});

const mockHospital = (overrides: Partial<Hospital> = {}): Hospital => ({
    location: {latitude: 0, longitude: 0},
    ...overrides
});

describe('Calculation Tests', () => {
    it('should calculate the likelihood of a person accepting with maximum score', () => {
        const patient = mockPatient();
        const hospital = mockHospital();
        const score = calculateScore(patient, hospital);
        expect(score).toBe(1);
    });

    it('should calculate the likelihood of a person accepting an offer', () => {
        const patient = mockPatient({
            age: 100,
            acceptedOffers: 10,
            canceledOffers: 20,
            averageReplyTime: 0
        });
        const hospital = mockHospital();
        const score = calculateScore(patient, hospital);

        expect(score).toBeCloseTo(0.6);
    });

    it('should calculate the likelihood of a person accepting an offer ignoring behavioral data', () => {
        const patient = mockPatient({
            age: 50,
            acceptedOffers: 1,
            canceledOffers: 2,
            averageReplyTime: 0
        });
        const hospital = mockHospital({
            location: {latitude: '0', longitude: '0'}
        });
        const score = calculateScore(patient, hospital);

        expect(score).toBe(0.95);
    });

    it('should get the top 10 patients ordered by who will most likely accept the appointment offer', () => {
        const hospital = mockHospital();
        const patients: Patient[] = [];

        try {
            const data = fs.readFileSync('sample-data/patients.json', 'utf8');
            const parsedData = JSON.parse(data);
            for (const patient of parsedData) {
                patients.push(patient);
            }
        } catch (err) {
            throw new Error('Error reading patients.json file');
        }

        const top10Patients = getTopPatients(patients, hospital, 10, {
            minBehaviorDataThreshold: 0,
            putPatientsWithLittleBehaviorDataOnTop: false
        });
        expect(top10Patients).toHaveLength(10);

        for (let i = 0; i < top10Patients.length - 1; i++) {
            const currentScore = top10Patients[i]?.score;
            const nextScore = top10Patients[i + 1]?.score;
            if (!currentScore || !nextScore) {
                throw new Error('Score or nextScore is undefined');
            }
            expect(currentScore).toBeGreaterThanOrEqual(nextScore);
        }
    });

    it('should get the top 10 patients and put patients with little behavioral data on the top list', () => {
        const hospital = mockHospital();
        const patients: Patient[] = [];

        try {
            const data = fs.readFileSync('sample-data/patients.json', 'utf8');
            const parsedData = JSON.parse(data);
            for (const patient of parsedData) {
                patients.push(patient);
            }
        } catch (err) {
            throw new Error('Error reading patients.json file');
        }

        const minBehaviorDataThreshold = 10;
        const patientIdsWithLittleBehaviorData = patients.filter(patient => patient.acceptedOffers + patient.canceledOffers < minBehaviorDataThreshold).map(patient => patient.id);
        const top10Patients = getTopPatients(patients, hospital, 10);
        expect(top10Patients).toHaveLength(10);

        const top10PatientIds = top10Patients.map(patient => patient.id);
        for (const id of patientIdsWithLittleBehaviorData) {
            expect(top10PatientIds).toContainEqual(id);
        }
    });
});
