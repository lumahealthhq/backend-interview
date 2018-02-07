import { calculateScore } from '../../helper/score.js';
import { expect } from 'chai';
import patients from './fixtures/patients.json';

describe('Score helper', function() {
  describe('calculateScore', function() {
    it('calculates score for one patient with little activity', function() {
      const score = calculateScore({ latitude:-81.0941,longitude: 144.9563 }, {
          "id": "41fd45bc-b166-444a-a69e-9d527b4aee48",
          "name": "Bernard Mosciski",
          "location": {
            "latitude": "-81.0341",
            "longitude": "144.9963"
          },
          "age": 21,
          "acceptedOffers": 1,
          "canceledOffers": 3,
          "averageReplyTime": 1
        },
      );

      expect(score).to.not.equal(null);
      expect(parseInt(score)).to.be.greaterThan(0);
      expect(parseInt(score)).to.equal(4);
    });
    it('calculates score for one patient', function() {
      const score = calculateScore({ latitude:-81.0941,longitude: 144.9563 }, {
          "id": "41fd45bc-b166-444a-a69e-9d527b4aee48",
          "name": "Bernard Mosciski",
          "location": {
            "latitude": "-81.0341",
            "longitude": "144.9963"
          },
          "age": 21,
          "acceptedOffers": 20,
          "canceledOffers": 60,
          "averageReplyTime": 460
        },
      );
      expect(score).to.not.equal(null);
      expect(parseInt(score)).to.be.greaterThan(0);
      expect(parseInt(score)).to.equal(2);
    });
  });
});
