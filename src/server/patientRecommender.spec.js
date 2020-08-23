const request = require("supertest");
const express = require("express");
const service = require("./patientRecommender");
const expectedResponse = require("../../responseExample.json");

const app = express();
app.use(service);

describe("GET /queue?", () => {
    test("given latitude=37.791050 and longitude=-122.401932, should return a valid array with 10 patients", async () => {
        const got = await request(app).get("/queue").query({
            latitude: 37.791050,
            longitude: -122.401932,
        });

        const recommendedPatients = got.body;

        expect(got.statusCode).toEqual(200);
        expect(recommendedPatients.length).toEqual(10);

        // Asserting the response for the first 7 patients because the other 3 are randomly picked.
        for (let i = 0; i < 7; i++) {
            expect(recommendedPatients[i]).toEqual(expectedResponse[i]);
        }
    });

    test("given an invalid latitude and longitude values, should return unprocessable entity status", async () => {
        const got = await request(app).get("/queue").query({
            latitude: "",
            longitude: "",
        });

        expect(got.statusCode).toEqual(422)
    });

    test("given empty query parameters, should return unprocessable entity status", async () => {
        const got = await request(app).get("/queue").query({});

        expect(got.statusCode).toEqual(422)
    });
});

describe("GET /ping", () => {
    test("should return 'pong' with status 200", async () => {

        const got = await request(app).get("/ping");

        expect(got.statusCode).toEqual(200);
        expect(got.body.message).toEqual("pong");

    });
});

