var {assert, expect} = require('chai');
var simple = require('simple-mock');
var geolib = require('geolib');
var MILES_TO_METERS = 1609.34;


var LumaWaitlist = require('../src/LumaWaitlist.js');
var sampleData = require('../sample-data/patients.json');

/* global describe, it */
describe('Setup.test.js - Setup, Instantiation, & Invokation', function () {
  beforeEach(function () {
    this.lumaWaitList = new LumaWaitlist();
    this.lumaWaitList.init(sampleData);
  });

  it('should score age', function () {
    expect(() => {
      this.lumaWaitList.scoreAge({age: 10})
    }).to.throw(Error, 'patient.is.a.minor');

    expect(this.lumaWaitList.scoreAge({age: 24})).to.equal(100);
    expect(this.lumaWaitList.scoreAge({age: 34})).to.equal(28);
    expect(this.lumaWaitList.scoreAge({age: 44})).to.equal(0);
    expect(this.lumaWaitList.scoreAge({age: 54})).to.equal(28);
    expect(this.lumaWaitList.scoreAge({age: 64})).to.equal(71);
    expect(this.lumaWaitList.scoreAge({age: 65})).to.equal(100);
  });

  it('should score distance', function () {
    var practice = {
      latitude: 37.788610,
      longitude: -122.404827,
    }

    var patient1 = geolib.computeDestinationPoint(practice, 0, 180);
    var patient2 = geolib.computeDestinationPoint(practice, 10 * MILES_TO_METERS, 180);
    var patient3 = geolib.computeDestinationPoint(practice, 26 * MILES_TO_METERS, 180);
    var patient4 = geolib.computeDestinationPoint(practice, 40 * MILES_TO_METERS, 180);
    var patient5 = geolib.computeDestinationPoint(practice, 58 * MILES_TO_METERS, 180);
    var patient6 = geolib.computeDestinationPoint(practice, 100 * MILES_TO_METERS, 180);

    expect(this.lumaWaitList.scoreDistance(patient1, practice)).to.equal(100);
    expect(this.lumaWaitList.scoreDistance(patient2, practice)).to.equal(61);
    expect(this.lumaWaitList.scoreDistance(patient3, practice)).to.equal(50);
    expect(this.lumaWaitList.scoreDistance(patient4, practice)).to.equal(41);
    expect(() => {
      this.lumaWaitList.scoreDistance(patient5, practice)
    }).to.throw(Error, 'patient.too.far');
    expect(() => {
      this.lumaWaitList.scoreDistance(patient6, practice)
    }).to.throw(Error, 'patient.too.far');
  });

  it('should score scoreAverageReplyTime', function () {
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 0})).to.equal(96);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 100})).to.equal(95);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 200})).to.equal(94);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 300})).to.equal(93);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 400})).to.equal(91);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 500})).to.equal(89);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 600})).to.equal(88);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 700})).to.equal(85);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 800})).to.equal(83);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 900})).to.equal(81);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 1000})).to.equal(78);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 1100})).to.equal(75);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 1200})).to.equal(72);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 1300})).to.equal(69);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 1400})).to.equal(65);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 1500})).to.equal(61);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 1600})).to.equal(58);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 1700})).to.equal(54);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 1800})).to.equal(50);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 1900})).to.equal(46);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 2000})).to.equal(43);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 2000})).to.equal(43);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 2100})).to.equal(39);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 2200})).to.equal(35);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 2300})).to.equal(32);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 2400})).to.equal(28);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 2500})).to.equal(25);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 2600})).to.equal(22);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 2700})).to.equal(20);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 2800})).to.equal(17);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 2900})).to.equal(15);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 3000})).to.equal(13);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 3100})).to.equal(11);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 3200})).to.equal(9);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 3300})).to.equal(8);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 3400})).to.equal(6);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 3500})).to.equal(5);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 3600})).to.equal(4);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 3700})).to.equal(3);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 3800})).to.equal(3);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 3900})).to.equal(2);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 4000})).to.equal(2);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 4100})).to.equal(1);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 4200})).to.equal(1);
    expect(this.lumaWaitList.scoreAverageReplyTime({averageReplyTime: 4300})).to.equal(1);
  });

  it('should score scoreCancellationRate', function () {
    expect(this.lumaWaitList.scoreCancellationRate({acceptedOffers: 100, canceledOffers: 0})).to.equal(98);
    expect(this.lumaWaitList.scoreCancellationRate({acceptedOffers: 90, canceledOffers: 10})).to.equal(96);
    expect(this.lumaWaitList.scoreCancellationRate({acceptedOffers: 80, canceledOffers: 20})).to.equal(90);
    expect(this.lumaWaitList.scoreCancellationRate({acceptedOffers: 70, canceledOffers: 30})).to.equal(81);
    expect(this.lumaWaitList.scoreCancellationRate({acceptedOffers: 60, canceledOffers: 40})).to.equal(68);
    expect(this.lumaWaitList.scoreCancellationRate({acceptedOffers: 50, canceledOffers: 50})).to.equal(52);
    expect(this.lumaWaitList.scoreCancellationRate({acceptedOffers: 40, canceledOffers: 60})).to.equal(36);
    expect(this.lumaWaitList.scoreCancellationRate({acceptedOffers: 30, canceledOffers: 70})).to.equal(22);
    expect(this.lumaWaitList.scoreCancellationRate({acceptedOffers: 20, canceledOffers: 80})).to.equal(12);
    expect(this.lumaWaitList.scoreCancellationRate({acceptedOffers: 10, canceledOffers: 90})).to.equal(5);
    expect(this.lumaWaitList.scoreCancellationRate({acceptedOffers: 0, canceledOffers: 100})).to.equal(2);
  });

  describe.only('patient scoring', function () {
    beforeEach(function () {
      simple.mock(this.lumaWaitList, 'scoreAge').returnWith(100);
      simple.mock(this.lumaWaitList, 'scoreDistance').returnWith(100);
      simple.mock(this.lumaWaitList, 'scoreReplyTime').returnWith(100);
      simple.mock(this.lumaWaitList, 'scoreCancellationRate').returnWith(50);

      this.patient = {
        age: 65,
        latitude: 37.788610,
        longitude: -122.404827,
        averageReplyTime: 2000,
        canceledOffers: 5,
        acceptedOffers: 5
      };

      this.practice = {
        latitude: 37.788610,
        longitude: -122.404827,
      }
    });

    it('should score patient with mulligans', function () {
      expect(this.lumaWaitList.scorePatient(this.patient, this.practice)).to.equal(100);
    })

    it('should score patient without mulligans', function () {
      this.patient.canceledOffers = 0;
      this.patient.acceptedOffers = 100;
      expect(this.lumaWaitList.scorePatient(this.patient, this.practice)).to.equal(70);
    });

    it('should not score minors', function() {
      simple.mock(this.lumaWaitList, 'scoreAge').throwWith(new Error('patient.is.a.minor'));
      expect(this.lumaWaitList.scorePatient(this.patient, this.practice)).to.equal(0);
    })

    it('should not score distant patients', function() {
      simple.mock(this.lumaWaitList, 'scoreDistance').throwWith(new Error('patient.too.far'));
      expect(this.lumaWaitList.scorePatient(this.patient, this.practice)).to.equal(0);
    })
  })
})
