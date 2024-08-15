import {
  PatientDataNormalizerService,
  PatientScoreCalculatorService,
  PatientsGetWithScoresService,
  PatientsTopListGeneratorService,
  PatientDataMinMaxCalculatorService,
  DistanceBetweenCoordinatesCalculatorService,
} from "@/data/services";

import { PatientRecommendationListController } from "@/presentation/controllers";

export function makePatientRecommendationListController() {
  const minMaxCalculator = new PatientDataMinMaxCalculatorService();
  const dataNormalizer = new PatientDataNormalizerService();
  const distanceBetweenCoords =
    new DistanceBetweenCoordinatesCalculatorService();

  const patientCalculateScore = new PatientScoreCalculatorService(
    dataNormalizer
  );

  const patientsGetWithScores = new PatientsGetWithScoresService(
    patientCalculateScore,
    minMaxCalculator,
    distanceBetweenCoords
  );

  const patientsTopListGenerator = new PatientsTopListGeneratorService(
    patientsGetWithScores
  );

  return new PatientRecommendationListController(patientsTopListGenerator);
}
