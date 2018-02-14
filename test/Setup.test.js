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




})
