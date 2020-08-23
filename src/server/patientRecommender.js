const express = require("express");
const RecommendationService = require("../services/RecommendationService");
const patients = require("../../patients.json");

const router = express.Router();

router.get("/ping", (req, res) => res.send({ message: "pong" }));

router.get("/queue", (req, res) => {
    let { latitude, longitude } = req.query;

    if (
        latitude === "" ||
        longitude === "" ||
        latitude === undefined ||
        longitude === undefined
    ) {
        // 422 - Unprocessable Entity
        return res.status(422).json({ error: "Cannot process empty values" });
    }

    latitude = Number(latitude);
    longitude = Number(longitude);
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
        // 422 - Unprocessable Entity
        return res
            .status(422)
            .json({ error: "Cannot process non number values" });
    }

    const facilityPosition = {
        latitude,
        longitude,
    };

    try {
        const recommendationService = new RecommendationService(
            patients,
            facilityPosition
        );

        const recommendedPatients = recommendationService.recommendTopTen();

        return res.status(200).json(recommendedPatients);
    } catch (e) {

        console.error(e);
        return res
            .status(500)
            .json({ error: "Internal error, please try again later" });
    }
});

module.exports = router;
