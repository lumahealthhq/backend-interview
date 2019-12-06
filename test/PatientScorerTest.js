const expect = require('chai').expect;

import PatientScorer from "../src/PatientScorer";

describe('PatientScorer#calculateAgeScore()', function() {
    it('above cutoff', function() {
        expect(PatientScorer.calculateAgeScore(PatientScorer.AGE_CUTOFF + 1)).to.be.equal(10);
    });

    it('below cutoff', function() {
        expect(PatientScorer.calculateAgeScore(PatientScorer.AGE_CUTOFF - 1)).to.be.below(10);
    });
});

describe('PatientScorer#calculateAcceptedOffersScore()', function() {
    it('No accepted offers', function() {
        expect(PatientScorer.calculateAcceptedOffersScore(0)).to.be.equal(0);
    });

    it('Few accepted offers', function() {
        expect(PatientScorer.calculateAcceptedOffersScore(5)).to.be.below(10);
    });

    it('At maximum accepted offers', function() {
        expect(PatientScorer.calculateAcceptedOffersScore(PatientScorer.MAX_ACCEPTED_OFFERS)).to.be.equal(10);
    });

    it('Above maximum accepted', function() {
        expect(PatientScorer.calculateAcceptedOffersScore(PatientScorer.MAX_ACCEPTED_OFFERS + 100)).to.be.equal(10);
    });
});

describe('PatientScorer#calculateCanceledOffersScore()', function() {
    it('No cancellations', function() {
        expect(PatientScorer.calculateCanceledOffersScore(0)).to.be.equal(10);
    });

    it('Few cancellations', function() {
        expect(PatientScorer.calculateCanceledOffersScore(5)).to.be.below(10);
    });

    it('At maximum cancellations', function() {
        expect(PatientScorer.calculateCanceledOffersScore(PatientScorer.MAX_CANCELED_OFFERS)).to.be.equal(0);
    });

    it('Above maximum cancellations', function() {
        expect(PatientScorer.calculateCanceledOffersScore(PatientScorer.MAX_CANCELED_OFFERS + 100)).to.be.equal(0);
    });
});

describe('PatientScorer#calculateAverageReplyTimeScore()', function() {
    it('reply time above cutoff', function() {
        expect(PatientScorer.calculateAverageReplyTimeScore(PatientScorer.REPLY_TIME_CUTOFF + 1)).to.be.equal(5);
    });

    it('reply time below cutoff', function() {
        expect(PatientScorer.calculateAverageReplyTimeScore(PatientScorer.REPLY_TIME_CUTOFF - 1)).to.be.equal(10);
    });
});

describe('PatientScorer#calculateDistanceScore()', function() {
    let facilityLocation = {
        "latitude": "-10.1998",
        "longitude": "-57.4325"
    }
    let farLocation = {
        "latitude": "-10.1998",
        "longitude": "57.4325"
    }
    let nearLocation = {
        "latitude": "-10.1998",
        "longitude": "-57.4325"
    }
    it('above cutoff distance', function() {
        expect(PatientScorer.calculateDistanceScore(farLocation, facilityLocation)).to.be.below(10);
    });

    it('below cutoff distance', function() {
        expect(PatientScorer.calculateDistanceScore(nearLocation, facilityLocation)).to.be.equal(10);
    });
});