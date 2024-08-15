import express from "express";

import setupMiddlewares from "./middlewares";
import setupSwagger from "./swagger";
import setupRoutes from "./routes";

const app = express();

setupSwagger(app);
setupMiddlewares(app);
setupRoutes(app);

export { app };
