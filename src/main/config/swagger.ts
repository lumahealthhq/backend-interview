import { serve, setup } from "swagger-ui-express";
import { Express } from "express";

import swaggerConfig from "@/main/docs";

export default (app: Express): void => {
  app.use("/api-docs", serve);
  app.get("/api-docs", setup(swaggerConfig));
};
