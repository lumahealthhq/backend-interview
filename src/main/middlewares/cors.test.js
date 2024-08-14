const request = require("supertest");

const { app } = require("../config/app");

describe("cors middleware", () => {
  it("Should enable CORS", async () => {
    app.post("/test_cors", (req, res) => {
      res.send();
    });

    await request(app)
      .post("/test_cors")
      .send({ test: 123 })
      .expect("access-control-allow-origin", "*")
      .expect("access-control-allow-headers", "*")
      .expect("access-control-allow-methods", "*");
  });
});
