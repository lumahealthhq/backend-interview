/**
 * test getPatientCallList.js
 * and tfLinearRegression.js
 */
const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const getPatientCallList = require("../src/getPatientCallList");

describe("test getPatientCallList", () => {
  it("returns a list of 10 patients for valid parameters", async () => {
    const list = await getPatientCallList(37.7904, 122.405, 10);
    assert.lengthOf(list, 10);
  });
  it("patients with insufficient data should be at the top of the list, with a ranking of -1", async () => {
    const list = await getPatientCallList(-100, 200, 0);
    expect(list[0].ranking).to.equal(-1);
  });
});
