const chai = require("chai");
const {assert} = chai;
chai.use(require("chai-http"));

describe("# API not found standard response", ()=>{
    it("Should get HTTP 404", async()=>{
        const response = await chai.request(global.server).get("/this/route/does/not/exist");
        assert.strictEqual(response.status, 404);
    });
});