const chai = require("chai");
const {assert} = chai;
chai.use(require("chai-http"));

describe("# API health check full status", ()=>{
    it("Should get a response with the status of the server", async()=>{
        const response = await chai.request(global.server).get("/health/status");
        assert.strictEqual(response.status, 200);
        assert.isNotEmpty(response.body);
        assert.strictEqual(response.body.status, "OK");
        ["operatingSystem", "process", "application"].forEach(key=>assert.isObject(response.body[key]));
    });
});