import { Express, Router } from "express";

import PatientsRoutes from "@/main/routes/patients-routes";

export default (app: Express) => {
  const router = Router();

  app.use("/api", router);

  PatientsRoutes(router);
};
