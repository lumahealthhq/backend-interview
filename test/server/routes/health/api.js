const chai = require("chai");
const {assert} = chai;
chai.use(require("chai-http"));

describe("# API health check", ()=>{
    it("Should get HTTP 204 with no body for healthcheck endpoint", async()=>{
        const response = await chai.request(global.server).get("/health/api");
        assert.strictEqual(response.status, 204);
        assert.isEmpty(response.body);
        assert.isEmpty(response.text);
    });
});