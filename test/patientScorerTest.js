const expect = require('chai').expect;

import PatientScorer from "../src/patient-scorer";

describe('getNormalizedScoreForAge()', function() {
  it('Young adult and middle-aged', function() {
    expect(PatientScorer.getNormalizedScoreForAge(32)).to.be.equal(10);
  });

  it('Senior citizen', function() {
    expect(PatientScorer.getNormalizedScoreForAge(72)).to.be.below(10);
  })
});

describe('getNormalizedScoreForAverageReplyTime()', function() {
  it('Quick replier', function() {
    expect(PatientScorer.getNormalizedScoreForAverageReplyTime(2 * 60)).to.be.equal(10);
  });

  it('Slow replier', function() {
    expect(PatientScorer.getNormalizedScoreForAverageReplyTime(60 * 60)).to.be.below(10);
  });
});

describe('getNormalizedScoreForCanceledOffers()', function() {
  it('High cancellation patient', function() {
    expect(PatientScorer.getNormalizedScoreForCanceledOffers(100)).to.be.below(10);
  });

  it('Low info patient', function() {
    expect(PatientScorer.getNormalizedScoreForCanceledOffers(5)).to.be.equal(10);
  });
});