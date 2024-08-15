import type { Express } from "express";

import { cors, bodyParser, contentType } from "@/main/middlewares";

export default (app: Express) => {
  app.use(cors);
  app.use(bodyParser);
  app.use(contentType);
};
