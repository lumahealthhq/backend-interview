const request = require("supertest");

const { app } = require("../../../src/main/config/app");

describe("Patients Routes", () => {
  describe("GET /patients-recommended", () => {
    describe("Missing params", () => {
      it("Should return 400 when both query params are missing", async () => {
        const response = await request(app).get("/api/patients-recommended");

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          error: 'Missing required params "lat" and/or "lng"',
        });
      });

      it("Should return 400 when query param 'lng' is missing", async () => {
        const response = await request(app).get(
          "/api/patients-recommended?lat=40"
        );

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          error: 'Missing required params "lat" and/or "lng"',
        });
      });

      it("Should return 400 when query param 'lat' is missing", async () => {
        const response = await request(app).get(
          "/api/patients-recommended?lng=40"
        );

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          error: 'Missing required params "lat" and/or "lng"',
        });
      });
    });

    xdescribe("Server Error", () => {
      it("Should return 500 if anything throws", async () => {
        const response = await request(app).get(
          "/api/patients-recommended?lat=40&lng=-120"
        );

        expect(response.statusCode).toBe(204);
        expect(response.body).toEqual({});
      });
    });

    xdescribe("No Content", () => {
      it("Should return 204 with null if getPatientsTopList returns empty", async () => {
        const response = await request(app).get(
          "/api/patients-recommended?lat=40&lng=-120"
        );

        expect(response.statusCode).toBe(204);
        expect(response.body).toEqual({});
      });
    });

    describe("Success case", () => {
      it("Should return 10 best recommended patients based on facility location", async () => {
        const response = await request(app).get(
          "/api/patients-recommended?lat=40&lng=-120"
        );

        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(10);
      });
    });
  });
});
