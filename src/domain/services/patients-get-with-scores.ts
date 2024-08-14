export interface IPatientsGetWithScoresService {
  get(
    patients: Patient[],
    facilityCoordinates: FacilityLocation
  ): Required<Patient>[];
}
