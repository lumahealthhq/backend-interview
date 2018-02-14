var geolib = require('geolib');
var MILES_TO_METERS = 1609.34;
var {assert, expect} = require('chai');
var LumaWaitlist = require('../src/LumaWaitlist.js');
var sampleData = require('../sample-data/patients.json');

/* global describe, it */
describe('Setup.test.js - Setup, Instantiation, & Invokation', function () {
  beforeEach(function () {
    this.lumaWaitList = new LumaWaitlist(sampleData);
  });

  it('should score age', function () {
    expect(() => {
      this.lumaWaitList.scoreAge({age: 10})
    }).to.throw(Error, 'patient.is.a.minor');

    expect(this.lumaWaitList.scoreAge({age: 24})).to.equal(28);
    expect(this.lumaWaitList.scoreAge({age: 34})).to.equal(0);
    expect(this.lumaWaitList.scoreAge({age: 44})).to.equal(28);
    expect(this.lumaWaitList.scoreAge({age: 54})).to.equal(42);
    expect(this.lumaWaitList.scoreAge({age: 64})).to.equal(71);
    expect(this.lumaWaitList.scoreAge({age: 65})).to.equal(100);
  });

  it.only('should score distance', function() {
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
    expect(this.lumaWaitList.scoreDistance(patient5, practice)).to.equal(0);
    expect(this.lumaWaitList.scoreDistance(patient6, practice)).to.equal(0);
  })
})
