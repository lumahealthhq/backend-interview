export const patientsPath = {
  get: {
    summary:
      "Get 10 patients most likely to attend an appointment in a facility",
    parameters: [
      {
        in: "query",
        name: "lat",
        required: true,
        schema: {
          type: "number",
        },
      },
      {
        in: "query",
        name: "lng",
        required: true,
        schema: {
          type: "number",
        },
      },
      {
        in: "query",
        name: "debug",
        required: false,
        schema: {
          type: "boolean",
        },
      },
    ],
    responses: {
      200: {
        description: "Success",
        content: {
          "application/json": {
            schema: {
              $ref: "#/schemas/patients",
            },
          },
        },
      },
      204: {
        $ref: "#/components/noContent",
      },
      400: {
        $ref: "#/components/badRequest",
      },
      500: {
        $ref: "#/components/serverError",
      },
    },
  },
};
