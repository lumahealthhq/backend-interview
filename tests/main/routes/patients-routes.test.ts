import request from "supertest";

import { app } from "@/main/config";

describe("Patients Routes", () => {
  describe("GET /patients-recommended", () => {
    describe("Missing params", () => {
      it("Should return 400 when both query params are missing", async () => {
        const response = await request(app).get("/api/patients-recommended");

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          error: "MissingParamError",
          message: "Missing param: lat",
        });
      });

      it("Should return 400 when query param 'lng' is missing", async () => {
        const response = await request(app).get(
          "/api/patients-recommended?lat=40"
        );

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          error: "MissingParamError",
          message: "Missing param: lng",
        });
      });

      it("Should return 400 when query param 'lat' is missing", async () => {
        const response = await request(app).get(
          "/api/patients-recommended?lng=40"
        );

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          error: "MissingParamError",
          message: "Missing param: lat",
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
        expect(Object.keys(response.body[0])).toEqual([
          "id",
          "age",
          "name",
          "location",
        ]);
      });

      it("Should include more information when providing debug flag", async () => {
        const response = await request(app).get(
          "/api/patients-recommended?lat=40&lng=-120&debug=true"
        );

        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(10);
        expect(Object.keys(response.body[0])).toEqual([
          "id",
          "name",
          "location",
          "age",
          "acceptedOffers",
          "canceledOffers",
          "averageReplyTime",
          "score",
          "distance",
          "distancePenalty",
          "littleBehaviorScore",
        ]);
      });
    });
  });
});
