import getDistance from 'geolib/es/getDistance';

//TODO: Make these values easily adjustable via configuration file.
const AGE_CUTOFF = 45;
//new patient is below this number of attempts
const NEW_PATIENT_OFFER_CUTOFF = 20;
const NEW_PATIENT_ACCEPT_RATE = 0.2;
//offers affect the score up to this number
const MAX_ACCEPTED_OFFERS = 100;
const MAX_CANCELED_OFFERS = 10;
const REPLY_TIME_CUTOFF = 1800;
const DISTANCE_CUTOFF = 15000;
//TODO: Determine a distance penalty for patients who are definitely too far.

//stand-alone scorer for input patient
export default class PatientScorer {
    static calculatePartialPatientScore(patientRecord) {
        let score = 0;
        if ((patientRecord.acceptedOffers + patientRecord.canceledOffers) < NEW_PATIENT_OFFER_CUTOFF && (Math.random() < NEW_PATIENT_ACCEPT_RATE)) {
            //a lucky new patient! max out offers and reply time scores. They are assumed to be non-significant.
            score = 8;
            //add age score
            score += PatientScorer.calculateAgeScore(patientRecord.age) * categories.age.weight;
        } else {
            //tally up scores
            for (const [category, properties] of Object.entries(categories)) {
                score += properties.calculation(patientRecord[category]) * properties.weight;
            }
        }
        return score;
    }

    //includes distance score
    static calculateFinalPatientScore(patientRecord, facilityLocation) {
        let score = patientRecord.score;
        score += PatientScorer.calculateDistanceScore(patientRecord.entry.location, facilityLocation) * 0.1;

        return score;
    }

    //all returned scores range from 1-10
    //TODO: Write support code that determines correlation between age and score.
    static calculateAgeScore(age) {
        return age > AGE_CUTOFF ? 10 : 5;
    }

    //TODO: Determine sensible values for expected accepted and canceled offers for scoring purposes.
    static calculateAcceptedOffersScore(acceptedOffers) {
        return Math.min(10, (acceptedOffers / MAX_ACCEPTED_OFFERS) * 10);
    }

    static calculateCanceledOffersScore(canceledOffers) {
        return Math.max(0, ((MAX_CANCELED_OFFERS - canceledOffers) / MAX_CANCELED_OFFERS) * 10);
    }

    static calculateAverageReplyTimeScore(averageReplyTime) {
        return averageReplyTime < REPLY_TIME_CUTOFF ? 10 : 5;
    }

    static calculateDistanceScore(patientLocation, facilityLocation) {
        const distance = getDistance(patientLocation, facilityLocation);
        return distance < DISTANCE_CUTOFF ? 10 : 5;
    }

    static get AGE_CUTOFF() {
        return AGE_CUTOFF;
    }
    static get NEW_PATIENT_OFFER_CUTOFF() {
        return NEW_PATIENT_OFFER_CUTOFF;
    }
    static get NEW_PATIENT_ACCEPT_RATE() {
        return NEW_PATIENT_ACCEPT_RATE;
    }
    static get MAX_ACCEPTED_OFFERS() {
        return MAX_ACCEPTED_OFFERS;
    }
    static get MAX_CANCELED_OFFERS() {
        return MAX_CANCELED_OFFERS;
    }
    static get REPLY_TIME_CUTOFF() {
        return REPLY_TIME_CUTOFF;
    }
    static get DISTANCE_CUTOFF() {
        return DISTANCE_CUTOFF;
    }
}

const categories = {
    age: {
        weight: 0.1,
        calculation: PatientScorer.calculateAgeScore
    },
    acceptedOffers: {
        weight: 0.3,
        calculation: PatientScorer.calculateAcceptedOffersScore
    },
    canceledOffers: {
        weight: 0.3,
        calculation: PatientScorer.calculateCanceledOffersScore
    },
    averageReplyTime: {
        weight: 0.2,
        calculation: PatientScorer.calculateAverageReplyTimeScore
    }
}