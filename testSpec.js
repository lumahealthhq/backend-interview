const expect = require('chai').expect;
const calculatePatientScores = require('./calculateScore.js').calculatePatientScores;
const calcDistBetweenGPSCoord = require('./calculateScore.js').calcDistBetweenGPSCoord;

describe('Test spec for generate call list', () => {
  describe('Test for calculating distance between 2 GPS coordinates', () => {
    let location1Lat, location1Long, location2Lat, location2Long;
    it('Each degree variation in latitude is approx 111km apart.', () => {
      location1Lat = 54.3381985;
      location1Long = -6.2592576;
      location2Lat = 53.3381985;
      location2Long = -6.2592576;
      expect(calcDistBetweenGPSCoord(location1Lat, location1Long, location2Lat, location2Long)).to.equal(111197.31774562287)
    });
    it('Distance between south and north pole should be half the meridional circumference of the earth', () => {
      //location1 = south pole, location2 = north pole
      location1Lat = -90;
      location1Long = 0;
      location2Lat = 90;
      location2Long = 0;
      expect(calcDistBetweenGPSCoord(location1Lat, location1Long, location2Lat, location2Long)).to.equal(20015517.194214113);
    });
    it('2 points on the equator directly across the world should be half the length of the equator.', () => {
      //location1 = point1 on equator, location2 = point2 on equator
      location1Lat = 0;
      location1Long = 0;
      location2Lat = 0;
      location2Long = 180;
      expect(calcDistBetweenGPSCoord(location1Lat, location1Long, location2Lat, location2Long)).to.equal(20015517.194214113)
    });
  });
  describe('Test for calculating patient score', () => {
    it('', () => {
      
      expect(calculatePatientScores('46.7110', '-63.1150')).to.equal()
    });

  });
});