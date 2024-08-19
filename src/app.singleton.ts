import Server from "./interfaces/http/server";
import { FastifyBaseLogger } from "fastify";
import patientsRecommender from "./app/patients/patients-recommender.singleton";
import PatientsRepository from "./infra/repositories/patients/patients.repository";
import defaultRecommenderConfig from "./domain/patients/patients-recommender-config";

/**
 * The main class of the HTTP API application.
 *
 * It starts the actual HTTP server and also creates (and starts) the patients recommender.
 */
class Application {
  public patientsRecommender: typeof patientsRecommender;
  public server: Server;
  public logger: FastifyBaseLogger;

  constructor() {
    this.patientsRecommender = patientsRecommender

    this.server = new Server()
    this.logger = this.server.getLogger()
  }

  async start() {
    await this.setup()

    await this.server.start()
  }

  private async setup() {
    const patientsRepository = new PatientsRepository()
    const patients = await patientsRepository.getPatientsWaitlist()

    this.patientsRecommender.setup(defaultRecommenderConfig, patients)
  }
}

const app = new Application
export default app
