const request = require("supertest");
const express = require("express");
const service = require("./patientRecommender");

const app = express();
app.use(service);

describe("testing Patient Recommender Service", () => {
    test("Should return an array of patients", async () => {
        const got = await request(app).get("/queue").query({
            latitude: 46.711,
            longitude: -63.114,
        });
        expect(got.statusCode).toEqual(200);
        expect(got.body.length).toEqual(10);
    });
});
