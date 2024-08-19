import { z } from "zod";
import NodeEnvEnum from "../domain/config/node-environment.enum";

const envSchema = z.object({
  SERVER_PORT: z.coerce.number().positive().default(3000),
  NODE_ENV: z.enum(NodeEnvEnum).default('production'),
})

const env = envSchema.parse(process.env)

export default env

type Env = typeof env

export { Env }
