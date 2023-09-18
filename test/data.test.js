import { getPatient, addPatient, patientData } from '../src/data';

describe('getPatients and addPatients functions', () => {
    beforeEach(() => {
        patientData.length = 0;
        jest.clearAllMocks();
    });
    it('should return an empty array when no patients are add', ()=> {
        const patients = getPatient();
        expect(patients).toEqual([]);
    });
    it('should return the added patient', ()=> {
        const newPatient = {
                "acceptedOffers": 87,
            "age": 46,
            "averageReplyTime": 2576,
            "canceledOffers": 67,
            "location": {
                  "latitude": "45.6624",
              "longitude": "34.2636",
        },
            "name": "Jean McDermott",
      }
        addPatient(newPatient);
        const patients = getPatient();
        expect(patients).toContainEqual(newPatient);
    })
})