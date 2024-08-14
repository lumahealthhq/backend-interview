import { Router } from "express";

import { adaptRoute } from "../adapters";
import { makePatientRecommendationListController } from "../factories/controllers";

export default (router: Router) => {
  router.get(
    "/patients-recommended",
    adaptRoute(makePatientRecommendationListController())
  );
};
