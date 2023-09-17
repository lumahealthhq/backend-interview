import { getPatients, addPatients } from "../src/data";
import { readFileSync } from 'fs';

jest.mock('fs');

describe('getPatients and addPatients functions', () => {
    beforeEach(()=> {
        patientData = [];
    });
    it('should return an empty array when no patients are add', ()=> {
        const patients = getPatients();
        expect(patient).toEqual([]);
    });
    it('should return the added patient', ()=> {
        const newPatient = {
            name: 'Gilbert',
            age: 30
        }
        addPatients(newPatient);
        const patients = getPatients();
        expect(patients).toEqual(newPatient);
    })
})