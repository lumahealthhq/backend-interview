import { Express, Router } from "express";

import PatientsRoutes from "../routes/patients-routes";

export default (app: Express) => {
  const router = Router();

  app.use("/api", router);

  PatientsRoutes(router);
};
