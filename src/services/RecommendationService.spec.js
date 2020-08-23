const RecommendationService = require("./RecommendationService");

describe("compute score method", () => {
    test("should return computed scores given a patient", () => {
        const patient = {
            id: "541d25c9-9500-4265-8967-240f44ecf723",
            name: "Samir Pacocha",
            location: { latitude: "46.7110", longitude: "-63.1150" },
            age: 46,
            acceptedOffers: 49,
            canceledOffers: 92,
            averageReplyTime: 2598,
            distanceToFacility: 76.32939459536885,
            normAge: 4.260869565217391,
            normAcceptedOffers: 5.41,
            normCanceledOffers: 9.28,
            normAverageReplyTime: 7.5015299026425595,

            normDistanceToFacility: 1,
        };

        const {
            normAcceptedOffers,
            normCanceledOffers,
            normAverageReplyTime,
            normAge,
            normDistanceToFacility,
        } = patient;

        const behaviorScore =
            0.3 * normAcceptedOffers +
            0.3 * (11 - normCanceledOffers) +
            0.2 * (11 - normAverageReplyTime);

        const demographicScore =
            0.1 * normAge + 0.1 * (11 - normDistanceToFacility);

        const totalScore = behaviorScore + demographicScore;

        const score = { behaviorScore, demographicScore, totalScore };
        expect(RecommendationService._computeScore(patient)).toEqual(score);
    });
});
