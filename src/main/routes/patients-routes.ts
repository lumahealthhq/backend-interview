import { Router } from "express";

import { adaptRoute } from "@/main/adapters";
import { makePatientRecommendationListController } from "@/main/factories";

export default (router: Router) => {
  router.get(
    "/patients-recommended",
    adaptRoute(makePatientRecommendationListController())
  );
};
