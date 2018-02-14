var {assert, expect} = require('chai');
var LumaWaitlist = require('../src/LumaWaitlist.js');

/* global describe, it */
describe('Setup.test.js - Setup, Instantiation, & Invokation', function () {
  it('should be a class instantiation', function () {
    assert.isOk(new LumaWaitlist())
  })
})
