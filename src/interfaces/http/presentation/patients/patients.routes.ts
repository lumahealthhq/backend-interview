import { RouteOptions } from "fastify";
import patientsSchemas from "./patients.schema";
import { RecommendPatientsController } from "./patients.controller";

const ROUTE_PREFIX = '/patients'

const patientsRoutes: RouteOptions[] = [
  {
    method: 'GET',
    url: `${ROUTE_PREFIX}/recommend`,
    handler: RecommendPatientsController,
    schema: {
      ...patientsSchemas.recommendPatients,
      description: 'Returns the ordered top K patients (defaults to 10) most likely to accept a given hospital appointment.'
    }
  }
]

export default patientsRoutes
