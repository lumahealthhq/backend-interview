const { capitalizeFirstLetter } = require("../utils/utils.js");
const PatientWrapper = require("../models/PatientWrapper.js");

/**
 * Class responsible for providing Minimax normalization functionality.
 */
class NormalizationService {

    /**
     * Constructs a NormalizationService.
     * 
     * 
     * @property {Object} maxMinObj Object that holds features minima and maxima.
     * @property {String[]} featuresToNormalize Features to be considered in the normalization process.
     */
    constructor(featuresToNormalize) {
        this.featuresToNormalize = featuresToNormalize;

        this.maxMinObj = {
            minAge: Infinity,
            maxAge: -Infinity,
            minAcceptedOffers: Infinity,
            maxAcceptedOffers: -Infinity,
            minCanceledOffers: Infinity,
            maxCanceledOffers: -Infinity,
            minAverageReplyTime: Infinity,
            maxAverageReplyTime: -Infinity,
            minDistanceToFacility: Infinity,
            maxDistanceToFacility: -Infinity,
        };
    }

    /**
     * Given a list of patient wrappers, returns a processed list containing all patients 
     * filled with the computed normalization fields.
     * 
     * @param {PatientWrapper[]} patientWs List of patient wrappers.
     * @return {PatientWrapper[]} List of patient wrapper updated with normalization fields.
     */
    normalize(patientWs) {
        this._setMinMaxForAllPatients(patientWs, this.maxMinObj);

        this._normalizeFeatures(patientWs, this.maxMinObj);

        return patientWs;
    }

    /**
     * Populates maxMinObj with minima and maxima considering the features to normalize.
     * 
     * @param {PatientWrapper[]} patientWs List of patient wrappers.
     * @param {Object} maxMinObj Object that holds features minima and maxima.
     */
    _setMinMaxForAllPatients(patientWs, maxMinObj) {
        const self = this;
        patientWs.forEach((patient) =>
            self.featuresToNormalize.forEach(featureName => {
                NormalizationService._setFeatureMinMax(
                    featureName,
                    maxMinObj,
                    patient
                );
            })
        );
    }

    /**
     * Compares the patient feature value to the current maximum and minimum find so far.
     * If it's lesser than the current minimum or greater than the current maximum,
     * UPDATES maxMinObj, setting them as the new ones.
     * 
     * @param {String} featureName The feature name.
     * @param {Object} maxMinObj Object that holds features minima and maxima.
     * @param {PatientWrapper} patientW The patient wrapper.
     */
    static _setFeatureMinMax(featureName, maxMinObj, patientW) {
        const firstLetterCapitalizedFeature = capitalizeFirstLetter(
            featureName
        );
        const featureMinName = `min${firstLetterCapitalizedFeature}`;
        const featureMaxName = `max${firstLetterCapitalizedFeature}`;

        const patient = patientW.getPatient();
        const patientFeatureValue =
            patient[featureName] ?? patientW[featureName];

        if (patientFeatureValue < maxMinObj[featureMinName]) {
            maxMinObj[featureMinName] = patientFeatureValue;
        }
        if (patientFeatureValue > maxMinObj[featureMaxName]) {
            maxMinObj[featureMaxName] = patientFeatureValue;
        }
    }

    /**
     * Normalizes the features and fills the patients within patientWs taking in consideration maxMinObj.
     * 
     * @param {PatientWrapper[]} patientWs List of patient wrappers.
     * @param {*} maxMinObj Object that holds features minima and maxima.
     */
    _normalizeFeatures(patientWs, maxMinObj) {
        const self = this;
        patientWs.forEach((pw) =>
            self.featuresToNormalize.forEach(featureName => {
                const firstLetterCapitalizedFeature = capitalizeFirstLetter(featureName);

                const featureMinName = `min${firstLetterCapitalizedFeature}`;
                const featureMaxName = `max${firstLetterCapitalizedFeature}`;
                const featureNormName = `norm${firstLetterCapitalizedFeature}`;

                const minFeatureValue = maxMinObj[featureMinName];
                const maxFeatureValue = maxMinObj[featureMaxName];

                const patient = pw.getPatient();
                const featureValue = patient[featureName] ?? pw[featureName];

                // eslint-disable-next-line no-param-reassign
                pw[featureNormName] =
                    1 +
                    ((featureValue - minFeatureValue) * (10 - 1)) /
                    (maxFeatureValue - minFeatureValue);
            })
        );
    }
}

module.exports = NormalizationService;
