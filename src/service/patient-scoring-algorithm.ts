import {LocationModel} from '../model/location.model';
import {PatientModel} from '../model/patient.model';

export class PatientScoringAlgorithm {
  public readonly dataset: PatientModel[];
  constructor(dataset: PatientModel[]) {
    //  Validate the dataset before using it
    this.dataset = dataset.map(row => new PatientModel(row));
  }

  public calculateScore(facilityLocation: LocationModel) {
    //  Validate location before use it
    const location = new LocationModel(facilityLocation);

    console.log(location);
  }
}
