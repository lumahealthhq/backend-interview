import { Patient } from "../models/patient";

export interface IPatientScoreService {
    getTopPatients(facilityLocation: { lat: number, long: number }): Array<Patient>
}