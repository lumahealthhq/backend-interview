const request = require("supertest");

const { app } = require("../../../src/main/config/app");

describe("contentType middleware", () => {
  it("Should return default content type as json", async () => {
    app.get("/test_content_type", (_, res) => {
      // returning string
      res.send("");
    });

    await request(app)
      .get("/test_content_type")
      .send({ 1: 2 })
      .expect("content-type", "application/json; charset=utf-8");
  });

  it("Should override json and return xml if forced", async () => {
    app.get("/test_content_type_xml", (req, res) => {
      // manually setting xml
      res.type("xml");
      res.send("");
    });

    await request(app)
      .get("/test_content_type_xml")
      .send({ 1: 2 })
      .expect("content-type", "application/xml; charset=utf-8");
  });
});
