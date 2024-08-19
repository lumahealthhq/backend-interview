import Fastify, { FastifyInstance } from "fastify"
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import healthcheck from 'fastify-healthcheck'
import loggerOptions from "./config/logger-options"
import NodeEnv from "../../@types/nodeEnv"
import env from "../../config/environment"
import apiRoutes from "./routes"

class Server {
  private port: number = 3000
  public fastify: FastifyInstance
  private nodeEnv: NodeEnv;

  constructor() {
    if (env.SERVER_PORT) this.port = env.SERVER_PORT

    this.nodeEnv = env.NODE_ENV

    const logOptions = this.getLoggerOptions()
    this.fastify = Fastify({
      logger: logOptions,
    })
  }

  async start() {
    await this.setupFastify()
    this.createRoutes()

    this.fastify.listen({ port: this.port, host: '0.0.0.0' }, (err) => {
      if (err) {
        this.fastify.log.error(err)
        process.exit(1)
      }
    })
  }

  getLogger() {
    return this.fastify.log
  }

  private getLoggerOptions() {
    return loggerOptions[this.nodeEnv]
  }

  private async setupFastify() {
    await this.fastify.register(swagger)
    await this.fastify.register(swaggerUI, {
      routePrefix: '/docs',
      logLevel: 'debug'
    })
    await this.fastify.register(healthcheck)
  }

  private createRoutes() {
    apiRoutes.forEach((route: any) => this.fastify.route(route))
  }
}

export default Server
