const { LatLng, computeDistanceBetween } = require("spherical-geometry-js");
const { getRandomArbitrary } = require("../utils/utils.js");
const PatientWrapper = require("../models/PatientWrapper.js");
const NormalizationService = require("./NormalizationService.js");

/**
 * Class responsible for recommending the top 10 promising patients to accept appointment offers.
 * 
 * @constant {Object} maxMinObj Object that holds features minima and maxima.
 * @property {}
 */
class RecommendationService {
    featuresToBeNormalized = Object.freeze([
        "age",
        "acceptedOffers",
        "canceledOffers",
        "averageReplyTime",
        "distanceToFacility",
    ]);

    /**
     * Constructs a RecommendationService.
     * 
     * @param {Object[]} patients List of patients.
     * @param {Object} facilityPosition Object that holds a facility position, that is, latitude and longitude values.
     */
    constructor(patients, facilityPosition) {
        this.normalizationService = new NormalizationService(
            this.featuresToBeNormalized
        );

        this.patientWs = patients.map(PatientWrapper.Factory);
        this.facilityPosition = facilityPosition;
    }

    /**
     * Recommends top 10 promising patients to accept appointment offers.
     */
    recommendTopTen() {
        this._setDistancesToFacility();
        this.normalizationService.normalize(this.patientWs);

        this._computeAllScores();

        return this._recommend().map((pw) => pw.getPatient());
    }

    /**
     * Computes and populates the list of Patient Wrappers with their respective distance to
     * the facility.
     */
    _setDistancesToFacility() {
        const self = this;
        self.patientWs.forEach((pw) => {
            if (!pw) return;

            const patient = pw.getPatient();
            const patientPos = new LatLng(
                patient.location?.latitude ?? 0,
                patient.location?.longitude ?? 0
            );
            const facilityPos = new LatLng(
                self.facilityPosition.latitude,
                self.facilityPosition.longitude
            );

            pw.distanceToFacility = computeDistanceBetween(
                patientPos,
                facilityPos
            );
        });
    }

    /**
     * Computes and fills the scores for all patient wrappers.
     */
    _computeAllScores() {
        const self = this;
        self.patientWs.forEach((pw) => {
            pw.scores = RecommendationService._computeScore(pw);
        });
    }

    /**
     * Computes and fills the scores of a single patient.
     * 
     * @param {PatientWrapper} patientW The patient being considered to the score evaluation.
     */
    static _computeScore(patientW) {
        const behaviorScore =
            0.3 * patientW.normAcceptedOffers +
            0.3 * (11 - patientW.normCanceledOffers) +
            0.2 * (11 - patientW.normAverageReplyTime);
        const demographicScore =
            0.1 * patientW.normAge +
            0.1 * (11 - patientW.normDistanceToFacility);
        const totalScore = behaviorScore + demographicScore;

        return { behaviorScore, demographicScore, totalScore };
    }

    /**
     * Returns the 10 patients that will most likely accept an appointment offer.
     * The 7 first patients selected are the ones with the best total score value, which goes from 1 to 10.
     * The 3 remaining ones are ramdomly chosen by taking in consideration the ones with the greatest behavior value.
     * 
     * @returns {PatientWrapper[]} The top 10 recommended patients.
     */
    _recommend() {
        const numberOfPatients = this.patientWs.length;

        this.patientWs.sort((a, b) =>
            a.scores.totalScore > b.scores.totalScore ? -1 : 1
        );

        const topSeven = this.patientWs.slice(0, 7);

        const rest = this.patientWs.slice(7, numberOfPatients);

        const bestDemographicScoresLeft = rest.sort((a, b) =>
            a.scores.demographicScore > b.scores.demographicScore ? -1 : 1
        );

        /**
         * Then, we randomly pick the remaining patients from the first x% patients with the highest demografic scores.
         */

        // Select an appropriate value of x so that the resulting set contains enough patients for our random selection.
        let x = 0.1;
        while (
            Math.floor(x * bestDemographicScoresLeft.length) < 3 &&
            !(Math.abs(x - 1) < 0.01)
        ) {
            x += 0.1;
        }

        const sliceSize = Math.floor(x * bestDemographicScoresLeft.length);

        const restRecommended = new Set();
        // We need to check if restRecommended.size is less than the slice size because the random method
        // called could draw the same value more than once. If it's greater than the slice size, that means we don't have
        // enough patients to recommend.
        while (restRecommended.size < 3 && restRecommended.size < sliceSize) {
            // getting random patient within the x% best demographic score slice
            const randomPatient =
                bestDemographicScoresLeft[getRandomArbitrary(0, sliceSize)];

            restRecommended.add(randomPatient);
        }

        return [...topSeven, ...restRecommended];
    }
}

module.exports = RecommendationService;
