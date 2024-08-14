export const patientSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    name: {
      type: "string",
    },
    age: {
      type: "number",
    },
    location: {
      type: "object",
      properties: {
        latitude: {
          type: "string",
        },
        longitude: {
          type: "string",
        },
      },
    },
    acceptedOffers: {
      type: "number",
    },
    canceledOffers: {
      type: "number",
    },
    averageReplyTime: {
      type: "number",
    },
    score: {
      type: "number",
    },
    littleBehaviorScore: {
      type: "number",
    },
    distance: {
      type: "number",
    },
  },
  required: ["id", "name", "location", "age"],
};
