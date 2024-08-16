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
            acceptedOffers: 1,
            canceledOffers: 2,
            averageReplyTime: 0
        });
        const hospital = mockHospital();
        const score = calculateScore(patient, hospital);

        expect(score).toBeCloseTo(0.6);
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

        const top10Patients = getTopPatients(patients, hospital, 10);
        expect(top10Patients).toHaveLength(10);

        for (let i = 0; i < top10Patients.length - 1; i++) {
            const currentScore = top10Patients[i]?.score;
            if (!currentScore) {
                throw new Error('Score is undefined');
            }
            const nextScore = top10Patients[i + 1]?.score;
            if (!nextScore) {
                throw new Error('Next score is undefined');
            }
            expect(currentScore).toBeGreaterThanOrEqual(nextScore);
        }
    });
});
