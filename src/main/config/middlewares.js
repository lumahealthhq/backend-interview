const { cors } = require("../middlewares/cors");
const { bodyParser } = require("../middlewares/body-parser");
const { contentType } = require("../middlewares/content-type");

module.exports = (app) => {
  app.use(cors);
  app.use(bodyParser);
  app.use(contentType);
};
