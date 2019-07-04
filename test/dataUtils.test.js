const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const getPatientCallList = require("../src/getPatientCallList");
const getDistanceToPractice = require("../src/dataUtils/getDistanceToPractice");

describe("test dataUtils", () => {
  // maybe the patient lives above the practice?
  it("Should return a value of 0 if values are identical", () => {
    const practiceLat = (patientLat = 37.7904);
    const practiceLong = (patientLong = 122.405);
    const distance = getDistanceToPractice(
      practiceLat,
      practiceLong,
      patientLat,
      patientLong
    );
    assert.equal(distance, 0);
  });
});
