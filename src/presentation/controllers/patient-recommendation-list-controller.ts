import patientsSample from "../../assets/patients.json";

import { IPatientsTopListGeneratorService } from "../../domain/services";

import { Controller } from "../protocols";
import { MissingParamError } from "../errors";
import { badRequest, noContent, ok, serverError } from "../helpers";

export class PatientRecommendationListController implements Controller {
  constructor(
    private readonly patientsTopListGenerator: IPatientsTopListGeneratorService
  ) {}

  async handle(request: PatientRecommendationListController.Request) {
    const { lat, lng } = request;

    if (!lat) return badRequest(new MissingParamError("lat"));
    if (!lng) return badRequest(new MissingParamError("lng"));

    try {
      const facilityCoordinates = {
        latitude: lat,
        longitude: lng,
      };

      const patientsRecommended = this.patientsTopListGenerator.generate(
        patientsSample,
        facilityCoordinates
      );

      if (patientsRecommended.length === 0) return noContent();

      return ok(patientsRecommended);
    } catch (err) {
      return serverError(err as unknown as Error);
    }
  }
}

export namespace PatientRecommendationListController {
  export type Request = {
    lat?: string;
    lng?: string;
  };
}
