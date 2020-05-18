const router = require("express").Router();

router.get("/api", require("./api"));
router.get("/status", require("./status"));

module.exports = router;