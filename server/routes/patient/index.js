const router = require("express").Router();

router.get("/", require("./middlewares/require-latlng"), require("./list"));

module.exports = router;