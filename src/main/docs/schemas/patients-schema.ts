export const patientsSchema = {
  type: "array",
  items: {
    $ref: "#/schemas/patient",
  },
};
