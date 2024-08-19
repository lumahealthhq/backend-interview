import { FastifySchema } from "fastify";

const patientsSchemas: Record<string, FastifySchema> = {
  recommendPatients: {
    querystring: {
      type: 'object',
      required: ['lat', 'long'],
      properties: {
        lat: {
          type: 'number',
          minimum: -90,
          maximum: 90,
          description: "Hospital's latitude"
        },
        long: {
          type: 'number',
          minimum: -180,
          maximum: 180,
          description: "Hospital's longitude"
        },

        limit: {
          type: 'number',
          default: 10,
          exclusiveMinimum: 0,
          description: 'Number of patients to recommend'
        },

        include_details: {
          type: 'boolean',
          default: false,
          description: 'If `true` then the response will contain all the patient data plus the individual scores of each historical feature (ageScore, replyTimeScore, etc.). Useful for debugging.\nAll scores are weighted by their respective weights.'
        }
      }
    },

    response: {

      422: {
        description: 'Unprocessable Entity — Happens when either: a) `limit` is bigger than the patients waitlist or b) `lat` or `long` are not valid latitude/longitude pairs.',
        type: 'object',
        properties: {
          error_message: {
            type: 'string',
          }
        }
      }
    }
  }
}

export default patientsSchemas
