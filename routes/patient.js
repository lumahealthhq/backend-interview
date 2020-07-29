const express = require("express");
const router = express.Router();


const {
   setPatients,
   getDistance,
   getbestgradepatients
} = require("../controllers/patient");


router.get("/getdistance", getDistance);
router.post("/setpatients",setPatients);
router.post("/getbestgradepatients",getbestgradepatients);
module.exports = router;