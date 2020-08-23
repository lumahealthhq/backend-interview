const { capitalizeFirstLetter } = require("../utils/utils.js");

class NormalizationService {
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

    normalize(patientWs) {
        const filledMaxMinObj = this._setMinMaxForAllPatients(
            patientWs,
            this.maxMinObj
        );

        this._normalizeFeatures(patientWs, filledMaxMinObj);

        return patientWs;
    }

    _setMinMaxForAllPatients(patientWs, maxMinObj) {
        const self = this;
        patientWs.forEach((patient) =>
            self.featuresToNormalize.forEach((feature) => {
                NormalizationService._setFeatureMinMax(
                    feature.name,
                    maxMinObj,
                    patient
                );
            })
        );

        return maxMinObj;
    }

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

    _normalizeFeatures(patientWs, maxMinObj) {
        const self = this;
        patientWs.forEach((pw) =>
            self.featuresToNormalize.forEach(({ name }) => {
                const firstLetterCapitalizedFeature = capitalizeFirstLetter(
                    name
                );
                const featureMinName = `min${firstLetterCapitalizedFeature}`;
                const featureMaxName = `max${firstLetterCapitalizedFeature}`;
                const featureNormName = `norm${firstLetterCapitalizedFeature}`;

                const minFeatureValue = maxMinObj[featureMinName];
                const maxFeatureValue = maxMinObj[featureMaxName];

                const patient = pw.getPatient();
                const featureValue = patient[name] ?? pw[name];

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
