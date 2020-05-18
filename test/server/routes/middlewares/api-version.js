const chai = require("chai");
const {assert} = chai;
chai.use(require("chai-http"));
const {API_HEADER_NAME, API_HEADER_VALUE} = require("../../../../env");

describe("# API version header test", ()=>{
    it(`Should get HTTP header named ${API_HEADER_NAME} with ${API_HEADER_VALUE} value`, async()=>{
        const response = await chai.request(global.server).get("/health/api");
        assert.property(response.header, API_HEADER_NAME.toLowerCase());
        assert.strictEqual(response.header[API_HEADER_NAME.toLowerCase()], API_HEADER_VALUE);
    });
});