var assert = require('chai').assert;
var app = require('../index');
describe('isValidLocation',function(){
  it('Function should return false',function(){
        assert.equal(app.isValidLocation(null,1234),false);
  });
});

describe('readDataFile',function(){
  it('Function should return null',function(){
        assert.equal(app.readDataFile('patient.json'),null);
  });
});

describe('getDistanceFromClinic',function(){
  it('Function should return 0',function(){
        assert.equal(Number(app.getDistanceFromClinic({"latitude":"-35.5336","longitude":"-25.2795"},{"latitude":"-35.5336","longitude":"-25.2795"})).toFixed(0),0);
  });
});

describe('parseData',function(){
  it('Function should return null',function(){
        assert.equal(app.parseData("invalid json"),null);
  });
});

describe('getNormalizedScore',function(){
  it('Function should return 11',function(){
        assert.equal(app.getNormalizedScore(10,1,11),11);
  });
});

describe('getAbsoulteScore',function(){
  it('Function should return 11',function(){
        assert.equal(app.getAbsoulteScore(10,10,10,10,10),10);
  });
});
