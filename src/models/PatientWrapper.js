/**
 * PatientWrapper is used to store extra data regarding the normalization and final scores computed for a single patient.
 */
class PatientWrapper {
    // Patient should be immutable. We don't want it to be directly accessed outside.
    // If someone changes a patient's fields, then we should recompute the fields defined below.
    #patient;

    // Computed values.
    distanceToFacility;

    // Object that stores behavior, demographic and total score (behavior + demographic).
    scores;

    // Normalized age.
    normAge;

    // Normalized number of accepted offers.
    normAcceptedOffers;

    // Normalized number of canceled offers.
    normCanceledOffers;

    // Normalized average reply time.
    normAverageReplyTime;

    // Normalized distance to facility. This is the first field to be set.
    normDistanceToFacility;

    constructor(patient) {
        this.#patient = Object.freeze(patient);
    }

    static Factory(patient) {
        return new PatientWrapper(patient);
    }

    getPatient() {
        return this.#patient;
    }
}

module.exports = PatientWrapper;
