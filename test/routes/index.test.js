import express from 'express';
import request from 'supertest';
import { expect } from 'chai';
import { getResult } from '../../routes/index';

describe('Routes', function() {
  describe('Get weighted score', function() {
    it('calculates score for one patient', function() {
      const result = getResult({
          "latitude": "-81.0341",
          "longitude": "144.9963"
       });
       expect(result).to.not.equal(null);
    });
  });
});
