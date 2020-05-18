const {CLUSTER_LOG} = require("../../env");

const router = require("express").Router();
const cors = require("cors");

router.options("*", cors());
router.use(cors());
if (CLUSTER_LOG) router.use(require("./middlewares/cluster-log"));
router.use(require("./middlewares/api-version"));

// {...} routes
router.use(require("./middlewares/accepts"));
router.use(require("./middlewares/body-treat"));
router.use(require("./middlewares/query-limit-offset"));

router.use("/health", require("./health"));
router.use("/patient", require("./patient"));


// error handlers
router.use(require("./middlewares/not-found"));
router.use(require("./middlewares/error-handler"));

module.exports = router;